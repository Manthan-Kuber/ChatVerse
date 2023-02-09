import { type NextApiRequest, type NextApiResponse } from "next";
import { z } from "zod";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";

const reqBodySchema = z.object({
  body: z.object({
    userId: z.string(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  if (!session)
    return res.status(401).json({ message: "User is not signed in" });

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Invalid HTTP Method. Only POST method is Accepted.",
    });
  }

  const parsedSchema = reqBodySchema.safeParse(req);

  if (!parsedSchema.success)
    return res.status(400).json({ message: "Invalid Request" });

  const { userId } = parsedSchema.data.body;

  try {
    if (session?.user?.id) {
      const newChat = await prisma.conversation.create({
        data: {
          participants: {
            createMany: {
              data: [{ userId: session?.user?.id }, { userId }],
            },
          },
        },
      });
      return res.status(201).send(newChat);
    } else {
      res.status(500).json({ message: "Error in creating conversation" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
}
