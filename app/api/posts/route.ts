import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const postSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = postSchema.parse(json)

    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: session.user.id,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}