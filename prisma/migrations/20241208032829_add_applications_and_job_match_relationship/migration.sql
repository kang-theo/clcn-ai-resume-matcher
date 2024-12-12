/*
  Warnings:

  - A unique constraint covering the columns `[job_match_id]` on the table `Applications` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Applications` ADD COLUMN `job_match_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Applications_job_match_id_key` ON `Applications`(`job_match_id`);

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_job_match_id_fkey` FOREIGN KEY (`job_match_id`) REFERENCES `JobMatch`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
