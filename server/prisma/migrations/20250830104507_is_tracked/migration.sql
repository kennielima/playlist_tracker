/*
  Warnings:

  - You are about to drop the column `chartCountryId` on the `Playlists` table. All the data in the column will be lost.
  - You are about to drop the `ChartCountries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Playlists" DROP CONSTRAINT "Playlists_chartCountryId_fkey";

-- AlterTable
ALTER TABLE "Playlists" DROP COLUMN "chartCountryId",
ADD COLUMN     "isTracked" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "ChartCountries";
