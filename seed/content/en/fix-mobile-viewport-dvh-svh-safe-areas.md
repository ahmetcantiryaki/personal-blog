---
title: "Why Does 100vh Overflow on Mobile? Fix It With dvh"
slug: "fix-mobile-viewport-dvh-svh-safe-areas"
translationKey: "fix-mobile-viewport-dvh-svh-safe-areas"
locale: "en"
excerpt: "Short answer: 100vh locks to the viewport height at page load, so it doesn't shrink or grow as mobile browser chrome shows and hides; dvh updates live instead."
category: "web-development"
tags: ["css", "responsive-design", "frontend", "web-standards"]
publishedAt: "2026-11-09"
seoTitle: "Why Does 100vh Overflow on Mobile? Fix It With dvh"
seoDescription: "Short answer: 100vh locks to the viewport height at page load, so it doesn't shrink or grow as mobile browser chrome shows and hides; dvh updates live instead."
---

Short answer: `100vh` locks to the viewport height at page load, but on mobile the address bar shows and hides as you scroll, so the real visible area changes while `vh` doesn't — causing overflow or a gap. `dvh` tracks that change live; `svh` gives the smallest space available when the browser chrome is fully expanded. As of November 2026, dvh/svh/lvh have shipped in Chrome since 108, Firefox since 101, and Safari since 15.4.

## Why does 100vh break on mobile?

Mobile browsers hide the address bar and toolbar when you scroll down and bring them back when you scroll up. `100vh` is calculated from the viewport height at the moment the page first loads — while that chrome is still visible — and that value never changes afterward. When the chrome hides, the actually visible area grows, but the `vh` unit doesn't grow with it. The result: a full-screen hero section either leaves a gap at the bottom or gets clipped the moment the chrome reappears.

## What do the new viewport units actually change?

Three new units serve different scenarios, and which one you want depends on whether you need the element to react when the browser chrome opens and closes.

| Unit | Measures | Typical use |
|---|---|---|
| `svh` | The smallest available space, with browser chrome fully expanded | A layout where a sticky CTA must always stay visible |
| `lvh` | The largest available space, with browser chrome fully collapsed | A background image or video where overflow doesn't matter |
| `dvh` | The actual visible area right now, updating live as you scroll | A full-screen hero section, a bottom sheet |

## Is dvh always the right choice?

No. `dvh` resizes the element every time the browser chrome opens or closes — that's exactly what you want for a bottom sheet or hero image, but it can create an unpleasant "jumping" feeling for a button group that keeps resizing mid-scroll. For an element that needs a stable height independent of scroll position, `svh` is the more predictable choice.

## When do you actually need safe-area insets?

`env(safe-area-inset-*)` keeps content from sitting underneath a notch or home indicator on iPhones with those features. A fixed-position bottom navigation bar or a full-screen modal that doesn't add this as padding can end up half-hidden behind the home indicator.

```css
.full-screen-hero {
  height: 100dvh;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
}
```

## What happens when the on-screen keyboard opens?

Here's a real gap: none of dvh, svh, or lvh update automatically when the virtual keyboard opens — these units track browser-chrome changes (address bar, toolbar), not the keyboard. On iOS, a single engine (WebKit) means the behavior is identical across Safari, Chrome, and every other iOS browser; on Android, keyboard behavior can vary by browser. Chrome exposes a `VirtualKeyboard` API for teams that want to handle the keyboard programmatically, but Firefox and Safari don't support it yet — so today, the most reliable fix is still ensuring a focused input stays visible with JavaScript methods like `scrollIntoView`.

## What does the interactive-widget meta tag actually do?

On Android Chrome, `<meta name="viewport" content="interactive-widget=resizes-content">` makes the viewport genuinely shrink when the on-screen keyboard opens; the default behavior, `overlays-content`, lets the keyboard sit on top of the content instead, leaving the viewport size unchanged. This distinction matters most in a chat screen with a fixed "send" button at the bottom: with `resizes-content`, the button stays above the keyboard; with `overlays-content`, it can end up hidden behind it. This meta tag currently only works in Chromium-based Android browsers — there's no Safari equivalent, so iOS still needs a JavaScript-based fix.

## How do you use dvh in a full-screen bottom sheet?

A bottom sheet should cover most of the screen when open, without jumping every time the address bar shows or hides. In practice, combining `max-height` with `dvh` works well: the sheet fills the viewport without stretching unnecessarily when its content is short.

```css
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 90dvh;
  overflow-y: auto;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
}
```

Using `90dvh` here, instead of `100dvh`, keeps the sheet from covering the entire viewport and hiding the page behind it completely — the user can still sense that the underlying page is there. That choice of `90dvh` over `100dvh` is small, but it directly shapes the user experience.

## Which layouts actually benefit from dvh/svh?

Any layout meant to "fill the viewport completely" — a full-screen login screen, a bottom sheet, a splash page — stops overflowing on mobile once you swap `100vh` for `100dvh`. Our piece on [using CSS container queries](/en/posts/css-container-queries-how-to) covers a similar "responsive unit" mindset — the two features are part of the same shift toward CSS that scales to context instead of fixed pixels.

## Do CSS frameworks like Tailwind support dvh/svh?

Tailwind CSS ships utility classes like `h-dvh`, `h-svh`, and `h-lvh` out of the box, which signals that the framework treats these units as production-ready, not experimental. Older frameworks like Bootstrap don't have a ready-made utility class for them, so you write the CSS yourself. It's worth checking a framework's docs before relying on it here, because some older project templates still ship a utility named something like `vh-100`, which actually maps to plain `100vh`, not `dvh`.

My honest take: every mobile layout still using `100vh` should default to `100dvh`, because the backward-compatibility cost is close to zero and the payoff is concrete. Teams keep writing `vh` out of habit anyway, since these units didn't exist three years ago and plenty of codebases predate them.

## What's a solid testing checklist?

Test on a real device by hiding the address bar and then bringing it back — emulators don't always simulate this behavior accurately. On iOS Safari, test in both portrait and landscape with the keyboard open by tapping into a form field. On Android, test Chrome and the device manufacturer's own browser (Samsung Internet, for instance) separately, since toolbar behavior can differ by manufacturer.

## Frequently Asked Questions

### What's the difference between dvh and svh?

`svh` represents the smallest visible area available when the browser chrome (address bar, toolbar) is fully expanded, and it stays fixed. `dvh` updates live as that chrome shows and hides during scrolling. Use `svh` when you need a stable height, and `dvh` when you want a layout that always fills the current viewport.

### Should I stop using 100vh entirely?

On desktop, `vh` is still safe because browser chrome doesn't change with scrolling. But for any layout targeting mobile, switching to `100dvh` removes the overflow problem with no added compatibility cost — so the practical answer is "yes, on mobile."

### Does dvh shrink automatically when the keyboard opens?

No. The dvh, svh, and lvh units track browser-chrome visibility changes (like the address bar), not the on-screen keyboard. You still need JavaScript, or Chrome's `VirtualKeyboard` API, to guarantee a focused input stays visible when the keyboard opens.

### Do safe-area-inset values return zero on every device?

Yes, on devices without a notch or home indicator, and on desktop, these values return zero — so writing `env(safe-area-inset-bottom, 0px)` is harmless and safe to use everywhere. It only produces a real padding value on notched or gesture-indicator screens.
