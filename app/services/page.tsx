import { ServiceCard } from "@/components/service-card"
import { Button } from "@/components/ui/button"
import { Code, Palette, Smartphone, Globe, Database, Shield } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Custom web applications built with modern frameworks like React, Next.js, and TypeScript. Scalable, performant, and maintainable solutions.",
    icon: Code,
    features: ["React & Next.js", "TypeScript", "API Integration", "Performance Optimization"],
    price: "Starting at $5,000",
  },
  {
    id: 2,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive user interfaces that provide exceptional user experiences. From wireframes to pixel-perfect designs.",
    icon: Palette,
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    price: "Starting at $3,000",
  },
  {
    id: 3,
    title: "Mobile Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android. Built with React Native and modern mobile technologies.",
    icon: Smartphone,
    features: ["React Native", "iOS & Android", "App Store Deployment", "Push Notifications"],
    price: "Starting at $8,000",
  },
  {
    id: 4,
    title: "E-commerce Solutions",
    description: "Complete e-commerce platforms with payment processing, inventory management, and customer analytics.",
    icon: Globe,
    features: ["Payment Integration", "Inventory Management", "Analytics", "SEO Optimization"],
    price: "Starting at $7,500",
  },
  {
    id: 5,
    title: "Database Design",
    description:
      "Robust database architecture and optimization for high-performance applications. SQL and NoSQL solutions.",
    icon: Database,
    features: ["Database Architecture", "Query Optimization", "Data Migration", "Backup Solutions"],
    price: "Starting at $2,500",
  },
  {
    id: 6,
    title: "Security Consulting",
    description:
      "Comprehensive security audits and implementation of best practices to protect your applications and data.",
    icon: Shield,
    features: ["Security Audits", "Penetration Testing", "Compliance", "Risk Assessment"],
    price: "Starting at $4,000",
  },
]

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Our <span className="text-[#2563eb]">Services</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              We offer a comprehensive range of digital services to help your business thrive in the modern world. From
              web development to mobile apps, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Ready to get started?</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Let's discuss your project and see how we can help bring your vision to life.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button asChild size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                <Link href="/contact">Start Your Project</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
