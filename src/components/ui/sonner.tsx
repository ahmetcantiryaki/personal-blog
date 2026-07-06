'use client'

import { useTheme } from 'next-themes'
import { Toaster as SonnerToaster } from 'sonner'

/** Theme-aware toast container. Mounted once in the root frontend layout. */
export function Toaster() {
  const { theme } = useTheme()
  return (
    <SonnerToaster
      theme={(theme as 'light' | 'dark' | 'system') ?? 'system'}
      position="bottom-center"
      toastOptions={{
        classNames: {
          toast:
            'group rounded-md border border-border/70 bg-popover text-popover-foreground shadow-md',
          description: 'text-muted-foreground',
        },
      }}
    />
  )
}
