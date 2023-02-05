import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "../../server/db/client";
import { z } from "zod";
import { Prisma } from "@prisma/client";

interface SearchRequest extends NextApiRequest {
  query: {
    searchQuery: string;
    userId: string;
  };
}

const reqQuerySchema = z.object({
  query: z.object({
    searchQuery: z.string(),
    userId: z.string(),
  }),
});

function searchUser(searchQuery: string, userId: string) {
  return prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
      NOT: {
        id: userId,
      },
    },
  });
}

const search = async (req: SearchRequest, res: NextApiResponse) => {
  if (req.method !== "GET")
    return res.status(404).json({
      message: "Invalid HTTP Method. Only GET method is Accepted.",
    });
  const parsedQuery = reqQuerySchema.safeParse(req);
  if (!parsedQuery.success)
    return res.status(422).json({ message: "Invalid Request" });
  try {
    const searchedUser = await searchUser(
      req.query.searchQuery,
      req.query.userId
    );
    return res.status(200).json(searchedUser);
  } catch (e) {
    console.log(e);
    res.status(400).end();
  }
};

export type UserSearch = Prisma.PromiseReturnType<typeof searchUser>;

export default search;
