import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"
import Link from "next/link"

const values = [
  {
    name: "Innovation",
    description: "We embrace cutting-edge technologies and creative solutions to solve complex problems.",
    icon: Target,
  },
  {
    name: "Excellence",
    description: "We strive for the highest quality in everything we do, from code to customer service.",
    icon: Award,
  },
  {
    name: "Collaboration",
    description: "We believe in the power of teamwork and building strong partnerships with our clients.",
    icon: Users,
  },
  {
    name: "Passion",
    description: "We love what we do and are committed to helping our clients achieve their goals.",
    icon: Heart,
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-[#2563eb]">About Us</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Building the future, one project at a time
                </p>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  We are a passionate team of developers, designers, and strategists dedicated to creating exceptional
                  digital experiences. With years of combined experience and a commitment to excellence, we help
                  businesses transform their ideas into reality.
                </p>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Our mission is to empower organizations with modern, scalable, and user-friendly solutions that drive
                  growth and success. We believe in the power of technology to make a positive impact on the world.
                </p>
                <div className="mt-10">
                  <Button asChild size="lg" className="bg-[#2563eb] hover:bg-[#1d4ed8]">
                    <Link href="/contact">Work With Us</Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
              <Image
                src="/modern-office-collaboration.png"
                alt="Team collaboration in modern office"
                width={600}
                height={600}
                className="w-full max-w-none rounded-xl shadow-xl ring-1 ring-border sm:w-[57rem] md:-ml-4 lg:-ml-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 sm:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Values</h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              These core principles guide everything we do and shape how we work with our clients and each other.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => (
                <Card key={value.name} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2563eb]/10">
                        <value.icon className="h-6 w-6 text-[#2563eb]" aria-hidden="true" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.name}</h3>
                    <p className="text-muted-foreground leading-7">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Impact in Numbers</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Our track record speaks for itself. Here are some numbers that showcase our impact.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col bg-muted/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">Projects Completed</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-foreground">250+</dd>
              </div>
              <div className="flex flex-col bg-muted/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">Happy Clients</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-foreground">150+</dd>
              </div>
              <div className="flex flex-col bg-muted/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">Years Experience</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-foreground">8+</dd>
              </div>
              <div className="flex flex-col bg-muted/50 p-8">
                <dt className="text-sm font-semibold leading-6 text-muted-foreground">Team Members</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-foreground">25+</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  )
}
