import { redirect } from 'next/navigation'
import React from 'react'

import { PanelShell } from '@/components/panel/panel-shell'
import { isAdminUser } from '@/access/roles'
import { getCurrentUser } from '@/lib/auth'

/**
 * Guard layout for every admin page under `/panel`. Non-admins are bounced to
 * `/panel/login`.
 *
 * Route structure: the `(protected)` route group holds all guarded pages while
 * the public login page lives at `../login` — a sibling *outside* this group —
 * so it renders without triggering the auth check. Route groups do not affect
 * the URL, so `(protected)/page.tsx` still resolves to `/panel`.
 */
export default async function PanelProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!isAdminUser(user)) redirect('/panel/login')

  return <PanelShell user={user!}>{children}</PanelShell>
}
