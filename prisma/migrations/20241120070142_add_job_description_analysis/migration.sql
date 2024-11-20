-- CreateTable
CREATE TABLE `JobDescriptionAnalysis` (
    `id` VARCHAR(191) NOT NULL,
    `job_description_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `score` DECIMAL(10, 2) NULL,
    `analysis` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobDescriptionAnalysis` ADD CONSTRAINT `JobDescriptionAnalysis_job_description_id_fkey` FOREIGN KEY (`job_description_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobDescriptionAnalysis` ADD CONSTRAINT `JobDescriptionAnalysis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
