import { redirect } from 'next/navigation'

import { PanelLoginForm } from '@/components/panel/panel-login-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { isAdminUser } from '@/access/roles'
import { getCurrentUser } from '@/lib/auth'

/**
 * Public admin login page. It sits at `/panel/login`, a sibling *outside* the
 * `(protected)` route group, so the auth guard in `(protected)/layout.tsx` does
 * not run here. Already-signed-in admins are sent straight to the dashboard.
 */
export default async function PanelLoginPage() {
  const user = await getCurrentUser()
  if (isAdminUser(user)) redirect('/panel')

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="font-serif text-2xl">Panel Girişi</CardTitle>
        </CardHeader>
        <CardContent>
          <PanelLoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
