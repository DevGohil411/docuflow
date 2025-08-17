"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

  useEffect(() => {
    const doLogout = async () => {
      try {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        })
      } catch (_) {
        // ignore network errors; still proceed to redirect
      } finally {
        try {
          // Clear any client-side state if stored
          localStorage.removeItem("auth")
          sessionStorage.removeItem("auth")
        } catch {}
        // Redirect to login
        router.replace("/login")
      }
    }

    doLogout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-[100dvh] grid place-items-center">
      <div className="text-center">
        <p className="text-lg">Signing you out…</p>
        <p className="text-sm text-slate-500">Just a moment.</p>
      </div>
    </main>
  )
}
