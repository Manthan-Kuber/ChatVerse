import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { z } from "zod";
import { type Prisma } from "@prisma/client";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const reqQuerySchema = z.object({
  query: z.object({
    searchQuery: z.string(),
  }),
});

function searchUser(searchQuery: string, userId: string) {
  return prisma.user.findMany({
    where: {
      name: {
        contains: searchQuery,
        mode: "insensitive",
      },
      NOT: {
        id: userId,
      },
    },
  });
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (!session?.user)
    return res.status(401).json({ message: "User is not signed in" });

  if (req.method !== "GET")
    return res.status(405).json({
      message: "Invalid HTTP Method. Only GET method is Accepted.",
    });
  const parsedQuery = reqQuerySchema.safeParse(req);
  if (!parsedQuery.success)
    return res.status(400).json({ message: "Invalid Request" });
  const { searchQuery } = parsedQuery.data.query;
  try {
    if (session.user?.id) {
      const searchedUsers = await searchUser(searchQuery, session.user.id);
      return res.status(200).json(searchedUsers);
    } else {
      return res.status(500).json({ message: "Error in searching" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export type UserSearch = Prisma.PromiseReturnType<typeof searchUser>;

export default handler;
