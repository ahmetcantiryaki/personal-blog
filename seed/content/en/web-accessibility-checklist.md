---
title: "Web Accessibility Checklist (WCAG 2.2)"
slug: "web-accessibility-checklist"
translationKey: "web-accessibility-checklist"
locale: "en"
excerpt: "A practical web accessibility checklist for WCAG 2.2: test contrast, keyboard, focus, target size, and forms, then fix the issues that fail an audit — updated for 2026 law."
category: "web-development"
tags: ["accessibility", "frontend", "wcag", "web-standards"]
publishedAt: "2026-07-05"
seoTitle: "Web Accessibility Checklist (WCAG 2.2) — 2026"
seoDescription: "A WCAG 2.2 web accessibility checklist: contrast, keyboard, focus, target size, and forms. Updated with EAA, ADA, and WebAIM Million 2025 data for 2026."
---

**94.8%** of the top one million home pages have at least one automatically detectable WCAG failure, and **79.1%** fail on something as basic as low color contrast ([WebAIM Million 2025](https://webaim.org/projects/million/2025)). Accessibility isn't exotic — most ordinary sites fail on the very first item, which is why this web accessibility checklist front-loads the basics.

Work through the items in order and test with a real screen reader and keyboard, and you'll clear the WCAG 2.2 AA checks that matter most for compliance and real users in 2026.

## What is WCAG 2.2 and which level should you target?

WCAG 2.2 is the [W3C's current Web Content Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/) recommendation, published **5 October 2023**. As of July 2026 it's still the standard in force: WCAG 3.0 is only a Working Draft (latest March 2026, 174 outcomes) and isn't expected to reach Recommendation before 2028 — and even then it will coexist with 2.2, not replace it. The right target today is clear: **WCAG 2.2 AA**.

WCAG 2.2 adds nine new success criteria on top of 2.1 under four principles: content must be **Perceivable, Operable, Understandable, and Robust** (POUR).

| Level | What it covers | Who targets it |
|-------|----------------|----------------|
| A | Critical barriers (keyboard, alt text) | Absolute minimum |
| AA | Contrast, focus, target size, forms | Legal baseline (ADA, EAA, EN 301 549) |
| AAA | Sign language, 7:1 contrast | Selected high-impact flows only |

One freshness note: WCAG 2.2 **removed criterion 4.1.1 (Parsing)** because modern browsers handle malformed markup gracefully. If an old audit template lists it, drop it.

## Where does accessibility stand legally in 2026?

The pressure is rising. The European Accessibility Act (EAA) has been in force since **28 June 2025**; the first EAA lawsuits landed in **November 2025** in France, with fines ranging from ~€60,000 in Ireland to ~€900,000 in Sweden.

- **EAA / EN 301 549:** The harmonized standard (v3.2.1) references WCAG 2.1 AA; the expected **v4.1.1 in 2026 moves to WCAG 2.2**.
- **US ADA Title II:** The DOJ [extended compliance dates](https://www.ada.gov/resources/web-rule-first-steps/) by a year in April 2026 — WCAG 2.1 AA by **26 April 2027** for populations of 50,000+, and **26 April 2028** for smaller entities.

Even where the law still cites 2.1, target 2.2 AA: it's a backward-compatible superset and where audits are heading.

## The WCAG 2.2 accessibility checklist (step by step)

Run these checks in order. The early steps catch the highest-frequency failures, so you get the biggest compliance gain fastest:

1. **Check color contrast.** Text needs at least **4.5:1** (3:1 for large text, 18px bold or 24px regular). UI components and graphics need **3:1** (SC 1.4.11) — WebAIM's single most common failure.
2. **Add meaningful alt text.** Every informative `<img>` needs an `alt`; decorative images get `alt=""` (SC 1.1.1).
3. **Test full keyboard operability.** Tab through the whole page. Every interactive element must be usable without a mouse, with no keyboard traps (SC 2.1.1, 2.1.2).
4. **Verify visible focus.** The focused element needs a clear indicator, not hidden behind sticky headers or cookie bars (SC 2.4.7, 2.4.11 — new in 2.2).
5. **Size touch targets.** Interactive targets must be at least **24×24 CSS pixels**, or have enough spacing (SC 2.5.8 — new in 2.2).
6. **Provide a drag alternative.** Any drag action must also work with a single tap or click (SC 2.5.7 — new in 2.2).
7. **Label every form field.** Associate a `<label>` with each input, expose errors in text, and don't rely on placeholders alone (SC 1.3.1, 3.3.1, 3.3.2).
8. **Structure with real headings and landmarks.** Use `<h1>`–`<h6>` in order and semantic landmarks (`<nav>`, `<main>`, `<footer>`) so screen reader users can navigate (SC 1.3.1, 2.4.1).
9. **Set the page language.** Add `lang` to `<html>` so assistive tech pronounces content correctly (SC 3.1.1).
10. **Scan first, then test manually.** Tools catch about a third of issues; the rest need a human with a screen reader.

## How do you test color contrast correctly?

WCAG 2.2 requires **4.5:1** contrast for normal text and **3:1** for large text or non-text UI elements like icons and input borders. The fastest check is Chrome DevTools, which shows the ratio in the color picker. Watch the traps automated tools miss:

- **Text over images or gradients.** A scanner reads one background pixel; a photo has many. Add a solid overlay or text shadow — we cover the image workflow in our [image optimization guide](/en/posts/optimize-images-web-performance).
- **Disabled states.** Exempt, but a "disabled-looking" button that's actually clickable still needs to pass.
- **Focus and hover colors.** The focus indicator itself needs 3:1 contrast against adjacent colors.

```css
/* A visible, high-contrast focus ring that survives sticky headers */
:focus-visible {
  outline: 3px solid #1a5fff;
  outline-offset: 2px;
}
```

It's easy to clobber the focus ring when styling with utility classes; we collected the common traps in our [Tailwind CSS mistakes article](/en/posts/tailwind-css-mistakes).

## What are the new WCAG 2.2 success criteria?

[WCAG 2.2 introduced nine new criteria](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/); six apply at Level A or AA, so they're now part of your compliance baseline. The headline changes target keyboard and touch users, plus people who struggle with authentication and repetitive entry.

- **Focus Not Obscured (2.4.11, AA):** The focused element can't be fully hidden by a sticky header, footer, or floating widget — this breaks a lot of otherwise-fine sites.
- **Dragging Movements (2.5.7, AA):** Sliders, reorderable lists, and maps need a non-drag alternative like tap-to-select or +/− buttons.
- **Target Size Minimum (2.5.8, AA):** Small icon buttons and tightly packed links must be 24×24px or spaced apart. Audit mobile nav and pagination first.
- **Accessible Authentication (3.3.8, AA):** Don't force a cognitive test like transcribing characters. Allow password managers, paste, and copy; avoid puzzle CAPTCHAs. Passkeys satisfy this by design — see our [passkeys and WebAuthn guide](/en/posts/passkeys-webauthn-guide).
- **Redundant Entry (3.3.7, A):** Don't make users re-enter information they already gave in the same process.
- **Consistent Help (3.2.6, A):** Keep help mechanisms (contact, chat) in the same relative place across pages.

## How do you make forms accessible?

Accessible forms come down to three things: every field has a programmatic label, errors are announced in text, and required fields are marked so screen readers can read them. Placeholder text is not a label — it disappears on input and often fails contrast.

```html
<label for="email">Email address</label>
<input
  id="email"
  name="email"
  type="email"
  required
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">Please enter a valid email address.</p>
```

Key form checks:

- **Link errors to fields** with `aria-describedby` so the message is read when focus lands on the input.
- **Announce validation** with `role="alert"` or a live region rather than color alone.
- **Group related controls** (radio sets, addresses) in a `<fieldset>` with a `<legend>`.
- **Never disable zoom** with `user-scalable=no`.

## What tools should you use to audit accessibility?

Start with automated scanners to clear the easy 30–40%, then test manually. Automation reliably catches missing alt text, contrast failures, and unlabeled fields, but it can't judge whether focus order makes sense or whether alt text is meaningful. That gap needs a human.

- **axe DevTools / Lighthouse:** Fast in-browser scans for the mechanical rules.
- **WAVE:** Visual overlay that highlights structure and contrast issues.
- **Screen readers:** NVDA (Windows, free), VoiceOver (macOS/iOS), and TalkBack (Android). Read a full flow, don't just poke at one widget.
- **Keyboard only:** Unplug the mouse and complete a real task end to end.

Wire accessibility into CI like a performance budget; we set up a similar checklist in our [Core Web Vitals guide](/en/posts/core-web-vitals-checklist). For more, see the [web development category](/en/category/web-development).

## Common accessibility mistakes that fail audits

The recurring issues we flag in nearly every first-time audit:

- **`div`s acting as buttons.** A clickable `<div>` isn't focusable or announced. Use a real `<button>`, or add `role`, `tabindex`, and key handlers.
- **Contrast that fails only on hover or focus.** Teams test the default state and forget the others.
- **Focus hidden behind sticky UI.** The new 2.4.11 rule fails silently until someone tabs into it.
- **Alt text that describes nothing.** `alt="image"` or a filename is worse than useless; state the content or purpose.
- **Skipped heading levels.** Jumping from `<h2>` to `<h4>` breaks screen reader navigation.

WebAIM's data makes a blunt point: the six most common failures have been the same for five years running. Fix these and most pages clear the bulk of a WCAG 2.2 AA audit.

## Frequently Asked Questions

### Is WCAG 2.2 legally required in 2026?

In practice, yes for most organizations. The EU's European Accessibility Act (in force since June 2025) and EN 301 549 reference WCAG AA, and US ADA Title II binds public entities to WCAG 2.1 AA with 2027–2028 deadlines. Targeting 2.2 AA is the safe baseline.

### What's the difference between WCAG 2.1 and 2.2?

WCAG 2.2 keeps everything from 2.1 and adds nine new success criteria (keyboard, touch targets, authentication), while removing the outdated 4.1.1 Parsing criterion. If you already meet 2.1 AA you're close, but you must still address the six new A/AA criteria.

### Is WCAG 3.0 out — should I wait for it?

Don't wait. As of July 2026, WCAG 3.0 is still a Working Draft (March 2026) and isn't expected to reach Recommendation before 2028. When it lands it won't invalidate 2.2 AA, so investing in 2.2 today isn't wasted work.

### Can automated tools fully test accessibility?

No. Automated tools reliably catch only about 30–40% of WCAG issues — mostly mechanical ones like contrast and missing labels. Judgment-based checks (logical focus order, meaningful alt text, clear errors) require manual testing with a keyboard and a screen reader.
