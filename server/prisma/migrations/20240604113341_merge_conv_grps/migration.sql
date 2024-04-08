/*
  Warnings:

  - You are about to drop the column `groupId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserConversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `creatorId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Made the column `conversationId` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('PRIVATE', 'GROUP');

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_GroupUsers" DROP CONSTRAINT "_GroupUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupUsers" DROP CONSTRAINT "_GroupUsers_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserConversations" DROP CONSTRAINT "_UserConversations_B_fkey";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "avatar" STRING;
ALTER TABLE "Conversation" ADD COLUMN     "creatorId" UUID NOT NULL;
ALTER TABLE "Conversation" ADD COLUMN     "name" STRING;
ALTER TABLE "Conversation" ADD COLUMN     "type" "ConversationType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "groupId";
ALTER TABLE "Message" ALTER COLUMN "conversationId" SET NOT NULL;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "_GroupUsers";

-- DropTable
DROP TABLE "_UserConversations";

-- CreateTable
CREATE TABLE "_ConversationUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationUsers_AB_unique" ON "_ConversationUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationUsers_B_index" ON "_ConversationUsers"("B");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUsers" ADD CONSTRAINT "_ConversationUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
