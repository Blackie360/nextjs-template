"use client"

import { useSession } from "next-auth/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"

const profileFormSchema = z.object({
  name: z.string().min(2).max(50),
})

export default function SettingsPage() {
  const { data: session } = useSession()
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
    },
  })

  async function onSubmit(data: z.infer<typeof profileFormSchema>) {
    try {
      // Update user profile logic here
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />
      <div className="grid gap-10">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Update your profile information.
              </p>
            </div>
            <div className="grid gap-4">
              <Input
                {...form.register("name")}
                label="Name"
                placeholder="Your name"
              />
            </div>
            <Button type="submit">Update profile</Button>
          </div>
        </form>
      </div>
    </DashboardShell>
  )
}