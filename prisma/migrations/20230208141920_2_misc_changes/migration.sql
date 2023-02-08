/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `Chats` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chats" ALTER COLUMN "messageId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chats_messageId_key" ON "Chats"("messageId");
