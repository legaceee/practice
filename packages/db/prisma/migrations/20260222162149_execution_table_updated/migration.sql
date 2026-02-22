/*
  Warnings:

  - Added the required column `triggerData` to the `Execution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Execution" ADD COLUMN     "triggerData" JSONB NOT NULL;
