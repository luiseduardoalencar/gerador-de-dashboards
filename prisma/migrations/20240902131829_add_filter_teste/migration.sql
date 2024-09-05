/*
  Warnings:

  - You are about to drop the column `chartId` on the `Filter` table. All the data in the column will be lost.
  - Added the required column `dashboardId` to the `Filter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_chartId_fkey";

-- AlterTable
ALTER TABLE "Filter" DROP COLUMN "chartId",
ADD COLUMN     "dashboardId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
