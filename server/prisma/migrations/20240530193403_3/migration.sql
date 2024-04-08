/*
  Warnings:

  - Added the required column `contactId` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "contactId" STRING NOT NULL;
ALTER TABLE "Contact" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "participants" STRING[];
ALTER TABLE "Conversation" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "createdBy" STRING NOT NULL;
ALTER TABLE "Group" ADD COLUMN     "members" STRING[];
ALTER TABLE "Group" ADD COLUMN     "userId" UUID;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "conversationId" UUID;
ALTER TABLE "Message" ADD COLUMN     "createdBy" STRING NOT NULL;
ALTER TABLE "Message" ADD COLUMN     "groupId" UUID;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
