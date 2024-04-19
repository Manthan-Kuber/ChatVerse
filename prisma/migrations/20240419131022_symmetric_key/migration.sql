-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "symmetricKey" TEXT NOT NULL DEFAULT 'symmetricKey';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isEncrypted" BOOLEAN NOT NULL DEFAULT false;
