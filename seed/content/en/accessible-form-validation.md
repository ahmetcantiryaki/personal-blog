---
title: "How to Build Accessible Form Validation Without a Library"
slug: "accessible-form-validation"
translationKey: "accessible-form-validation-2026"
locale: "en"
excerpt: "Short answer: combine the browser's Constraint Validation API with aria-describedby, aria-invalid, and an aria-live region — no library required."
category: "web-development"
tags: ["accessibility", "wcag", "frontend", "best-practices"]
publishedAt: "2026-11-16"
seoTitle: "Accessible Form Validation Without a Library"
seoDescription: "Build accessible form validation using the browser's Constraint Validation API, aria-describedby, and aria-live — no JavaScript library needed."
---

Short answer: pair HTML constraints like `required` and `pattern` with the browser's Constraint Validation API (`setCustomValidity`, `reportValidity`), then wire the error text to the input with `aria-describedby`. Screen readers announce the error correctly, and you keep full control over the visual styling — no library needed.

Most "pretty" form validation looks fine and tells a screen reader user nothing. A red border means nothing to someone who can't see it, and an error message sitting in the DOM but not associated with its input never gets announced either. The pattern below gets both the visual and the programmatic side right; for the broader page-level checklist this pattern fits into, see the [web accessibility checklist](/en/posts/web-accessibility-checklist).

## What is the Constraint Validation API?

The Constraint Validation API is the browser's built-in validation layer for `<input>`, `<select>`, and `<textarea>` elements. It reads HTML attributes like `required`, `pattern`, `minlength`, `maxlength`, and `type`, checks them silently with `checkValidity()`, and shows the browser's own validation bubble with `reportValidity()`. Calling `setCustomValidity(message)` manually marks a field invalid; passing an empty string clears that error. As of November 2026, the whole API has shipped in Chrome, Firefox, and Safari for years — the gap isn't missing browser support, it's that nobody displays the error message accessibly.

One detail trips people up: `minlength` and `maxlength` are only checked against values the user typed. Setting `input.value = "..."` from JavaScript doesn't trigger those constraints, even if you call `checkValidity()` right after. Programmatically set fields need their own validation path.

## What does `:user-invalid` actually do?

The `:user-invalid` CSS pseudo-class matches a field only after the user has interacted with it and moved away while it's still invalid — unlike `:invalid`, which matches an empty required field the moment the page loads. That one-line distinction is what stops a form from turning red across every field before the user has typed anything. Browser support is solid in current Chrome, Firefox, and Safari as of November 2026, but check caniuse.com for your specific target matrix; if you need to support an older Safari version, fall back to `:invalid` combined with a manually toggled `touched` class.

```css
input:user-invalid {
  border-color: #dc2626;
}
input:user-invalid + .error-message {
  display: block;
}
```

## How do you wire the error message to the input?

Reference the error text's `id` from the input's `aria-describedby`, and add `aria-invalid="true"` to the input itself; a screen reader announces both the description and the invalid state when it reaches the field. A common mistake is leaving `aria-invalid="true"` in place forever — once the field becomes valid, set it to `"false"` or remove the attribute, or the screen reader keeps reading a fixed field as broken.

```html
<label for="email">Email</label>
<input
  type="email"
  id="email"
  required
  aria-describedby="email-error"
  aria-invalid="false"
/>
<span id="email-error" class="error-message" role="alert"></span>
```

```javascript
const email = document.getElementById('email')
const emailError = document.getElementById('email-error')

email.addEventListener('blur', () => {
  if (email.validity.valueMissing) {
    email.setCustomValidity('Email address is required.')
  } else if (email.validity.typeMismatch) {
    email.setCustomValidity('Enter a valid email, e.g. name@domain.com.')
  } else {
    email.setCustomValidity('')
  }
  const invalid = !email.checkValidity()
  email.setAttribute('aria-invalid', String(invalid))
  emailError.textContent = invalid ? email.validationMessage : ''
})
```

## How do you announce async validation, like a username check?

For async checks, use a dedicated `aria-live="polite"` region instead of a static `role="alert"` — otherwise every keystroke can trigger an announcement and drown the user in noise. The region needs to exist, empty, in the initial HTML; a container injected into the DOM after the page loads sometimes never gets registered as a live region by the screen reader, so writing text into it later goes unannounced.

```html
<div id="username-status" aria-live="polite" class="sr-only"></div>
```

