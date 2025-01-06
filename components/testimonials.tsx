import Image from "next/image"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    content: "This template saved me hours of setup time. The code structure and best practices are top-notch.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&q=80",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer",
    content: "The authentication and database integration worked flawlessly. Highly recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&q=80",
  },
]

export function Testimonials() {
  return (
    <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Testimonials
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          See what others are saying about our template
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem]">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="relative overflow-hidden rounded-lg border bg-background p-6"
          >
            <div className="flex items-center gap-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover"
                width={48}
                height={48}
              />
              <div>
                <h3 className="font-bold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </section>
  )
}