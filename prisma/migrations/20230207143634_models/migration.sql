-- AlterTable
ALTER TABLE "User" ADD COLUMN     "chatsId" TEXT,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "isGroupChat" BOOLEAN NOT NULL DEFAULT false,
    "chatName" TEXT NOT NULL,
    "groupAdminId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MessageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Chats_groupAdminId_key" ON "Chats"("groupAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "Chats_userId_key" ON "Chats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_userId_key" ON "Message"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MessageToUser_AB_unique" ON "_MessageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageToUser_B_index" ON "_MessageToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatsId_fkey" FOREIGN KEY ("chatsId") REFERENCES "Chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_groupAdminId_fkey" FOREIGN KEY ("groupAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
