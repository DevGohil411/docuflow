"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Service {
  id: number
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  features: string[]
  price: string
}

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        "border-2 hover:border-[#2563eb]/20",
        isHovered && "shadow-xl -translate-y-1 border-[#2563eb]/20",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg transition-colors duration-300",
              "bg-[#2563eb]/10 group-hover:bg-[#2563eb]/20",
            )}
          >
            <service.icon
              className={cn("h-6 w-6 transition-colors duration-300", "text-[#2563eb] group-hover:text-[#1d4ed8]")}
            />
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {service.price}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold group-hover:text-[#2563eb] transition-colors duration-300">
          {service.title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">What's included:</h4>
          <ul className="space-y-1">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-muted-foreground">
                <Check className="mr-2 h-4 w-4 text-[#2563eb] flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <Button
            asChild
            className={cn(
              "w-full transition-all duration-300",
              "bg-[#2563eb] hover:bg-[#1d4ed8]",
              "group-hover:shadow-lg",
            )}
          >
            <Link href="/contact">
              Get Started
              <ArrowRight
                className={cn("ml-2 h-4 w-4 transition-transform duration-300", isHovered && "translate-x-1")}
              />
            </Link>
          </Button>
        </div>
      </CardContent>

      {/* Animated background gradient */}
      <div
        className={cn(
          "absolute inset-0 -z-10 opacity-0 transition-opacity duration-300",
          "bg-gradient-to-br from-[#2563eb]/5 via-transparent to-[#3b82f6]/5",
          isHovered && "opacity-100",
        )}
      />
    </Card>
  )
}
