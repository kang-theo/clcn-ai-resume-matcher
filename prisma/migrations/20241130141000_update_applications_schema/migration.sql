/*
  Warnings:

  - You are about to drop the column `created_by` on the `Applications` table. All the data in the column will be lost.
  - You are about to drop the column `onlineResumesId` on the `Applications` table. All the data in the column will be lost.
  - Added the required column `online_resume_id` to the `Applications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Applications` DROP FOREIGN KEY `Applications_onlineResumesId_fkey`;

-- DropForeignKey
ALTER TABLE `Applications` DROP FOREIGN KEY `Applications_questionaire_id_fkey`;

-- DropForeignKey
ALTER TABLE `Applications` DROP FOREIGN KEY `Applications_resume_id_fkey`;

-- AlterTable
ALTER TABLE `Applications` DROP COLUMN `created_by`,
    DROP COLUMN `onlineResumesId`,
    ADD COLUMN `online_resume_id` VARCHAR(191) NOT NULL,
    MODIFY `questionaire_id` VARCHAR(191) NULL,
    MODIFY `resume_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_online_resume_id_fkey` FOREIGN KEY (`online_resume_id`) REFERENCES `OnlineResumes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_questionaire_id_fkey` FOREIGN KEY (`questionaire_id`) REFERENCES `Questionaires`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_resume_id_fkey` FOREIGN KEY (`resume_id`) REFERENCES `Resumes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
