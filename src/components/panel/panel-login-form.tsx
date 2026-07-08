'use client'

import { useRouter } from 'next/navigation'
import * as React from 'react'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email({ message: 'Geçerli bir e-posta girin.' }),
  password: z.string().min(1, { message: 'Şifre gerekli.' }),
})

/**
 * Admin login form. Posts credentials to Payload's `/api/users/login`, then
 * verifies the returned user is an admin — if not, it logs back out and shows a
 * Turkish error so non-admins can never reach the panel. On success it
 * redirects to the dashboard.
 */
export function PanelLoginForm() {
  const router = useRouter()
  const [errors, setErrors] = React.useState<{ email?: string; password?: string; form?: string }>(
    {},
  )
  const [pending, setPending] = React.useState(false)

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
        setErrors({ form: 'E-posta veya şifre hatalı.' })
        setPending(false)
        return
      }

      const data: { user?: { role?: string } } = await res.json()
      if (data.user?.role !== 'admin') {
        // Authenticated but not an admin — revoke the session immediately.
        await fetch('/api/users/logout', { method: 'POST' })
        setErrors({ form: 'Bu panele erişim yetkiniz yok.' })
        setPending(false)
        return
      }

      router.push('/panel')
      router.refresh()
    } catch {
      setErrors({ form: 'Bir hata oluştu. Lütfen tekrar deneyin.' })
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
        <Label htmlFor="email">E-posta</Label>
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
        <Label htmlFor="password">Şifre</Label>
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
        {pending ? 'Giriş yapılıyor…' : 'Giriş yap'}
      </Button>
    </form>
  )
}
