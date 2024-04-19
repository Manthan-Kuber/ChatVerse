-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "symmetricKey" DROP NOT NULL,
ALTER COLUMN "symmetricKey" DROP DEFAULT;
