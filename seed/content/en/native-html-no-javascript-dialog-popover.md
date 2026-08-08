---
title: "HTML You No Longer Need JavaScript For"
slug: "native-html-no-javascript-dialog-popover"
translationKey: "native-html-no-js-dialog-popover"
locale: "en"
excerpt: "You don't need a library for modals, menus, tooltips, or accordions anymore. How to build these with native dialog, the Popover API, and CSS anchor positioning."
category: "web-development"
tags: ["css", "accessibility", "frontend", "web-standards"]
publishedAt: "2026-08-08"
seoTitle: "Native HTML You No Longer Need JS For"
seoDescription: "How do you build modals, menus, tooltips, and accordions with native dialog, the Popover API, CSS anchor positioning, and details? A 2026 support-backed guide."
---

If you're still reaching for a JavaScript library for a modal, a dropdown menu, or a tooltip, you're probably hand-rewriting something the browser now ships for free. As of 2026, `<dialog>`, the Popover API, CSS anchor positioning, and `<details>` are supported across every major browser — and they handle the most annoying details, focus management and keyboard accessibility, for you.

## Modals: `<dialog>`

The `<dialog>` element is now a native solution for modal and non-modal dialogs. Calling `showModal()` automatically adds a backdrop, traps focus inside the dialog, and supports closing with Escape — none of which you write by hand:

```html
<dialog id="confirm-dialog">
  <form method="dialog">
    <p>Confirm this action?</p>
    <button value="cancel">Cancel</button>
    <button value="confirm">Confirm</button>
  </form>
</dialog>

<script>
  const dialog = document.getElementById('confirm-dialog')
  document.getElementById('open-btn').addEventListener('click', () => dialog.showModal())
</script>
```

A form with `method="dialog"` automatically closes the dialog when any submit button is clicked and writes that button's `value` to `dialog.returnValue` — you don't need to write the close logic yourself.

## Menus and Tooltips: The Popover API

According to [Chrome for Developers' introduction](https://developer.chrome.com/blog/introducing-popover-api/), the Popover API reached Baseline Widely Available in early 2025 — meaning full support across Chrome, Firefox, Safari, and Edge. The `popovertarget` attribute wires a button to a popover element in a single line:

```html
<button popovertarget="user-menu">Menu</button>

<div id="user-menu" popover>
  <a href="/profile">Profile</a>
  <a href="/settings">Settings</a>
  <a href="/logout">Log out</a>
</div>
```

The browser handles closing on outside click, Escape key support, and correct ARIA association on its own. You can opt out of that auto-close behavior with `popover="manual"` — useful if, say, you don't want a notification panel to close on an outside click.

## Positioning: CSS Anchor Positioning

Where the Popover API falls short is positioning — placing a tooltip directly below its trigger button, then flipping it upward if it would overflow the viewport, has traditionally required a JavaScript library like Floating UI. CSS anchor positioning brings that to native CSS:

```css
.tooltip {
  position: fixed;
  position-anchor: --trigger;
  top: anchor(bottom);
  left: anchor(left);
  position-try-fallbacks: flip-block, flip-inline;
}

.trigger-button {
  anchor-name: --trigger;
}
```

`position-try-fallbacks` automatically shifts the tooltip to an alternate position if it would overflow the screen — the CSS equivalent of Floating UI's "collision detection." See [MDN's documentation on the anchor() function](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/anchor) for the full syntax and browser support details.

## Browser Support Table

| Feature | Baseline status (mid-2026) | Note |
|---|---|---|
| `<dialog>` | Full support, all major browsers | Focus trap and backdrop are native |
| Popover API | Baseline Widely Available (since April 2025) | Zero JS with `popovertarget` |
| CSS anchor positioning (level 1) | Baseline 2026, Chrome 125+/Firefox 132+/Safari 18.2+ | Covers roughly 91% of global traffic |
| CSS anchor positioning (level 2) | Chromium browsers only | Targeted for Interop 2026, expected to spread by year end |
| `<details>`/`<summary>` | Full support, for years | Zero JS for accordions |

