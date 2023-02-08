/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Chats` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Chats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chatsId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[latestMessageId]` on the table `Message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chatsId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latestMessageId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_messageId_fkey";

-- DropIndex
DROP INDEX "Chats_userId_key";

-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "createdAt",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "chatsId" TEXT NOT NULL,
ADD COLUMN     "latestMessageId" TEXT NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_ChatsToMessage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatsToMessage_AB_unique" ON "_ChatsToMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatsToMessage_B_index" ON "_ChatsToMessage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Message_chatsId_key" ON "Message"("chatsId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_latestMessageId_key" ON "Message"("latestMessageId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_latestMessageId_fkey" FOREIGN KEY ("latestMessageId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToMessage" ADD CONSTRAINT "_ChatsToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatsToMessage" ADD CONSTRAINT "_ChatsToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
