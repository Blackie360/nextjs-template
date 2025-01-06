import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Features } from "@/components/features"
import { Testimonials } from "@/components/testimonials"

export default function Home() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            A modern Next.js template for your next project
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI. 
            Authentication, database, and deployment ready.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
      <Features />
      <Testimonials />
    </>
  )
}