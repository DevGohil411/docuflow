"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail } from "lucide-react"

export default function LoginPage() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const baseGoogleAuthUrl = `${BACKEND_URL}/auth/google`

  const [checking, setChecking] = useState(true)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    // Always render the login page; just detect auth to enable dashboard access UI
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/current_user`, {
          method: "GET",
          credentials: "include",
        })
        if (res.ok) {
          const data = await res.json()
          if (data?.success && data?.user) {
            setIsAuthed(true)
          }
        }
      } catch (_) {
        // ignore
      } finally {
        setChecking(false)
      }
    }
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="min-h-[100dvh] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-100">
      <div className="container mx-auto px-4 py-10 flex min-h-[100dvh] items-center justify-center">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Brand / Pitch */}
          <section className="flex flex-col justify-center">
            <Badge className="w-fit mb-4" variant="secondary">Welcome to Docu Flow</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Organize. Automate. Search.
            </h1>
            <p className="mt-4 text-slate-300 text-lg">
              Streamline your document workflows with AI-powered search, seamless integrations, and secure storage.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                OAuth secured
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-400" />
                Firestore backend
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
                Next.js 15 UI
              </div>
            </div>
          </section>

          {/* Right: Auth Card with Tabs */}
          <Card className="backdrop-blur bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle>Access DocuFlow Platform</CardTitle>
              <CardDescription>Connect and automate your document workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                </TabsList>

                <Separator className="my-6" />

                <div className="relative flex items-center justify-center my-6">
                  <span className="px-3 text-xs tracking-wider text-slate-400 bg-slate-900/60">OR CONTINUE WITH EMAIL</span>
                  <div className="absolute left-0 right-0 h-px bg-slate-800" />
                </div>

                <TabsContent value="login">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@company.com" autoComplete="email" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" type="text" placeholder="Jane Doe" autoComplete="name" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email2">Email</Label>
                      <Input id="email2" type="email" placeholder="you@company.com" autoComplete="email" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password2">Password</Label>
                      <Input id="password2" type="password" placeholder="Create a password" autoComplete="new-password" />
                    </div>
                  </div>
                </TabsContent>

                <div className="mt-6 grid gap-3">
                  <Button
                    asChild
                    variant="secondary"
                    className="w-full h-11 text-base bg-slate-900 text-slate-100 border border-slate-700 hover:bg-slate-800"
                    disabled={checking}
                  >
                    <Link href={isAuthed ? `${baseGoogleAuthUrl}?reauth=1` : baseGoogleAuthUrl} prefetch={false}>
                      <GoogleIcon className="mr-2 h-5 w-5" />
                      Continue with Google
                    </Link>
                  </Button>

                  {isAuthed && (
                    <Button
                      asChild
                      className="w-full h-11 text-base bg-cyan-400 text-slate-900 hover:bg-cyan-300"
                      disabled={checking}
                    >
                      <Link href="/app/dashboard" prefetch={false}>
                        <Mail className="mr-2 h-5 w-5" />
                        Access Dashboard
                      </Link>
                    </Button>
                  )}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  By continuing, you agree to our <Link href="#" className="underline underline-offset-4">Terms</Link> and
                  <Link href="#" className="underline underline-offset-4"> Privacy Policy</Link>.
                </p>
              </Tabs>
            </CardContent>
            <CardFooter className="block">
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <MiniFeature title="Precision Search" desc="Find documents fast with AI." />
                <MiniFeature title="Automations" desc="Trigger workflows instantly." />
                <MiniFeature title="Live Analytics" desc="Track usage in real-time." />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

function GoogleIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.96h5.6c-.24 1.44-1.68 4.2-5.6 4.2-3.36 0-6.1-2.76-6.1-6.16S8.64 6.04 12 6.04c1.92 0 3.2.84 3.92 1.56l2.68-2.6C17.48 3.36 14.96 2.2 12 2.2 6.88 2.2 2.8 6.28 2.8 11.4s4.08 9.2 9.2 9.2c5.28 0 8.76-3.72 8.76-8.96 0-.6-.08-1-.16-1.44H12z" />
    </svg>
  )
}

function MiniFeature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{desc}</p>
    </div>
  )
}
