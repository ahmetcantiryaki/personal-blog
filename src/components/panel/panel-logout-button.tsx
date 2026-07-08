'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

/** Signs the admin out via Payload, then returns to the login page. */
export function PanelLogoutButton() {
  const router = useRouter()
  const [pending, setPending] = React.useState(false)

  const logout = React.useCallback(async () => {
    if (pending) return
    setPending(true)
    try {
      await fetch('/api/users/logout', { method: 'POST' })
      router.push('/panel/login')
      router.refresh()
    } catch {
      toast.error('Çıkış yapılamadı. Lütfen tekrar deneyin.')
      setPending(false)
    }
  }, [pending, router])

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={logout}
      disabled={pending}
      aria-label="Çıkış yap"
    >
      <LogOut className="size-5" />
    </Button>
  )
}
