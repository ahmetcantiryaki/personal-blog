---
title: "Own Your Components With the shadcn Registry"
slug: "own-your-components-shadcn-registry"
translationKey: "shadcn-registry-own-components-2026"
locale: "en"
excerpt: "shadcn/ui components aren't an npm package — they're source code copied into your project. A private registry lets teams share them and control updates."
category: "web-development"
tags: ["react", "frontend", "open-source", "developer-experience"]
publishedAt: "2026-09-08"
seoTitle: "Own Your Components With the shadcn Registry"
seoDescription: "shadcn/ui components aren't an npm package — they're source code. Run a private registry to share them across teams and keep control of updates."
---

Short answer: you don't install shadcn/ui components as an npm package — the CLI copies the source code directly into your project. Because of this "copy-in" model, the component becomes your code, and once you stand up your own private registry, you can share those components across teams without ever fighting a version lock.

One team was tired of patching styles that broke on every major version bump of a third-party UI library. The fix wasn't switching libraries — it was moving their own component set into a registry and pulling it into every project with `npx shadcn add`. Six months later, five separate repos shared the same button, form, and table components, and none of them hit the "upgrading the npm package broke everything" problem, because there was no package to upgrade.

## What is the shadcn Registry, and how is it different from an npm package?

shadcn/ui isn't a library, it's a distribution mechanism: it defines component entries via the `registry.json` and `registry-item.json` schemas and copies them into your project as source code through the CLI. In an npm package, the component stays locked inside `node_modules`, and upgrading ties you to the library author's decisions. In the shadcn model, the component is your own file — something like `components/ui/button.tsx` — and you can change any line of it.

| Approach | Where the component lives | Who controls updates | Customization |
|---|---|---|---|
| npm UI library | `node_modules`, compiled | The library author | Limited (via a props/theme API) |
| shadcn registry | Your own repo, as source | You | Unlimited (edit the file directly) |

That gap widened further with shadcn CLI 3.0 in August 2025, which added namespaced registry support, more advanced authentication, and a rewritten registry engine. You can now install components from multiple public or private registries using the `@registry-name/component-name` format.

There's a trade-off here too: with an npm package, maintenance stays the library author's job; in the copy-in model, maintaining the component is now yours. When a security vulnerability or accessibility bug gets fixed upstream, you have to port that fix into your own copy. This is exactly where a private registry earns its keep — instead of repeating that maintenance work in every project, you own it in one central source and distribute from there.

## How do you migrate off an existing UI library?

Trying to move a Material UI or Ant Design project to shadcn overnight is risky. The safer path is to start using shadcn components on newly built screens, and migrate existing screens incrementally — whenever they need a design update or bug fix anyway. The two libraries can coexist for a while; because shadcn components rely on their own CSS variables, the risk of clashing with an older library's style system is low.

A practical sequence for a team looks like this: move your four or five most-used components (button, input, modal) into the registry first and use them on new screens, then migrate the rest of your design system as older components come up for changes anyway. That turns a risky big-bang migration into a transition embedded in your normal development flow.

## How do components.json and the CLI actually work?

The `components.json` file defines which registries your project pulls from, your style preferences, and file paths. To add a private registry, just point the `registries` field at a URL with authentication headers:

```json
{
  "registries": {
    "@company-ui": {
      "url": "https://registry.yourcompany.com/ui/{name}.json",
      "headers": {
        "Authorization": "Bearer ${COMPANY_REGISTRY_TOKEN}"
      }
    }
  }
}
```

Installing a component is a single command:

```bash
npx shadcn add @company-ui/data-table
```

The CLI fetches `data-table.json` from the registry, resolves its dependencies (the `dependencies` and `registryDependencies` fields inside `registry-item.json`), and writes the source files straight into your project. Nothing is hidden inside `node_modules` — `git diff` shows you exactly what was added.

## How do you set up your own private registry?

A private registry is really just any HTTP endpoint serving static JSON files that match the `registry.json` schema — static file hosting on Vercel, a Next.js API route, or an S3 bucket all work fine. The `include` field inside `registry.json` lets you compose multiple sub-registries into one source, so your "design system" registry can pull in separate "form components" and "table components" registries.

The `headers` field supports environment variables for authentication, so each developer authenticates with their own token while the registry content stays the same for the whole team. This is a much lighter piece of infrastructure than running an internal npm registry like Verdaccio: there's no publish step, you just put JSON files somewhere and share the URL.

## How does theming work with CSS variables?

shadcn components reference CSS custom properties — things like `--primary`, `--radius`, `--background` — instead of hardcoded colors. You define your brand colors and light/dark theme values in one `globals.css` file, without touching the components themselves. Teams sharing one registry across multiple projects can ship that variable set as part of the registry too, so every new project starts with the same brand identity out of the box.

In practice, that means defining a "theme" entry inside `registry-item.json` and running `npx shadcn add @company-ui/theme` to write the CSS variables into `globals.css`. A developer starting a new project gets both the components and the brand colors set up with a single command; when the design team updates the palette, updating one file and redistributing it is all it takes to propagate the change everywhere.

## Can you keep components updated without a black-box package?

With an npm package, updates arrive via `npm update` and you learn what changed from a changelog. In the shadcn model, `npx shadcn diff` compares the registry's current version against your file and lets you decide exactly which change to pull in. You lose the convenience of automatic updates, but you also eliminate the surprise breakage — no update ever touches your code without your approval.

In practice, this means that once you've customized a component (say, added your company's button variant), a registry update never silently overwrites it — but when a critical accessibility fix ships, you can pull it in deliberately.

If you're integrating these components into a project using Server Components, see [our React Server Components guide](/en/posts/react-server-components-nextjs-15). For common mistakes when pairing shadcn with Tailwind, [our Tailwind CSS mistakes post](/en/posts/tailwind-css-mistakes) is a good reference, and if you're migrating to Tailwind v4, [our migration guide](/en/posts/migrating-to-tailwind-css-v4) walks through it step by step. Curious where Web Components stand in 2026? See [our comparison here](/en/posts/are-web-components-ready-2026). For more web development coverage, browse [our web development category](/en/category/web-development).

For the official schema and CLI behavior, see [shadcn/ui's registry documentation](https://ui.shadcn.com/docs/registry/registry-json) and the [components.json reference](https://ui.shadcn.com/docs/components-json).

## Frequently Asked Questions

### Is shadcn/ui a component library or a tool?

Neither, exactly — it's a distribution mechanism. The code is open-source files copied into your own project; the shadcn CLI just manages that copy step and talks to registries. Once installed, you're not dependent on shadcn — you're dependent on your own code.

### Do I need a dedicated server to run a private registry?

No. Any HTTP endpoint that serves static JSON files matching the `registry.json` schema works — a CDN, an S3 bucket, or a simple API route are all sufficient. You don't need to stand up a full package registry server like Verdaccio.

### Will I miss updates after customizing a component?

Not automatically, but you won't get them automatically either. The `npx shadcn diff` command compares the registry's current version against yours, and you decide which changes to merge in manually. It takes more effort than an npm package update, but it removes the risk of unexpected breakage.

### When do I actually need a namespaced registry (@name/component)?

If you're pulling components from more than one registry — say, a community registry plus an internal company one — the namespace makes the source explicit and avoids name collisions. If you're only using a single private registry, a namespace isn't required, though it's still recommended for readability.
