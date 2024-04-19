import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { prisma } from "../../../server/db/client";
import { z } from "zod";

const reqQuerySchema = z.object({
  query: z.object({
    userId: z.string(),
  }),
});

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

  const { userId } = parsedSchema.data.query;

  try {
    const receiverPubKey = await prisma.user.findUnique({
      where: { id: userId },
      select: { publicKey: true },
    });
    console.log(receiverPubKey);
    return res.status(200).json(receiverPubKey);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