## Accordions: `<details>`

Accordion components typically get a state library, or at least a handful of `useState` calls — but `<details>`/`<summary>` does this natively, with zero JavaScript:

```html
<details>
  <summary>FAQ Question Title</summary>
  <p>The answer text goes here.</p>
</details>
```

Multiple `<details>` elements sharing a `name` attribute form a group where only one can stay open at a time — you get the classic "accordion" behavior with a single attribute. Track current browser support percentages via [caniuse's anchor positioning table](https://caniuse.com/css-anchor-positioning).

## Invoker Commands: A General Mechanism

Another feature that reached Baseline in early 2026 is invoker commands, built on the `command` and `commandfor` attributes. This mechanism generalizes what `popovertarget` does — it lets any button trigger a specific action on any target element:

```html
<button command="show-modal" commandfor="my-dialog">Open</button>
<dialog id="my-dialog">...</dialog>
```

Here, `command="show-modal"` natively calls the target `<dialog>` element's `showModal()` method when the button is clicked — you don't even need to write an `addEventListener`. Other commands like `close`, `toggle-popover`, and `show-popover` work the same way with these same attributes. This means native elements can now talk to each other, not just operate on their own, entirely without JavaScript.

## Where You Still Need a Little JavaScript

These native elements don't solve everything. Form validation inside a modal, dynamically loading a popover's content, or customizing an accordion's open/close animation still needs JavaScript. The difference is you're now writing JavaScript to manage *content*, not to reinvent *behavior* — focus management, keyboard accessibility, positioning. That distinction matters for accessibility too — as we detailed in [our web accessibility checklist](/en/posts/web-accessibility-checklist), hand-rolled focus-trap logic usually ends up incomplete; native elements guarantee it at the browser level.

## When You Still Need a Library

If you need a complex, multi-step combobox, a draggable modal, or custom transition animations, native elements may not offer enough flexibility yet. But for the 80% case — simple modals, menus, tooltips, and accordions — the case for staying dependent on a library keeps getting weaker, especially if you're trying to cut your bundle size.

## Replace This JS With This HTML: Quick Reference

| Old approach | Native replacement |
|---|---|
| `react-modal`, custom overlay + focus-trap | `<dialog>` + `showModal()` |
| Headless UI Menu, custom dropdown | Popover API + `popovertarget` |
| Floating UI / Popper.js | CSS anchor positioning |
| Accordion state library | `<details>`/`<summary>` + `name` |

Used together with container queries, these native elements pair well with the responsive approach we covered in [our CSS container queries piece](/en/posts/css-container-queries-how-to) — both are part of the same philosophy of getting the browser itself to do more work without JavaScript. If you're using Tailwind, as we mentioned in [our Tailwind CSS mistakes piece](/en/posts/tailwind-css-mistakes), pairing these native elements with utility classes generally works without friction.

## Frequently Asked Questions

### Can I drop modal libraries entirely with `<dialog>`?

For simple confirmation or form modals, yes. Complex transition animations or nested modal management may still need extra JavaScript, but the core focus/backdrop/Escape behavior comes native.

### What's the difference between the Popover API and `<dialog>`?

The Popover API is designed for non-modal content, like menus and tooltips, that shouldn't block the rest of the page. `<dialog>` is better suited for modal interactions that need to make the rest of the page non-interactive.

### Does CSS anchor positioning work in every browser?

Level 1 is at Baseline 2026 status in current versions of Chrome, Firefox, and Safari. Level 2 is currently Chromium-only; since it's part of the Interop 2026 goals, it's expected to spread to other browsers by year end.

### What happens to these elements in older browsers?

In an unsupported browser, `<dialog>` behaves like a plain `<div>`, and the popover attribute is simply ignored. If a critical flow needs older browser support, you'll need to plan a polyfill or a progressive-enhancement strategy.
