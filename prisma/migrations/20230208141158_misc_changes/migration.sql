-- DropForeignKey
ALTER TABLE "Chats" DROP CONSTRAINT "Chats_groupAdminId_fkey";

-- AlterTable
ALTER TABLE "Chats" ALTER COLUMN "groupAdminId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chats" ADD CONSTRAINT "Chats_groupAdminId_fkey" FOREIGN KEY ("groupAdminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
