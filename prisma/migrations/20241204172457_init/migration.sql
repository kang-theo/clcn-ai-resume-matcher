-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `linkedin` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `status` ENUM('Active', 'Inactive', 'Deleted') NOT NULL DEFAULT 'Active',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` CHAR(100) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolesOnUsers` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assigned_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobDescriptions` (
    `id` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NULL,
    `skills` TEXT NOT NULL,
    `work_scope` VARCHAR(191) NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('Draft', 'Open', 'Closed') NOT NULL DEFAULT 'Draft',
    `contact` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `company` VARCHAR(191) NULL,
    `department` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `job_type` VARCHAR(191) NULL,
    `experience_level` VARCHAR(191) NULL,
    `salary_range` JSON NULL,
    `required_skills` JSON NULL,
    `preferred_skills` JSON NULL,
    `technical_requirements` TEXT NULL,
    `responsibilities` TEXT NOT NULL,
    `qualifications` TEXT NOT NULL,
    `benefits` TEXT NULL,
    `keywords` JSON NULL,
    `skill_weights` JSON NULL,
    `seniority_level` VARCHAR(191) NULL,
    `remote_policy` VARCHAR(191) NULL,
    `visa_sponsorship` BOOLEAN NULL DEFAULT false,
    `industry_sector` VARCHAR(191) NULL,
    `company_size` VARCHAR(191) NULL,
    `role_level` VARCHAR(191) NULL,
    `cultural_keywords` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TagsOnJobDescriptions` (
    `job_id` VARCHAR(191) NOT NULL,
    `tag_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TagsOnJobDescriptions_job_id_tag_id_key`(`job_id`, `tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questionaires` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `standard_scores` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionaireItems` (
    `id` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('text', 'boolean', 'radio', 'checkbox') NOT NULL DEFAULT 'radio',
    `answer` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionaireItemOptions` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionaireItemOptionsOnQuestionaireItems` (
    `option_id` VARCHAR(191) NOT NULL,
    `item_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QuestionaireItemOptionsOnQuestionaireItems_option_id_item_id_key`(`option_id`, `item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionaireItemOnQuestionaires` (
    `questionaire_id` VARCHAR(191) NOT NULL,
    `questionaire_item_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `operator` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `QuestionaireItemOnQuestionaires_questionaire_id_questionaire_key`(`questionaire_id`, `questionaire_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestionairesOnJobDescriptions` (
    `job_description_id` VARCHAR(191) NOT NULL,
    `questionaire_id` VARCHAR(191) NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`job_description_id`, `questionaire_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resumes` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnlineResumes` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `summary` TEXT NOT NULL,
    `headline` VARCHAR(191) NULL,
    `current_status` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `relocation` BOOLEAN NOT NULL DEFAULT false,
    `remote_preference` VARCHAR(191) NULL,
    `experiences` JSON NOT NULL,
    `technical_skills` JSON NOT NULL,
    `soft_skills` JSON NOT NULL,
    `education` JSON NOT NULL,
    `certifications` JSON NULL,
    `job_preferences` JSON NOT NULL,
    `projects` JSON NULL,
    `languages` JSON NULL,
    `ai_analysis` JSON NULL,
    `visibility` VARCHAR(191) NOT NULL DEFAULT 'public',
    `completeness` INTEGER NOT NULL DEFAULT 0,
    `last_updated` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `skills_searchable` TEXT NULL,

    INDEX `OnlineResumes_user_id_idx`(`user_id`),
    INDEX `OnlineResumes_skills_searchable_idx`(`skills_searchable`(768)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Applications` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `online_resume_id` VARCHAR(191) NOT NULL,
    `job_description_id` VARCHAR(191) NOT NULL,
    `questionaire_id` VARCHAR(191) NULL,
    `questionare_answers` JSON NULL,
    `resume_id` VARCHAR(191) NULL,
    `scores` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `last_modifier` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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

-- CreateTable
CREATE TABLE `JobMatch` (
    `id` VARCHAR(191) NOT NULL,
    `job_description_id` VARCHAR(191) NOT NULL,
    `online_resume_id` VARCHAR(191) NOT NULL,
    `overall_match_score` DOUBLE NOT NULL,
    `skill_match_score` DOUBLE NOT NULL,
    `experience_match_score` DOUBLE NOT NULL,
    `education_match_score` DOUBLE NOT NULL,
    `matching_skills` JSON NOT NULL,
    `missing_skills` JSON NOT NULL,
    `recommendations` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `JobMatch_job_description_id_idx`(`job_description_id`),
    INDEX `JobMatch_online_resume_id_idx`(`online_resume_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolesOnUsers` ADD CONSTRAINT `RolesOnUsers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolesOnUsers` ADD CONSTRAINT `RolesOnUsers_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsOnJobDescriptions` ADD CONSTRAINT `TagsOnJobDescriptions_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TagsOnJobDescriptions` ADD CONSTRAINT `TagsOnJobDescriptions_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `Tags`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionaireItemOptionsOnQuestionaireItems` ADD CONSTRAINT `QuestionaireItemOptionsOnQuestionaireItems_option_id_fkey` FOREIGN KEY (`option_id`) REFERENCES `QuestionaireItemOptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionaireItemOptionsOnQuestionaireItems` ADD CONSTRAINT `QuestionaireItemOptionsOnQuestionaireItems_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `QuestionaireItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionaireItemOnQuestionaires` ADD CONSTRAINT `QuestionaireItemOnQuestionaires_questionaire_id_fkey` FOREIGN KEY (`questionaire_id`) REFERENCES `Questionaires`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionaireItemOnQuestionaires` ADD CONSTRAINT `QuestionaireItemOnQuestionaires_questionaire_item_id_fkey` FOREIGN KEY (`questionaire_item_id`) REFERENCES `QuestionaireItems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionairesOnJobDescriptions` ADD CONSTRAINT `QuestionairesOnJobDescriptions_job_description_id_fkey` FOREIGN KEY (`job_description_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestionairesOnJobDescriptions` ADD CONSTRAINT `QuestionairesOnJobDescriptions_questionaire_id_fkey` FOREIGN KEY (`questionaire_id`) REFERENCES `Questionaires`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Resumes` ADD CONSTRAINT `Resumes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineResumes` ADD CONSTRAINT `OnlineResumes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_online_resume_id_fkey` FOREIGN KEY (`online_resume_id`) REFERENCES `OnlineResumes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_job_description_id_fkey` FOREIGN KEY (`job_description_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_questionaire_id_fkey` FOREIGN KEY (`questionaire_id`) REFERENCES `Questionaires`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applications` ADD CONSTRAINT `Applications_resume_id_fkey` FOREIGN KEY (`resume_id`) REFERENCES `Resumes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobDescriptionAnalysis` ADD CONSTRAINT `JobDescriptionAnalysis_job_description_id_fkey` FOREIGN KEY (`job_description_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobDescriptionAnalysis` ADD CONSTRAINT `JobDescriptionAnalysis_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMatch` ADD CONSTRAINT `JobMatch_job_description_id_fkey` FOREIGN KEY (`job_description_id`) REFERENCES `JobDescriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobMatch` ADD CONSTRAINT `JobMatch_online_resume_id_fkey` FOREIGN KEY (`online_resume_id`) REFERENCES `OnlineResumes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
