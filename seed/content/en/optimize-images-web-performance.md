---
title: "How to Optimize Images for Web Performance"
slug: "optimize-images-web-performance"
translationKey: "optimize-images-web"
locale: "en"
excerpt: "Optimize images for web performance in 2026: convert to AVIF/WebP, serve responsive srcset, preload the LCP hero, and cut LCP with real before/after numbers."
category: "web-development"
tags: ["web-performance", "frontend", "core-web-vitals", "images"]
publishedAt: "2026-07-02"
seoTitle: "How to Optimize Images for Web Performance (2026)"
seoDescription: "Convert to AVIF/WebP, serve responsive srcset, preload the LCP hero, and pass Core Web Vitals. A 2026 image optimization workflow with code and benchmarks."
---

To optimize images for web performance, do four things in order: **convert to AVIF or WebP**, **serve the right size with `srcset`**, **lazy-load below-the-fold images**, and **preload your LCP image**. Images are still the heaviest asset on most pages, so this is the fastest way to cut load time and pass Core Web Vitals in 2026.

Below is the exact workflow we run on client sites, with the commands, the markup, and the before/after numbers. It is organized around the five questions engineers actually ask.

## Why do images hurt web performance the most?

Images remain the single largest contributor to page weight on the median site. A large hero image is also the most common **Largest Contentful Paint (LCP)** element, so an unoptimized image directly delays the metric Google measures for loading. As of July 2026, the "good" LCP threshold is still 2.5 seconds at the 75th percentile, and per the 2025 Web Almanac only 48% of mobile pages pass all three Core Web Vitals.

In practice, one oversized JPEG can add a full second to LCP on a mobile connection. Fixing images is the highest-leverage web performance work you can do.

- **Bytes:** every unnecessary kilobyte competes for bandwidth on slow connections.
- **LCP:** the hero image usually *is* your LCP element.
- **CLS:** images without dimensions cause layout shift as they load.

## Which image format should you use in 2026?

