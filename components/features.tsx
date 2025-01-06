import { 
  LayoutDashboard, 
  Lock, 
  Database, 
  Palette 
} from "lucide-react"

const features = [
  {
    title: "Modern Dashboard",
    description: "Beautiful and functional dashboard with dark mode support.",
    icon: LayoutDashboard,
  },
  {
    title: "Authentication",
    description: "Secure authentication with NextAuth.js and multiple providers.",
    icon: Lock,
  },
  {
    title: "Database Ready",
    description: "Prisma ORM with PostgreSQL for reliable data storage.",
    icon: Database,
  },
  {
    title: "Beautiful UI",
    description: "Styled with Tailwind CSS and Shadcn UI components.",
    icon: Palette,
  },
]

export function Features() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to build your next project
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <feature.icon className="h-12 w-12" />
              <div className="space-y-2">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}