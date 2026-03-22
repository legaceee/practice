/*
  Warnings:

  - Changed the type of `type` on the `Node` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `service` on the `Node` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('TRIGGER', 'ACTION');

-- CreateEnum
CREATE TYPE "Service" AS ENUM ('EMAIL', 'WEBHOOK');

-- AlterTable
ALTER TABLE "Node" DROP COLUMN "type",
ADD COLUMN     "type" "NodeType" NOT NULL,
DROP COLUMN "service",
ADD COLUMN     "service" "Service" NOT NULL;
