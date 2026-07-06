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

interface LoginFormProps {
  locale: Locale
  dict: Dictionary
  returnTo?: string
}

export function LoginForm({ locale, dict, returnTo }: LoginFormProps) {
  const router = useRouter()
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; form?: string }>(
    {},
  )
  const [pending, setPending] = React.useState(false)

  const schema = React.useMemo(
    () =>
      z.object({
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
      email: formData.get('email'),
      password: formData.get('password'),
    })
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors
      setErrors({ email: flat.email?.[0], password: flat.password?.[0] })
      return
    }

    setPending(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })
      if (!res.ok) {
        setErrors({ form: dict.auth.loginError })
        setPending(false)
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
          autoComplete="current-password"
          required
          aria-invalid={Boolean(errors.password)}
        />
        {errors.password ? <p className="text-sm text-destructive">{errors.password}</p> : null}
      </div>

      <Button type="submit" disabled={pending} className="mt-2">
        {pending ? dict.auth.loggingIn : dict.auth.login}
      </Button>
    </form>
  )
}
