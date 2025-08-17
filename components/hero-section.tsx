"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload } from "lucide-react"
import { motion } from "framer-motion"

export function HeroSection() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const [isAuthed, setIsAuthed] = useState(false)
  const googleAuthUrl = `${BACKEND_URL}/auth/google`

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/auth/current_user`, { credentials: "include" })
        if (res.ok) {
          const data = await res.json()
          if (data?.success && data?.user) setIsAuthed(true)
        }
      } catch (_) {
        // ignore
      }
    }
    check()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        alert(`Selected ${files.length} file(s) for upload. Redirecting to dashboard...`)
        // Simulate upload and redirect
        setTimeout(() => {
          window.location.href = "/app/documents"
        }, 1000)
      }
    }
    input.click()
  }

  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
          >
            Intelligent <span className="text-[#2563eb]">Document</span> Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-muted-foreground"
          >
            Streamline your document workflows with AI-powered processing, e-signatures, and automation. Transform how
            your organization handles documents from upload to archive.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button asChild size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
              <Link href={isAuthed ? "/app/dashboard" : googleAuthUrl}>
                {isAuthed ? "Open Dashboard" : "Sign in with Google"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
    </section>
  )
}
