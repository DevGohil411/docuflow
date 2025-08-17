import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "hello@modernsite.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+1 (555) 123-4567",
    description: "Mon-Fri from 8am to 6pm",
  },
  {
    icon: MapPin,
    title: "Office",
    details: "123 Business Ave, Suite 100",
    description: "San Francisco, CA 94105",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: "Monday - Friday",
    description: "8:00 AM - 6:00 PM PST",
  },
]

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get in <span className="text-[#2563eb]">Touch</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Ready to start your next project? We'd love to hear from you. Send us a message and we'll respond as soon
              as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Send us a message</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Contact Information */}
            <div className="lg:pl-8">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Contact Information</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Prefer to reach out directly? Here are all the ways you can get in touch with us.
              </p>
              <div className="mt-8 space-y-6">
                {contactInfo.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563eb]/10">
                          <item.icon className="h-5 w-5 text-[#2563eb]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                          <p className="text-base font-medium text-foreground">{item.details}</p>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Have questions? Here are some of the most common ones we receive.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-foreground">How long does a typical project take?</h3>
                <p className="mt-2 text-muted-foreground">
                  Project timelines vary depending on scope and complexity. Simple websites typically take 2-4 weeks,
                  while complex applications can take 2-6 months. We'll provide a detailed timeline during our initial
                  consultation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Do you offer ongoing support and maintenance?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes! We offer comprehensive support and maintenance packages to keep your website or application
                  running smoothly. This includes security updates, performance monitoring, and feature enhancements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">What's your development process like?</h3>
                <p className="mt-2 text-muted-foreground">
                  We follow an agile development approach with regular check-ins and updates. You'll be involved
                  throughout the process with opportunities to review and provide feedback at each milestone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
