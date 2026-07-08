---
title: "Accessible React Forms with RHF and Zod"
slug: "react-hook-form-zod-accessible-forms"
translationKey: "react-hook-form-zod-forms"
locale: "en"
excerpt: "The story of rebuilding a broken signup form with React Hook Form and Zod: schema validation, onBlur mode, aria-invalid, role=alert, and server-side reuse."
category: "web-development"
tags: ["react", "accessibility", "frontend", "best-practices"]
publishedAt: "2026-07-08"
seoTitle: "Accessible React Forms with RHF and Zod (2026)"
seoDescription: "How to build an accessible signup form with React Hook Form and Zod: schema validation, onBlur mode, aria-invalid, role=alert, and shared server validation."
---

Here is the short version of building an accessible React form: define your data shape once in Zod, wire it into React Hook Form (RHF) with `@hookform/resolvers/zod`, set `mode: 'onBlur'` so validation fires when a user leaves a field instead of on every keystroke, surface errors with `aria-invalid` and `role="alert"`, and run the same schema again on the server. This is the story of fixing a real signup form in that exact order.

## Discovering the broken signup form

The signup form I inherited last month technically worked, but nobody had ever run it through a screen reader. Type an invalid value into the email field, press Tab, and nothing announced. The error text turned red on screen, but it had zero relationship to the input in the DOM. Worse, validation fired on every keystroke, so a user typing their name got hit with "this field is required," watched it disappear, then watched it reappear a letter later. Testing it with NVDA made the problem impossible to ignore: a fresh announcement on every character.

The root cause had three layers: validation logic scattered across the component, validation timing tuned for developers instead of users, and error messages that were never wired into the accessibility tree. I rebuilt the form to fix all three at once.

## Defining the Zod schema

