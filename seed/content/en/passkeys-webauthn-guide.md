---
title: "Passkeys and WebAuthn: A Developer's Guide"
slug: "passkeys-webauthn-guide"
translationKey: "passkeys-webauthn-guide"
locale: "en"
excerpt: "A practical passkeys WebAuthn guide: how passkeys work, a working registration and login flow with SimpleWebAuthn, and the edge cases that break in production."
category: "web-development"
tags: ["authentication", "web-security", "frontend", "passkeys"]
publishedAt: "2026-06-30"
seoTitle: "Passkeys and WebAuthn: A Developer's Guide"
seoDescription: "A hands-on passkeys WebAuthn guide: how the ceremony works, a full registration and login flow with code, and the production gotchas nobody warns you about."
---

This passkeys WebAuthn guide gets you from zero to a working, phishing-resistant login. Passkeys are cryptographic credentials that replace passwords; WebAuthn is the browser API you call to create and use them. You keep the public key, the user's device keeps the private key, and there is nothing on your server for an attacker to steal or phish.

If you have shipped OAuth or magic links before, this will feel familiar. The mental model is a two-message challenge–response, and most of the work is bookkeeping, not cryptography.

## What are passkeys and how do they relate to WebAuthn?

A passkey is a FIDO2 credential bound to a website's origin, backed by a public/private key pair. WebAuthn (Web Authentication) is the W3C browser API that creates and uses that key pair via `navigator.credentials`. The private key never leaves the user's authenticator; your server only ever sees and stores the public key.

The terms get blurred, so keep them straight:

- **WebAuthn** is the browser-facing API (`navigator.credentials.create` and `.get`).
- **CTAP2** is the protocol between the browser and an authenticator like a phone or a YubiKey.
- **FIDO2** is the umbrella covering both.
- A **passkey** is a *discoverable* WebAuthn credential, usually synced across a user's devices through iCloud Keychain, Google Password Manager, or a third-party manager like 1Password or Bitwarden.

The syncing part is what made passkeys mainstream. Older WebAuthn credentials were device-bound, so losing the device meant losing the account. Synced passkeys removed that cliff and turned WebAuthn from an enterprise second factor into a primary login for everyone.

## How does passkey authentication work?

Passkey authentication is a challenge–response ceremony. Your server issues a random challenge, the authenticator signs it with the private key after verifying the user (Face ID, fingerprint, or PIN), and your server checks the signature against the stored public key. Nothing reusable crosses the wire, which is why passkeys resist phishing and credential-stuffing.

Here is the login flow end to end:

1. The user clicks **Sign in** (or focuses an autofill-enabled field).
2. Your server generates a random **challenge** and returns it with the relying party ID.
3. The browser calls `navigator.credentials.get()` with that challenge.
4. The authenticator asks the user to verify with biometrics or a PIN.
5. The authenticator signs the challenge with the private key and returns an **assertion**.
6. The browser hands the assertion back to your JavaScript.
7. Your server looks up the stored public key by credential ID.
8. Your server verifies the signature, the origin, and the challenge.
9. Your server checks the **signature counter** to detect cloned authenticators.
10. On success, you create a session as usual.

Registration is the mirror image: the server sends creation options, `navigator.credentials.create()` generates the key pair, and you store the returned public key and credential ID against the user.

## Passkeys vs passwords vs OTP: which should you use?

Passkeys win on both security and friction for most consumer and SaaS logins. Passwords are phishable and reused; SMS OTP is phishable and vulnerable to SIM-swaps; TOTP apps resist phishing better but still push manual work onto users. Passkeys remove the shared secret entirely, so there is nothing to intercept, replay, or leak in a breach.

| Factor | Passwords | SMS OTP | TOTP app | Passkeys |
|--------|-----------|---------|----------|----------|
| Phishing-resistant | No | No | Partial | **Yes** |
| Server stores a secret | Yes (hash) | No | Yes (seed) | **No (public key only)** |
| Survives a DB breach | No | n/a | No | **Yes** |
| User friction | Medium | Medium | High | **Low (biometric)** |
| Works cross-device | Yes | Yes | Manual | **Yes (synced)** |

The one honest tradeoff: passkeys depend on the user's platform ecosystem and account recovery. Keep a fallback login path until adoption is high, and treat account recovery as a first-class flow, not an afterthought.

## How to implement passkeys with WebAuthn

Do not hand-roll the crypto. Use a maintained library that handles CBOR parsing, attestation, and origin checks. On Node we use **SimpleWebAuthn** (`@simplewebauthn/server` v13, released early 2026); the Python equivalent is `py_webauthn`, and for the JVM there is `webauthn4j`. Below is the core of both ceremonies with SimpleWebAuthn.

