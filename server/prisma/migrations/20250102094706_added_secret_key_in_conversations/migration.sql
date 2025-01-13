/*
  Warnings:

  - Added the required column `key` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "key" STRING NOT NULL;
