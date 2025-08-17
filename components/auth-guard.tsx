"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/current_user`, {
          method: "GET",
          credentials: "include",
        })
        if (!active) return

        if (!res.ok) {
          // Not logged in
          if (pathname !== "/login") router.replace("/login")
          return
        }
        const data = await res.json()
        if (!data?.success || !data?.user) {
          if (pathname !== "/login") router.replace("/login")
          return
        }
        // Logged in: do nothing; /app pages render normally
      } catch (_) {
        if (pathname !== "/login") router.replace("/login")
      } finally {
        if (active) setChecking(false)
      }
    }

    check()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (checking) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
