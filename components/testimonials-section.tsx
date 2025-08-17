"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedSection } from "@/components/animated-section"

const testimonials = [
  {
    id: 1,
    content:
      "DocuFlow transformed our invoice processing from days to hours. The AI extraction is incredibly accurate and the workflow automation has saved us countless hours.",
    author: "Sarah Johnson",
    role: "CFO, TechStart Inc.",
    rating: 5,
  },
  {
    id: 2,
    content:
      "The e-signature integration is seamless and the audit trail gives us complete visibility. Our legal team loves the compliance features and security controls.",
    author: "Michael Chen",
    role: "Legal Director, InnovateCorp",
    rating: 5,
  },
  {
    id: 3,
    content:
      "Implementation was smooth and the support team was exceptional. We're processing 10x more documents with the same team size thanks to DocuFlow's automation.",
    author: "Emily Rodriguez",
    role: "Operations Manager, Global Manufacturing",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 sm:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <AnimatedSection>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              See how organizations worldwide are transforming their document workflows with DocuFlow.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="relative">
              <Card className="min-h-[300px] flex items-center">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-[#2563eb] text-[#2563eb]" />
                    ))}
                  </div>
                  <blockquote className="text-xl leading-8 text-foreground mb-6">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-foreground">{testimonials[currentIndex].author}</div>
                    <div className="text-muted-foreground">{testimonials[currentIndex].role}</div>
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-transparent"
                onClick={prevTestimonial}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous testimonial</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent"
                onClick={nextTestimonial}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next testimonial</span>
              </Button>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-[#2563eb]" : "bg-muted-foreground/30",
                  )}
                  onClick={() => setCurrentIndex(index)}
                >
                  <span className="sr-only">Go to testimonial {index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
