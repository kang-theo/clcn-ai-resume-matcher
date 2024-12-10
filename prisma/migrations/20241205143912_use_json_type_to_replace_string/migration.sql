/*
  Warnings:

  - Made the column `required_skills` on table `JobDescriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `JobDescriptions` MODIFY `required_skills` JSON NOT NULL;
