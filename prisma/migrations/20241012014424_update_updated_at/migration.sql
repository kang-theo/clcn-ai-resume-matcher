-- AlterTable
ALTER TABLE `Applications` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `JobDescriptions` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `QuestionaireItemOnQuestionaires` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `QuestionaireItemOptions` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `QuestionaireItemOptionsOnQuestionaireItems` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `QuestionaireItems` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Questionaires` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `QuestionairesOnJobDescriptions` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Resumes` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Role` ALTER COLUMN `updated_at` DROP DEFAULT;

-- AlterTable
ALTER TABLE `User` ALTER COLUMN `updated_at` DROP DEFAULT;
