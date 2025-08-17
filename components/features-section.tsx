"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Shield, Users } from "lucide-react"
import { AnimatedSection } from "@/components/animated-section"

const features = [
  {
    name: "AI-Powered OCR",
    description: "Extract text and data from documents with industry-leading accuracy using advanced AI technology.",
    icon: FileText,
  },
  {
    name: "Automated Workflows",
    description:
      "Create custom workflows that automatically route, process, and approve documents based on your rules.",
    icon: Zap,
  },
  {
    name: "Enterprise Security",
    description: "Bank-grade encryption, compliance certifications, and granular access controls keep your data safe.",
    icon: Shield,
  },
  {
    name: "Team Collaboration",
    description: "Real-time collaboration tools with comments, annotations, and approval workflows for your team.",
    icon: Users,
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for document management
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              From intelligent processing to secure storage, DocuFlow provides all the tools your organization needs to
              manage documents efficiently and securely.
            </p>
          </div>
        </AnimatedSection>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.name} delay={index * 0.1}>
                <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
                      <feature.icon className="h-6 w-6 text-[#2563eb]" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-7">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
