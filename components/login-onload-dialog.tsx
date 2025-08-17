"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCurrentUser } from "@/hooks/use-current-user"

export function LoginOnloadDialog() {
  const { data: user, isLoading, isError } = useCurrentUser()
  const [open, setOpen] = useState(false)

  const BACKEND_URL = useMemo(() => process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000", [])
  const googleAuthUrl = `${BACKEND_URL}/auth/google`

  useEffect(() => {
    if (isLoading) return
    // Open if not authenticated; close if authenticated
    setOpen(!user)
  }, [isLoading, user])

  const onGoogleLogin = () => {
    window.location.href = googleAuthUrl
  }

  // Do not render until we know auth state to avoid flicker
  if (isLoading) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
          <DialogDescription>
            Authenticate with Google to access your dashboard, workflows, and saved documents.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-3">
          <Button onClick={onGoogleLogin} className="w-full bg-[#2563eb] hover:bg-[#1d4ed8]">
            Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
