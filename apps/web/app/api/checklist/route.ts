import {NextRequest, NextResponse} from "next/server";
import { prismaClient } from "@/prisma/client";
import {getSession, withApiAuthRequired} from "@auth0/nextjs-auth0";

export const POST = withApiAuthRequired(async (req: NextRequest) => {
  const res = new NextResponse();
  const session = await getSession(req, res);

  if (!session?.user) {
    return NextResponse.json({
      error: "invalid_session",
      description: "The resolved session does not contain a user"
    }, { status: 500 });
  }

  console.log(session.user)

  const data = await prismaClient.completedChecklist.create({
    data: {
      userId: session.user.sid,
      date: new Date(),
      fields: {}
    }
  });

  return NextResponse.json({ data }, { status: 200 });
})
