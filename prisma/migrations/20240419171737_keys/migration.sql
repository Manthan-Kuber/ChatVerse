/*
  Warnings:

  - Made the column `symmetricKey` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "symmetricKey" SET NOT NULL,
ALTER COLUMN "symmetricKey" SET DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "publicKey" SET DEFAULT '';