```javascript
let debounceTimer
username.addEventListener('input', () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    const taken = await checkUsernameTaken(username.value)
    document.getElementById('username-status').textContent = taken
      ? `"${username.value}" is taken, try another.`
      : `"${username.value}" is available.`
  }, 500)
})
```

The debounce delay matters: firing an announcement on every keystroke makes the live region unusable in practice. A 500 ms wait keeps both the network request and the announcement frequency reasonable.

## Where should focus go after a failed submit?

Move focus to the first invalid field when submission fails; otherwise a keyboard user has to scan the whole form to find out what went wrong. [Building Accessible Forms: A Developer's Checklist](/en/posts/building-accessible-forms-checklist) flags this exact step as the one most teams skip — in my own experience, it's also the one that gets dropped first under deadline pressure.

```javascript
form.addEventListener('submit', (e) => {
  const firstInvalid = form.querySelector(':invalid')
  if (firstInvalid) {
    e.preventDefault()
    firstInvalid.focus()
  }
})
```

## How do you test this pattern?

Start with an automated scan using axe-core or Lighthouse's accessibility audit — these tools catch structural mistakes like a missing `label` or a broken `aria-describedby` reference in seconds, but they can't verify announcement timing or ordering. Automated scanning typically catches no more than about a third of real accessibility issues; the rest only surface when a human listens through an actual screen reader.

For manual testing, use NVDA (Windows, free) or VoiceOver (macOS/iOS, built in) to fill out the form by keyboard from start to finish and listen for when each announcement actually fires. There can be small differences between screen readers in how and when `aria-live` announcements land; as of November 2026, current versions of both support the `aria-describedby` + `aria-invalid` + `aria-live="polite"` pattern reliably, but giving an exact compliance percentage would be misleading — don't ship a form labeled "accessible" without listening to it in at least one real screen reader first.

My own observation: one person on the team spending five minutes with NVDA against a new form catches more real bugs than a sprint's worth of automated tests. That doesn't need to happen on every PR, but doing it once per new form pattern is far cheaper than finding out from a user complaint after launch.

## Which WCAG criteria does this pattern satisfy?

The table below maps the pattern above to the relevant WCAG 2.1/2.2 success criteria — the `aria-describedby` + `aria-invalid` + `aria-live` combination covers three criteria at once.

| WCAG Criterion | Level | How this pattern satisfies it |
|---|---|---|
| 3.3.1 Error Identification | A | The invalid field is flagged with `aria-invalid`, and the error text is linked via `aria-describedby` |
| 3.3.3 Error Suggestion | AA | The error message states what to do, not just that something is wrong (e.g. "use the format name@domain.com") |
| 4.1.3 Status Messages | AA | Async results are announced via `aria-live="polite"` without stealing focus |

## Frequently Asked Questions

### Do you need a library for accessible form validation?

No, not for simple forms. The Constraint Validation API, `aria-describedby`, and one `aria-live` region cover most of the accessibility work a library like React Hook Form would otherwise do, with zero dependencies; for complex, multi-step forms, [Accessible React Forms with RHF and Zod](/en/posts/react-hook-form-zod-accessible-forms) can still save real time.

### What's the difference between `:invalid` and `:user-invalid`?

Short answer: `:invalid` matches an empty required field the instant the page loads, while `:user-invalid` only matches after the user has interacted with the field and moved away while it's still invalid. That difference is what keeps a form from turning red before anyone has typed anything.

### Why doesn't an `aria-live` region get announced sometimes?

The most common cause is that the element carrying `aria-live` wasn't present in the DOM when the page first loaded; if the region gets inserted later via JavaScript, some screen readers never register it as a live region. The fix is to put the empty `aria-live` container in your initial HTML and fill its content afterward.

### When do you need to clear `setCustomValidity`?

The moment the field becomes valid again, call it with an empty string: `input.setCustomValidity('')`. Skipping this is a common bug that leaves the form stuck invalid even after the user fixes the problem.

For more on this topic, browse the [web development](/en/category/web-development) category.

**Sources:** [MDN — Using HTML form validation and the Constraint Validation API](https://developer.mozilla.org/docs/Web/HTML/Constraint_validation), [W3C WAI — Using ARIA Live Regions to Identify Errors](https://www.w3.org/WAI/GL/wiki/Using_ARIA_Live_Regions_or_role=alert_to_Identify_Errors), [WCAG 2.2 — Understanding Error Identification](https://www.w3.org/WAI/WCAG22/Understanding/error-identification).
