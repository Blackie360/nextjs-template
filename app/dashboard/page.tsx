import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { PostsList } from "@/components/dashboard/posts-list"
import { CreatePost } from "@/components/dashboard/create-post"

export default async function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Create and manage your posts."
      />
      <div className="grid gap-8">
        <CreatePost />
        <PostsList />
      </div>
    </DashboardShell>
  )
}