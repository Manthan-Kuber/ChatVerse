import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { z } from "zod";
import { prisma } from "../../../server/db/client";

const reqQuerySchema = z.object({
  query: z.object({
    conversationId: z.string(),
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

  const { conversationId, userId } = parsedSchema.data.query;

  try {
    const symmetricKey = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { symmetricKey: true },
    });
    //Wont run
    // if (!symmetricKey) {
    //   const publicKey = await prisma.user.findUnique({
    //     where: { id: userId },
    //     select: { publicKey: true },
    //   });
    //   if (!publicKey)
    //     return res
    //       .status(400)
    //       .json({ message: "Public key for the client does not exist" });
    //   const JSEncrypt = (await import("jsencrypt")).default;
    //   const crypt = new JSEncrypt({ default_key_size: "2048" });
    //   crypt.setPublicKey(publicKey.publicKey);
    //   const encryptedSymmetricKey = crypt.encrypt(crypto.randomUUID());
    //   if (!encryptedSymmetricKey)
    //     return res.status(500).json({ message: "Internal server error" });
    //   await prisma.conversation.update({
    //     where: { id: conversationId },
    //     data: { symmetricKey: encryptedSymmetricKey },
    //   });
    // }
    return res.status(200).json(symmetricKey);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
