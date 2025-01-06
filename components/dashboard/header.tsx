interface DashboardHeaderProps {
  heading: string
  text?: string
}

export function DashboardHeader({ heading, text }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
      {text && <p className="text-lg text-muted-foreground">{text}</p>}
    </div>
  )
}