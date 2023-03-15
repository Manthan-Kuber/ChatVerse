import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import { getChats } from "../../../server/common/getChats";

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

  try {
    const chats = await getChats(session.user.id);
    return res.status(200).json(chats);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