The first move was pulling the shape and rules of the form data into one place, matched to TypeScript types. [Zod](https://zod.dev) does this with surprisingly little code:

```ts
// schemas/signup.ts
import { z } from 'zod'

export const signupSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must include at least one number'),
})

export type SignupInput = z.infer<typeof signupSchema>
```

The point of this file is that it can be imported on both the client and the server. One source of truth, one set of error messages.

## Wiring @hookform/resolvers/zod

Once the schema exists, connecting it to React Hook Form is a single line: `zodResolver`. The [@hookform/resolvers](https://github.com/react-hook-form/resolvers) package bridges RHF to dozens of validation libraries, and we only need the Zod one:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '@/schemas/signup'

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<SignupInput>({
  resolver: zodResolver(signupSchema),
  mode: 'onBlur',
})
```

The line worth pausing on is `mode: 'onBlur'`. Per the [React Hook Form docs](https://react-hook-form.com/docs/useform), `mode` controls when validation runs; the default is `onSubmit`, with `onChange`, `onBlur`, `onTouched`, and `all` available as alternatives. Our old form was effectively behaving like `onChange` without anyone deciding that on purpose, and that is exactly what produced the keystroke-by-keystroke noise described above.

## Why onBlur: a calmer validation mode

Validation timing is not just a developer preference — it is an accessibility decision. Flashing an error while a user is still typing into a field is premature and disruptive; showing it once they leave the field gives feedback at the moment they believe they are done.

| Mode | Fires when | Accessibility / UX impact |
|---|---|---|
| `onChange` | Every keystroke | Premature errors, noisy and fatiguing screen reader announcements |
| `onBlur` | On field exit | Calm, single announcement when the user considers the field "done" |
| `onTouched` | On every change after first blur | Similar calm start, but instant feedback while a user is actively fixing a mistake |
| `onSubmit` | Only on submit | Long forms dump many errors on the user at once |

We chose `onBlur` because the signup form is short, and moving to the next field is a clear "I'm done here" signal. For longer, multi-step forms, `onTouched` usually strikes a better balance: the user gets immediate feedback while correcting a mistake, without being interrupted on the first pass through a field.

## Surfacing errors with aria-invalid and role="alert"

Even with the right validation timing, an error message that is not associated with its input in the DOM is still invisible to a screen reader user. [MDN's aria-invalid documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-invalid) specifies using `aria-invalid="true"` to tell assistive technology that a control is invalid, with the actual error text linked to the input via `aria-describedby`. Adding `role="alert"` to the element holding the error text means the message gets announced automatically, without moving focus:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={errors.email ? 'true' : 'false'}
  aria-describedby={errors.email ? 'email-error' : undefined}
  {...register('email')}
/>
{errors.email && (
  <p id="email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

The three pieces work together: `aria-invalid` reports the field's state, `aria-describedby` links the error text to the field, and `role="alert"` announces the message the moment it enters the DOM. Miss any one of the three and the error can look fine visually while never reaching a screen reader user.

And here's the uncomfortable truth: most teams treat accessibility as an afterthought bolted onto validation logic once it already works, when it should shape the validation strategy from the first schema field onward. An `aria-invalid` added after the fact almost always arrives without its matching `aria-describedby`.

## Reusing the same schema on the server

No matter how solid client-side validation is, anyone hitting the API directly can skip it entirely. Defense in depth means running `signupSchema` again on the server; in a Next.js-style setup, that is as simple as importing the same file and calling `parse` inside an API route or server action:

```ts
// app/api/signup/route.ts
import { signupSchema } from '@/schemas/signup'

export async function POST(req: Request) {
  const body = await req.json()
  const result = signupSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  // result.data is now typed and validated
}
```

That means the rules are never written twice: RHF plus Zod on the client, plain Zod on the server. Error messages stay consistent on both ends because there is exactly one source for them.

## Label-association pitfalls

Even with a correct schema and correct ARIA attributes, none of it matters if the basic HTML pairing is broken. The three mistakes I see most often:

- The label's `htmlFor` does not match the input's `id`, so a screen reader never announces the label at all.
- Error text sits on the page but is never wired to the input with `aria-describedby`, so sighted users see it and screen reader users do not.
- A placeholder is used instead of a label; it disappears the moment the field is focused, and the user forgets what they were filling in.

Catching these pitfalls is easier when you walk the form against a broader [web accessibility checklist](/en/posts/web-accessibility-checklist); form validation is only one section of it.

Fixing this signup form also surfaced a bigger idea: for some users, the most accessible signup experience is removing the password field entirely. Replacing it with a [passkey and WebAuthn](/en/posts/passkeys-webauthn-guide) flow cuts the validation surface down and removes a step that depends on memory in the first place. For forms that still need a password, the pattern above is a solid baseline.

Carrying this pattern into a larger form also raises the question of where form state actually lives; our [React state management comparison](/en/posts/react-state-management-comparison) covers the tradeoffs between RHF's own state and global state solutions for multi-step forms. If you are placing the form inside a server-rendered route, our piece on [React Server Components in Next.js 15](/en/posts/react-server-components-nextjs-15) clarifies how validation splits between client and server.

As of July 2026, this trio — a Zod schema, `zodResolver`, and `onBlur` mode — has become the de facto standard for schema-driven form validation in React; team discussions have shifted from "why Zod" to "which validation mode." For more patterns like this, see our [Web Development category](/en/category/web-development) page.

## Frequently Asked Questions

### Should I use RHF and Zod instead of Formik and Yup?

Both still work, but Zod's TypeScript inference (`z.infer`) and smaller bundle size have made React Hook Form plus Zod the default choice for new projects. If an existing Formik plus Yup codebase is healthy, there is no urgent need to migrate it.

### Is mode: 'onBlur' the right choice for every form?

For short forms, yes. For multi-step or long forms, `onTouched` usually strikes a better balance, since it keeps giving instant feedback once a user starts correcting a mistake, without interrupting them on the first pass.

### Should aria-invalid always start as false?

It is safer to omit the `aria-invalid` attribute entirely until the user has interacted with the field. Otherwise an empty, untouched required field gets flagged as invalid before the user has had a chance to fill it in.

### Can I really skip server-side validation?

No. Client-side validation exists purely for user experience; anyone sending a request straight to the API can bypass it completely. Running the same Zod schema on the server is the non-negotiable half of defense in depth.
