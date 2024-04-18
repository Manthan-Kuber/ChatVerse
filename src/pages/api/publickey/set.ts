import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

const reqBodySchema = z.object({
  publicKey: z.string(),
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
    return res.status(400).json({
      message: "Invalid Request. Required parameters missing from the request",
    });

  const { userId, publicKey } = parsedSchema.data;

  //TODO Uncomment later
  // if (userId !== session.user.id)
  //   return res.status(403).json({ message: "Forbidden Operation" });

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { publicKey },
    });
    return res
      .status(201)
      .json({ message: "Updated public key successfully", publicKey });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export type UpdatePublicKey = {
  message: string;
  publicKey?: string;
};