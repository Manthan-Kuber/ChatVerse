import { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../../server/common/get-server-auth-session";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });

  //   if (!session) return res.status(401).json({ message: "User not signed in" });

  return res.status(200).json({ message: "hi" });
}
