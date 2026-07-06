'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Dictionary } from '@/i18n'
import type { Locale } from '@/i18n/config'
import { routes } from '@/lib/routes'

interface RegisterFormProps {
  locale: Locale
  dict: Dictionary
  returnTo?: string
}

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  form?: string
}

export function RegisterForm({ locale, dict, returnTo }: RegisterFormProps) {
  const router = useRouter()
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [pending, setPending] = React.useState(false)

  const schema = React.useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, { message: dict.validation.nameRequired }),
        email: z.string().email({ message: dict.validation.emailInvalid }),
        password: z.string().min(8, { message: dict.validation.passwordMin }),
      }),
    [dict],
  )

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrors({})
    const formData = new FormData(event.currentTarget)
    const parsed = schema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setErrors({ name: flat.name?.[0], email: flat.email?.[0], password: flat.password?.[0] })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        setErrors({ form: dict.auth.registerError })
        setPending(false)
        return
      }
      // Payload does not auto-login on create; sign in with the same credentials.
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }),
      })
      if (!loginRes.ok) {
        router.push(routes.login(locale, returnTo))
        return
      }
      router.push(returnTo || routes.home(locale))
      router.refresh()
    } catch {
      setErrors({ form: dict.auth.genericError })
      setPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {errors.form ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">{dict.auth.name}</Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{dict.auth.email}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          aria-invalid={Boolean(errors.email)}
        />
        {errors.email ? <p className="text-sm text-destructive">{errors.email}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{dict.auth.password}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
      </div>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? dict.auth.registering : dict.auth.register}
      </Button>
    </form>
  )
}
