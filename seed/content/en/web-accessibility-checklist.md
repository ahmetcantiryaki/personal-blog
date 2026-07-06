---
title: "Web Accessibility Checklist (WCAG 2.2)"
slug: "web-accessibility-checklist"
translationKey: "web-accessibility-checklist"
locale: "en"
excerpt: "A practical web accessibility checklist for WCAG 2.2: test contrast, keyboard access, focus, target size, and forms, then fix the issues that fail an audit."
category: "web-development"
tags: ["accessibility", "frontend", "wcag", "web-standards"]
publishedAt: "2026-05-12"
seoTitle: "Web Accessibility Checklist (WCAG 2.2)"
seoDescription: "A practical web accessibility checklist for WCAG 2.2: test contrast, keyboard, focus, target size, and forms, then fix the issues that fail an audit."
---

This web accessibility checklist walks you through the WCAG 2.2 Level AA criteria that actually fail audits: color contrast, keyboard operability, visible focus, target size, and accessible forms. Work through it in order, test with a real screen reader and keyboard, and you'll clear the checks that matter most for both compliance and real users in 2026.

Most teams don't fail on exotic rules; they fail on a handful of basics, and this list front-loads those.

## What is WCAG 2.2 and which level should you target?

WCAG 2.2 is the W3C's current Web Content Accessibility Guidelines recommendation, published on **5 October 2023**. It adds nine new success criteria on top of WCAG 2.1 and organizes everything under four principles: content must be **Perceivable, Operable, Understandable, and Robust** (POUR). Target **Level AA**, the standard cited by most laws.

Level A is the bare minimum, AA is the legal and practical baseline, and AAA is aspirational. The European Accessibility Act, in force since **28 June 2025**, effectively makes AA mandatory for many digital products sold in the EU.

| Level | What it covers | Who targets it |
|-------|----------------|----------------|
| A | Critical barriers (keyboard, alt text) | Absolute minimum |
| AA | Contrast, focus, target size, forms | Legal baseline (ADA, EAA, EN 301 549) |
| AAA | Sign language, 7:1 contrast | Selected high-impact flows only |

One freshness note: WCAG 2.2 **removed criterion 4.1.1 (Parsing)** because modern browsers handle malformed markup gracefully. If an old audit template still lists it, drop it.

## The WCAG 2.2 accessibility checklist (step by step)

Run these checks in order. The early steps catch the highest-frequency failures, so you get the biggest compliance gain fastest:

1. **Check color contrast.** Text needs a ratio of at least **4.5:1** (3:1 for large text, 18px bold or 24px regular). UI components and graphics need **3:1** (SC 1.4.11).
2. **Add meaningful alt text.** Every informative `<img>` needs an `alt`; decorative images get `alt=""` so screen readers skip them (SC 1.1.1).
3. **Test full keyboard operability.** Tab through the whole page. Every interactive element must be reachable and usable without a mouse, with no keyboard traps (SC 2.1.1, 2.1.2).
4. **Verify visible focus.** The focused element must have a clear indicator, and it must not be hidden behind sticky headers or cookie bars (SC 2.4.7, 2.4.11 — new in 2.2).
5. **Size touch targets.** Interactive targets must be at least **24×24 CSS pixels**, or have enough spacing around them (SC 2.5.8 — new in 2.2).
6. **Provide a drag alternative.** Any action done by dragging must also work with a single tap or click (SC 2.5.7 — new in 2.2).
7. **Label every form field.** Associate a `<label>` with each input, expose errors in text, and don't rely on placeholder text alone (SC 1.3.1, 3.3.1, 3.3.2).
8. **Structure with real headings and landmarks.** Use `<h1>`–`<h6>` in order and semantic landmarks (`<nav>`, `<main>`, `<footer>`) so screen reader users can navigate (SC 1.3.1, 2.4.1).
9. **Set the page language.** Add `lang` to the `<html>` element so assistive tech pronounces content correctly (SC 3.1.1).
10. **Run an automated scan, then test manually.** Tools catch about a third of issues; the rest need a human with a screen reader.

## How do you test color contrast correctly?

Color contrast measures the luminance ratio between text and its background. WCAG 2.2 requires at least **4.5:1** for normal text and **3:1** for large text or non-text UI elements like icons and input borders. The fastest check is Chrome DevTools, which shows the ratio right in the color picker.

Watch the traps that automated tools miss:

- **Text over images or gradients.** A scanner reads one background pixel; a photo has many. Add a solid overlay or text shadow to guarantee the ratio everywhere.
- **Disabled states.** These are exempt, but a "disabled-looking" button that's actually clickable still needs to pass.
- **Focus and hover colors.** The focus indicator itself needs 3:1 contrast against adjacent colors.

