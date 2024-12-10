/*
  Warnings:

  - Made the column `company` on table `JobDescriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `JobDescriptions` MODIFY `company` JSON NOT NULL;
