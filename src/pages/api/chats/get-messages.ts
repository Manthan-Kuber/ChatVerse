import { type Prisma } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const reqQuerySchema = z.object({
  query: z.object({
    conversationId: z.string(),
    receiverId: z.string(),
  }),
});

async function getMessages(conversationId: string) {
  const messages = await prisma.conversation.findMany({
    where: {
      id: conversationId,
    },
    select: {
      messages: true,
    },
  });
  return messages.flatMap((m) => m.messages);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user)
    return res.status(401).json({ message: "User is not signed in" });

  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Invalid HTTP Method. Only GET method is Accepted.",
    });
  }

  const parsedSchema = reqQuerySchema.safeParse(req);

  if (!parsedSchema.success)
    return res.status(400).json({
      message: "Invalid Request. Required parameters missing from the request",
    });

  const { conversationId, receiverId } = parsedSchema.data.query;

  const isConvValid =
    conversationId === session.user.id + receiverId ||
    conversationId === receiverId + session.user.id;

  if (!isConvValid)
    return res
      .status(400)
      .json({ message: "Invalid conversation or receiver id" });

  try {
    const messages = await getMessages(conversationId);
    return res.status(200).json(messages);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export type GetMessages = Prisma.PromiseReturnType<typeof getMessages>;