```css
/* A visible, high-contrast focus ring that survives sticky headers */
:focus-visible {
  outline: 3px solid #1a5fff;
  outline-offset: 2px;
}
```

For a deeper look at how color choices affect readability, see our [guide to accessible color systems](/blog/accessible-color-systems).

## What are the new WCAG 2.2 success criteria?

WCAG 2.2 introduced nine new criteria, and six of them apply at Level A or AA — meaning they're now part of your compliance baseline. The headline changes target keyboard and touch users, plus people who struggle with authentication and repetitive data entry.

The ones that reshape day-to-day frontend work:

- **Focus Not Obscured (2.4.11, AA):** The focused element can't be fully hidden by a sticky header, footer, or floating widget. This breaks a lot of otherwise-fine sites.
- **Dragging Movements (2.5.7, AA):** Sliders, reorderable lists, and map interactions need a non-drag alternative like tap-to-select or plus/minus buttons.
- **Target Size Minimum (2.5.8, AA):** Small icon buttons and tightly packed links must be 24×24px or spaced apart. Audit your mobile nav and pagination first.
- **Accessible Authentication (3.3.8, AA):** Don't force a cognitive test like transcribing characters. Allow password managers, paste, and copy; avoid puzzle CAPTCHAs.
- **Redundant Entry (3.3.7, A):** Don't make users re-enter information they already gave in the same process.
- **Consistent Help (3.2.6, A):** Keep help mechanisms (contact link, chat) in the same relative place across pages.

We break down the focus and target-size rules in detail in our [WCAG 2.2 keyboard navigation guide](/blog/keyboard-navigation-wcag).

## How do you make forms accessible?

Accessible forms come down to three things: every field has a programmatic label, errors are announced in text, and required fields are marked in a way screen readers can read. Placeholder text is not a label — it disappears on input and often fails contrast. Bind a real `<label>` to each control.

A robust, accessible field looks like this:

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
- **Never disable zoom** with `user-scalable=no`; low-vision users rely on it.

## What tools should you use to audit accessibility?

Start with automated scanners to clear the easy 30–40%, then move to manual testing for the rest. Automation reliably catches missing alt text, contrast failures, and unlabeled fields, but it can't judge whether focus order makes sense or whether alt text is actually meaningful. That gap needs a human.

- **axe DevTools / Lighthouse:** Fast in-browser scans for the mechanical rules.
- **WAVE:** Visual overlay that highlights structure and contrast issues.
- **Screen readers:** Test with NVDA (Windows, free), VoiceOver (macOS/iOS), and TalkBack (Android). Read a full flow, don't just poke at one widget.
- **Keyboard only:** Unplug the mouse and complete a real task end to end.

For where accessibility fits into your build process, see our [frontend testing strategy article](/blog/frontend-testing-strategy) and the [other web development guides](/blog/web-development).

## Common accessibility mistakes that fail audits

The recurring issues we flag in nearly every first-time audit:

- **`div`s acting as buttons.** A clickable `<div>` isn't focusable or announced. Use a real `<button>`, or add `role`, `tabindex`, and key handlers.
- **Contrast that fails only on hover or focus.** Teams test the default state and forget the others.
- **Focus hidden behind sticky UI.** The new 2.4.11 rule fails silently until someone tabs into it.
- **Alt text that describes nothing.** `alt="image"` or a filename describes nothing; state the content or purpose.
- **Skipped heading levels.** Jumping from `<h2>` to `<h4>` breaks screen reader navigation.

Fix these five and most pages clear the bulk of a WCAG 2.2 AA audit.

## Frequently Asked Questions

### Is WCAG 2.2 legally required in 2026?

In practice, yes for most organizations. The EU's European Accessibility Act (in force since June 2025) and standards like EN 301 549 reference WCAG Level AA, and US ADA case law consistently points to WCAG as the benchmark. Targeting 2.2 AA is the safe baseline in 2026.

### What's the difference between WCAG 2.1 and 2.2?

WCAG 2.2 keeps everything from 2.1 and adds nine new success criteria (focused on keyboard, touch targets, and authentication), while removing the outdated 4.1.1 Parsing criterion. If you already meet 2.1 AA, you're close, but you must still address the six new A/AA criteria in 2.2.

### Can automated tools fully test accessibility?

No. Automated tools reliably catch only about 30–40% of WCAG issues — mostly mechanical ones like contrast and missing labels. Judgment-based checks (logical focus order, meaningful alt text, clear error messages) require manual testing with a keyboard and a screen reader.

### What contrast ratio does WCAG 2.2 require?

Level AA requires at least 4.5:1 for normal text, 3:1 for large text (18px bold or 24px regular), and 3:1 for non-text elements such as icons, input borders, and focus indicators. Level AAA raises the normal-text requirement to 7:1.
