import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const reqBodySchema = z.object({
  body: z.object({
    conversationId: z.string(),
    messageBody: z.string(),
    receiverId: z.string(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user)
    return res.status(401).json({ message: "User is not signed in" });

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Invalid HTTP Method. Only POST method is Accepted.",
    });
  }

  const parsedSchema = reqBodySchema.safeParse(req);

  if (!parsedSchema.success)
    return res.status(400).json({
      message: "Invalid Request. Required parameters missing from the request",
    });

  const { conversationId, messageBody, receiverId } = parsedSchema.data.body;

  if (receiverId === session.user.id)
    return res.status(400).json({ message: "Cannot message yourself" });

  const isConvValid =
    conversationId === session.user.id + receiverId ||
    conversationId === receiverId + session.user.id;

  if (!isConvValid)
    return res.status(400).json({ message: "Invalid conversation or receiver id" });

  try {
    const newMessage = await prisma.message.create({
      data: {
        conversationId,
        body: messageBody,
        senderId: session.user.id,
      },
    });
    return res
      .status(201)
      .json({ message: "Created message successfully", newMessage });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
}
