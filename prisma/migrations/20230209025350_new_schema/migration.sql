/*
  Warnings:

  - You are about to drop the column `chatsId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `latestMessageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `chatsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ChatsToMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MessageToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_groupAdminId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_latestMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_chatsId_fkey";

-- DropForeignKey
ALTER TABLE "_ChatsToMessage" DROP CONSTRAINT "_ChatsToMessage_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChatsToMessage" DROP CONSTRAINT "_ChatsToMessage_B_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageToUser" DROP CONSTRAINT "_MessageToUser_B_fkey";

-- DropIndex
DROP INDEX "Message_chatsId_key";

-- DropIndex
DROP INDEX "Message_latestMessageId_key";

-- DropIndex
DROP INDEX "Message_userId_key";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "chatsId",
DROP COLUMN "content",
DROP COLUMN "latestMessageId",
DROP COLUMN "userId",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatsId",
DROP COLUMN "isAdmin";

-- DropTable
DROP TABLE "Chats";

-- DropTable
DROP TABLE "_ChatsToMessage";

-- DropTable
DROP TABLE "_MessageToUser";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "latestMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_latestMessageId_key" ON "Conversation"("latestMessageId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_latestMessageId_fkey" FOREIGN KEY ("latestMessageId") REFERENCES "Message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
