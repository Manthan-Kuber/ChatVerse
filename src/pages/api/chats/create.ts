import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const reqBodySchema = z.object({
  userId: z.string(),
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

  const parsedSchema = reqBodySchema.safeParse(JSON.parse(req.body));

  if (!parsedSchema.success)
    return res.status(400).json({ message: "Invalid Request" });

  const { userId } = parsedSchema.data;

  if (userId === session.user.id)
    return res
      .status(400)
      .json({ message: "User Id same as signed in user's id" });

  try {
    if (session?.user?.id) {
      //Check for combination of id
      const chatExists = await prisma.conversation.findMany({
        where: {
          OR: [
            { id: session.user.id + userId },
            { id: userId + session.user.id },
          ],
        },
      });

      if (chatExists.length !== 0)
        return res
          .status(403)
          .json({ message: "Chat already exists", chat: chatExists });

      const newChat = await prisma.conversation.create({
        data: {
          id: session.user.id + userId, //Create conv with combination of userIds
          participants: {
            createMany: {
              data: [{ userId: session.user.id }, { userId }],
            },
          },
        },
      });
      return res
        .status(201)
        .json({ message: "Chat created successfully", chat: newChat });
    } else {
      return res
        .status(500)
        .json({ message: "Error in creating conversation" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
