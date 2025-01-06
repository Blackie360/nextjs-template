import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const routeContextSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
})

export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const post = await prisma.post.findUnique({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
    })

    if (!post) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.post.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse(null, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = postSchema.parse(json)

    const post = await prisma.post.update({
      where: {
        id: params.id,
        authorId: session.user.id,
      },
      data: {
        title: body.title,
        content: body.content,
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