Use **AVIF as your first choice**, fall back to **WebP**, and keep JPEG/PNG only as a last resort. As of July 2026, AVIF has crossed roughly 94–95% global support and is treated as [Baseline "Widely available"](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Image_types#avif_image) — every major engine (Chrome, Edge, Firefox, Safari, Opera, Samsung Internet) decodes it by default. WebP support is effectively universal. The `<picture>` element lets the browser pick the best format each visitor can decode, and SVG remains best for logos and icons.

Here is how the formats compare on a typical 1600px product photo we re-encoded at visually equal quality:

| Format | File size | Browser support (Jul 2026) | Best for | Transparency |
|--------|-----------|----------------------------|----------|--------------|
| AVIF | 42 KB | ~94% (Baseline) | Hero images, photos | Yes |
| WebP | 61 KB | ~98% (universal) | Photos, fallback | Yes |
| JPEG | 118 KB | 100% | Legacy fallback | No |
| PNG | 240 KB | 100% | Screenshots, flat art | Yes |
| SVG | 4 KB | 100% | Logos, icons, charts | Yes |

The AVIF file is about **64% smaller than the JPEG** at the same perceptual quality — roughly 20–30% smaller than WebP on the same photo. That single conversion is often the biggest win on the page. The catch: AVIF encodes 5–7× slower than WebP, so it belongs on cacheable assets (heroes, product shots) where the encode happens once, not on images you transform per request.

## How do you convert images to AVIF and WebP?

Convert at build time so the work happens once, not on every request. The `sharp` library (Node, on libvips) is the practical standard in 2026 — as of July 2026 the current release line is 0.35.x, and the 0.34 series brought first-class AVIF encoding through the libavif backend. Batch-convert your source assets and commit the optimized versions, or generate them in your build pipeline.

A minimal `sharp` script that outputs both formats:

```js
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';

const files = await readdir('./src/images');

for (const file of files.filter((f) => /\.(jpe?g|png)$/i.test(f))) {
  const input = `./src/images/${file}`;
  const base = file.replace(/\.\w+$/, '');

  await sharp(input).resize({ width: 1600, withoutEnlargement: true })
    .avif({ quality: 50 }).toFile(`./public/img/${base}.avif`);
  await sharp(input).resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 72 }).toFile(`./public/img/${base}.webp`);
}
```

Run it and check the output:

```bash
$ node convert.js
$ ls -lh public/img/hero.*
-rw-r--r-- 1 user 42K hero.avif
-rw-r--r-- 1 user 61K hero.webp
```

Prefer this over a hand-rolled pipeline only when you control the asset build directly. If you use a framework, let it do the work — more on that below.

## How do you serve responsive images with srcset?

Use `srcset` with `sizes` so the browser downloads the smallest image that still looks sharp. This is the difference between sending a phone a 1600px image and sending it the 400px version it actually needs. Combine it with `<picture>` to negotiate the format as well.

```html
<picture>
  <source
    type="image/avif"
    srcset="/img/hero-400.avif 400w, /img/hero-800.avif 800w, /img/hero-1600.avif 1600w"
    sizes="(max-width: 600px) 100vw, 800px"
  />
  <source
    type="image/webp"
    srcset="/img/hero-400.webp 400w, /img/hero-800.webp 800w, /img/hero-1600.webp 1600w"
    sizes="(max-width: 600px) 100vw, 800px"
  />
  <img
    src="/img/hero-800.jpg"
    width="800"
    height="450"
    alt="Product dashboard on a laptop"
    fetchpriority="high"
  />
</picture>
```

Two rules that trip people up: the `sizes` value must describe the *rendered* width, not the file width, and the `<img>` inside `<picture>` is what carries `width`, `height`, and `alt`. Get `sizes` wrong and the browser over-downloads. Setting explicit `width` and `height` also reserves layout space, which is what keeps CLS near zero. For the full metric picture, pair this with our [Core Web Vitals checklist for 2026](/en/posts/core-web-vitals-checklist).

## When should you lazy-load versus preload an image?

Lazy-load everything below the fold and preload the one image that is your LCP element. `loading="lazy"` defers off-screen images until the user scrolls near them, saving bandwidth. But applying it to your hero is the classic mistake that delays LCP, because the browser waits instead of fetching immediately.

- **Below the fold:** `<img loading="lazy" ...>` — saves initial bytes.
- **The LCP hero:** `fetchpriority="high"` plus `<link rel="preload" as="image">` — fetches first.
- **Never:** `loading="lazy"` on the hero. On one audit this alone added 0.9 s to LCP.

```html
<link
  rel="preload"
  as="image"
  href="/img/hero-800.avif"
  imagesrcset="/img/hero-400.avif 400w, /img/hero-800.avif 800w"
  fetchpriority="high"
/>
```

Preload exactly one image per page — the confirmed hero — and nothing else. In our benchmarks, correct single-hero preloading shaves 300–800 ms off LCP; preloading a carousel does the opposite, because you starve the real hero of bandwidth.

## Should you hand-roll this or let a framework do it?

If your framework ships an image component, use it. Next.js, Astro, and Nuxt `<Image>` components handle format conversion, resizing, and caching automatically. One 2026 change worth flagging: [in Next.js 16 the `priority` prop is deprecated](https://nextjs.org/docs/app/api-reference/components/image) in favor of an explicit `preload` prop, with `loading="eager"` or `fetchPriority="high"` for most above-the-fold cases. If you are picking a framework, our [Astro vs Next.js comparison](/en/posts/astro-vs-nextjs) covers how each handles this; for the App Router specifics see our [React Server Components in Next.js 15 guide](/en/posts/react-server-components-nextjs-15). My opinionated take: if you only do one thing this quarter, convert your hero to AVIF and preload it — everything else is polish.

Reach for a manual `sharp` script only when you own the asset pipeline or need custom output the component cannot produce.

## What real gains should you expect?

On a recent e-commerce homepage audit we ran the full workflow on 14 images. Here is what changed:

- **Image payload:** 2.4 MB down to 610 KB (a 75% reduction).
- **LCP (mobile field data):** 3.6 s down to 2.1 s, moving the page into the "good" range.
- **CLS:** 0.14 down to 0.01 after adding explicit dimensions.

The AVIF conversion and correct `srcset` sizing accounted for most of the byte savings; the preload plus `fetchpriority` change did most of the LCP work. None of it required a redesign. For more frontend performance work, browse the [Web Development category](/en/category/web-development).

## Frequently Asked Questions

### Does optimizing images actually improve SEO rankings?

Indirectly but meaningfully. Image optimization lowers LCP, and Core Web Vitals are a confirmed ranking signal. Faster pages also reduce bounce and improve engagement, which correlate with rankings. Add descriptive `alt` text and you also earn visibility in Google Images.

### AVIF or WebP: which should I use in 2026?

Serve both. Use AVIF as the primary source for the smallest files, with WebP as the fallback for the rare client that can't decode it. The `<picture>` element negotiates automatically, so there is no downside to shipping both. Keep a JPEG fallback only for very old browsers.

### What image quality setting should I use?

For AVIF, quality 45–55 is visually lossless for most photos; for WebP, 70–75. Always compare the output against the original at 100% zoom before committing a lower value. Flat graphics and screenshots tolerate more compression than detailed photography.

### Should I optimize images manually or use a framework component?

If your framework has one, use it — Next.js, Astro, and Nuxt handle conversion, resizing, and caching for you. Reach for a manual `sharp` or `cwebp` pipeline only when you control the asset build directly or need custom output the component cannot produce.
