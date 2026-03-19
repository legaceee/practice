/*
  Warnings:

  - You are about to drop the `Execution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Execution" DROP CONSTRAINT "Execution_workflowId_fkey";

-- DropTable
DROP TABLE "Execution";