### Registration (creating a passkey)

```ts
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

// 1. Server: generate options and store the challenge in the session
const options = await generateRegistrationOptions({
  rpName: 'Woyable',
  rpID: 'woyable.com',
  userName: user.email,
  attestationType: 'none',
  authenticatorSelection: {
    residentKey: 'required',      // makes it a discoverable passkey
    userVerification: 'preferred',
  },
});
req.session.challenge = options.challenge;

// 2. Server: verify what the browser returns
const verification = await verifyRegistrationResponse({
  response: bodyFromClient,
  expectedChallenge: req.session.challenge,
  expectedOrigin: 'https://woyable.com',
  expectedRPID: 'woyable.com',
});

if (verification.verified) {
  const { credential } = verification.registrationInfo;
  await db.saveCredential({
    userId: user.id,
    credentialId: credential.id,
    publicKey: credential.publicKey,   // store this, not a password
    counter: credential.counter,
  });
}
```

On the client, pass `options` to `startRegistration()` from `@simplewebauthn/browser` and POST the result back.

### Authentication with conditional UI (autofill)

The best passkey UX is **conditional UI**: the browser surfaces passkeys right in the username field's autofill dropdown, so returning users never type anything. Enable it by adding `autocomplete="username webauthn"` to the input and calling `startAuthentication({ ..., useBrowserAutofill: true })` on page load.

```ts
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const options = await generateAuthenticationOptions({
  rpID: 'woyable.com',
  userVerification: 'preferred',
  // empty allowCredentials => discoverable passkeys drive the picker
});
req.session.challenge = options.challenge;

const verification = await verifyAuthenticationResponse({
  response: bodyFromClient,
  expectedChallenge: req.session.challenge,
  expectedOrigin: 'https://woyable.com',
  expectedRPID: 'woyable.com',
  credential: storedCredential,
  requireUserVerification: true,
});

if (verification.verified) {
  await db.updateCounter(storedCredential.id, verification.authenticationInfo.newCounter);
  createSession(user);
}
```

## What broke for us in production and how we fixed it

Three things bit us when we rolled passkeys out, and none were in the happy-path tutorials.

- **The `rpID` / origin mismatch.** WebAuthn silently rejects everything if `rpID` is not a registrable suffix of the origin. Our staging box ran on a `*.vercel.app` preview URL, so credentials made against `preview-abc.vercel.app` were useless on `woyable.com`. Fix: pin `rpID` to your real apex domain in every non-preview environment and test on it directly.
- **Localhost worked, HTTP staging didn't.** WebAuthn requires a secure context. `localhost` is exempted, so it lulls you into thinking things work; the first HTTP-only staging deploy returned `NotAllowedError`. Fix: serve every non-localhost environment over HTTPS, no exceptions.
- **Orphaned credentials after a device wipe.** Users who reset a phone left dead credential IDs, and login just failed with no explanation. Fix: adopt the WebAuthn **Signal API** (`PublicKeyCredential.signalUnknownCredential`) so the platform prunes credentials you no longer recognize, and always keep a working email fallback.

For the surrounding architecture, see our [web security fundamentals guide](/blog/web-security-fundamentals) and how sessions fit in our [authentication patterns overview](/blog/authentication-patterns). If you are hardening the browser layer, pair this with our [content security policy guide](/blog/content-security-policy) and the broader [web development guides](/blog/web-development).

## Frequently Asked Questions

### Are passkeys stored on my server?

No. You store only the **public key** and a credential ID. The private key stays inside the user's authenticator and, for synced passkeys, inside their platform keychain. A database breach exposes nothing an attacker can log in with, which is the whole point of a passkeys WebAuthn setup.

### Do passkeys work across different devices and browsers?

Yes, in two ways. Synced passkeys roam automatically across a user's devices in the same ecosystem (Apple, Google, or a password manager). For cross-ecosystem logins, WebAuthn's hybrid transport lets a user scan a QR code and approve with a nearby phone over Bluetooth proximity, without installing anything.

### What happens if a user loses their device?

Synced passkeys survive because they live in the cloud keychain, not just the lost device, so a new phone restores them on sign-in. Device-bound passkeys (like a hardware key) do not sync, so you must let users register more than one credential and offer a recovery path such as email verification.

### Do I need to handle attestation?

Usually not. For consumer apps, set `attestationType: 'none'`; attestation adds privacy friction and buys you little. Only request attestation when a compliance regime or enterprise policy demands proof of the exact authenticator model, and be ready to maintain a trusted-root list if you do.
