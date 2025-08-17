"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/")
    const isLast = index === segments.length - 1
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")

    return {
      label,
      href,
      isLast,
    }
  })

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground mx-2" />}
            {breadcrumb.isLast ? (
              <span className="text-sm font-medium text-foreground">{breadcrumb.label}</span>
            ) : (
              <Link
                href={breadcrumb.href}
                className={cn("text-sm font-medium text-muted-foreground hover:text-foreground transition-colors")}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
