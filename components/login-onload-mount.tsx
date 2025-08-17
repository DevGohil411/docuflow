"use client"

import { usePathname } from "next/navigation"
import { LoginOnloadDialog } from "@/components/login-onload-dialog"

export function LoginOnloadMount() {
  const pathname = usePathname()

  // Hide on dedicated login page and internal app routes
  const hide = pathname === "/login" || pathname?.startsWith("/app")
  if (hide) return null

  return <LoginOnloadDialog />
}
