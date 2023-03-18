import { type Prisma } from "@prisma/client";
import { prisma } from "../db/client";

//Returns a promise which needs to be resolved
function getChats(userId: string) {
  return prisma.conversation.findMany({
    where: {
      participants: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      participants: {
        where: {
          NOT: {
            userId, //Return participants other than current signed in user
          },
        },
        select: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
      latestMessage: {
        select: { body: true },
      },
    },
  });
}

type GetChats = Prisma.PromiseReturnType<typeof getChats>;

export { getChats, type GetChats };
