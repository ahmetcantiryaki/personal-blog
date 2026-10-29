---
title: "Build a Command Palette (Cmd+K) in React"
slug: "build-a-command-palette-cmd-k-in-react"
translationKey: "build-command-palette-react"
locale: "en"
excerpt: "Short answer: wrap the cmdk library in a Dialog, list items as Command.Item, toggle it with Cmd+K, and follow the ARIA combobox pattern for accessibility."
category: "web-development"
tags: ["react", "accessibility", "frontend", "typescript"]
publishedAt: "2026-10-29"
seoTitle: "How Do You Build a Cmd+K Command Palette in React?"
seoDescription: "Here's how to build a fast, accessible command palette in React with cmdk — search, grouping, async actions, and the keyboard pattern that makes it work."
---

Short answer: install the `cmdk` library, toggle its `Command.Dialog` component with the `Cmd+K` keyboard shortcut, and list your items as `Command.Item` — the library handles filtering and sorting automatically. For accessibility, following WAI-ARIA's combobox pattern ensures screen reader users can operate the palette too.

## What is a Cmd+K command palette, and why do apps add one?

A command palette is an interface that lets a user type to reach any action — switching pages, opening a setting, running a search — instantly from the keyboard, instead of navigating a menu with the mouse. The pattern, popularized by tools like Linear, Raycast, and VS Code, lets power users reach every corner of an app without ever touching the mouse — and that sense of speed measurably changes how users perceive an app as "professional."

The palette's real value shows up as your app grows: as menu depth increases, finding an action takes more clicks, while a command palette flattens every action into a single list behind a search box. That's why most teams add a palette not as a "nice to have," but as navigation debt relief for a growing app.

## Should you use cmdk, or build it from scratch on Radix Dialog?

`cmdk` is a fast, unstyled command menu library that requires React 18, runs as a client component, and can also be used as an accessible combobox. It's built from `Command`, `Command.Input`, `Command.List`, `Command.Empty`, `Command.Group`, `Command.Item`, and `Command.Separator`; `Command.Dialog` renders the palette inside a modal. Building this from scratch on top of Radix `Dialog` means you have to write your own filtering and keyboard navigation logic — an unnecessary reinvention for most projects, since `cmdk` already ships that logic battle-tested.

```tsx
import { Command } from "cmdk"
import { useEffect, useState } from "react"

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Command Palette">
      <Command.Input placeholder="Type a command..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>
        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => console.log("settings")}>
            Go to Settings
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
```

## How does fuzzy search and grouping actually work?

By default, `cmdk` compares each item against what the user types, computes a fuzzy match score, and automatically sorts results by that score — you do nothing beyond listing your `Command.Item`s. Grouping items under headings like "Navigation," "Actions," or "Recent" with `Command.Group` keeps the user's mental map intact as the list grows.

For large lists (thousands of items) or when you want your own ranking logic, passing `shouldFilter={false}` to `Command` turns off the default filtering, letting you plug in your own virtualization or search logic — a necessary escape hatch for apps that want to feed the palette with server-side search results.

## How do you wire up async actions and routing?

Using `await` inside a `Command.Item`'s `onSelect` callback — say, to call an API and then navigate — doesn't break the palette's own state, because `cmdk` doesn't wait for the action to finish; you decide when to close the palette by calling `setOpen(false)` yourself inside `onSelect`. For an item that navigates to a page in Next.js, calling `router.push()` inside `onSelect` and then closing the palette is enough.

| Scenario | Approach |
|---|---|
| Static page link | `router.push(href)` inside `onSelect` |
| Search result (from an API) | Debounce the `Command.Input` value and fetch from the server, with `shouldFilter={false}` |
| Action (e.g. "Switch to dark mode") | Update state inside `onSelect`, then close the palette |

## Which ARIA rules do you actually need to follow for accessibility?

The WAI-ARIA Authoring Practices define a command palette as a combobox inside a modal dialog: opening the dialog should automatically move focus to the input, pressing `Escape` should close the dialog, and focus should never leave the dialog while it's open (a focus trap). `cmdk`'s `Command.Dialog` already implements most of this, but you still need to add `aria-expanded` and `aria-haspopup="dialog"` to your own trigger button by hand.

The most critical piece for screen reader users is announcing that the result count changed — adding an `aria-live="polite"` region to `Command.List` (or using `cmdk`'s own built-in announcement) gives feedback like "3 results found" as the user types. It's worth reading this alongside the focus-management principles in [our accessible forms checklist](/en/posts/building-accessible-forms-checklist).

## What should you watch for on theming and performance?

Every part of `cmdk` adds its own `cmdk-` data attribute to its underlying element (for example `[cmdk-item]`), so you can wire your own CSS or Tailwind classes directly to those attributes — no extra class-prop chaining needed. The biggest performance risk in palettes with thousands of items is re-rendering the entire list on every keystroke; switching to `shouldFilter={false}` and plugging in your own debounced search logic noticeably cuts the number of re-renders.

Making your palette type-safe with [advanced TypeScript patterns](/en/posts/advanced-typescript-patterns) — defining every command as a discriminated union, for instance — catches a missing `onSelect` at compile time instead of at runtime for large command sets. If you want to turn the command palette into something AI agents can trigger too, [our piece on agent-first dev tools](/en/posts/agent-first-dev-tools) shows where that direction is heading.

## How do you organize and test a large command set?

Instead of defining hundreds of commands as one flat array, letting each feature define its own commands in its own file and merging them with a `registerCommands()` function keeps the codebase from sprawling as the command count grows. Defining every command as a typed object — `{ id, label, keywords, onSelect }` — makes it easy to track which command belongs to which feature, and to remove the right commands when you remove a feature.

Three layers of testing are enough: a unit test confirming the `Command.Item` list renders the right commands, an integration test confirming the keyboard shortcut (`Cmd+K`) opens and closes the palette, and a behavior test confirming an `onSelect` call triggers the right navigation or state update. You don't need to test the fuzzy-search logic itself — that's `cmdk`'s responsibility, and it's already tested — what you need to verify is that your own commands are defined correctly.

## When do you need to load commands asynchronously from the server?

As your app grows, some commands (data-dependent ones like "go to this customer") can't be defined in a static list; that's when you debounce the `Command.Input` value, fetch results from the server, and pass `shouldFilter={false}` to disable `cmdk`'s own filtering. Adding a loading indicator during this async fetch (a `Command.Loading`-style state) prevents the user from thinking nothing happened after they typed into the search box.

Always showing static commands (page links, settings) instantly, and only loading data-dependent commands asynchronously, doesn't slow down the palette's opening speed — the static list is already there the moment the user opens the palette, and dynamic results slot in as they type a search.

## Frequently Asked Questions

### Which library should you use to build a command palette in React?

`cmdk` is an open-source library requiring React 18 that works as both an unstyled command menu and an accessible combobox. Its `Command.Dialog`, `Command.Input`, `Command.List`, and `Command.Item` parts handle filtering and keyboard navigation automatically.

### How does search work in cmdk, and can I plug in my own ranking logic?

By default, `cmdk` scores every item with fuzzy matching and sorts automatically. Passing `shouldFilter={false}` to `Command` turns that off, letting you plug in your own search or server-side filtering logic instead.

### Should the command palette also open without the keyboard shortcut?

Yes — adding `aria-expanded` and `aria-haspopup="dialog"` to a trigger button, and providing a mouse-clickable way to open it, is a necessary access path for users who don't know or can't use the keyboard shortcut.

### How do you keep performance solid with thousands of command items?

Turn off cmdk's default filtering with `shouldFilter={false}` and add your own debounced search or virtualization logic — this prevents the entire list from re-rendering on every keystroke.
