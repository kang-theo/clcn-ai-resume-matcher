-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('Active', 'Inactive', 'Deleted');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('Draft', 'Open', 'Closed');

-- CreateEnum
CREATE TYPE "QuestionaireItemType" AS ENUM ('text', 'boolean', 'radio', 'checkbox');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "linkedin" TEXT,
    "address" TEXT,
    "status" "UserState" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" CHAR(100) NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolesOnUsers" (
    "user_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assigned_by" TEXT NOT NULL,

    CONSTRAINT "RolesOnUsers_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "JobDescriptions" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "company" TEXT,
    "position" TEXT,
    "skills" TEXT NOT NULL,
    "work_scope" TEXT,
    "description" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'Draft',
    "contact" TEXT,
    "department" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobDescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnJobDescriptions" (
    "job_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Questionaires" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "standard_scores" INTEGER,

    CONSTRAINT "Questionaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionaireItems" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "QuestionaireItemType" NOT NULL DEFAULT 'radio',
    "answer" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionaireItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionaireItemOptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionaireItemOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionaireItemOptionsOnQuestionaireItems" (
    "option_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "operator" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionaireItemOnQuestionaires" (
    "questionaire_id" TEXT NOT NULL,
    "questionaire_item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "operator" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "QuestionairesOnJobDescriptions" (
    "job_description_id" TEXT NOT NULL,
    "questionaire_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionairesOnJobDescriptions_pkey" PRIMARY KEY ("job_description_id","questionaire_id")
);

-- CreateTable
CREATE TABLE "Resumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnlineResumes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnlineResumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "job_description_id" TEXT NOT NULL,
    "questionaire_id" TEXT NOT NULL,
    "questionare_answers" JSONB,
    "resume_id" TEXT NOT NULL,
    "scores" INTEGER NOT NULL DEFAULT 0,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'pending',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_modifier" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "onlineResumesId" TEXT,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TagsOnJobDescriptions_job_id_tag_id_key" ON "TagsOnJobDescriptions"("job_id", "tag_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionaireItemOptionsOnQuestionaireItems_option_id_item_i_key" ON "QuestionaireItemOptionsOnQuestionaireItems"("option_id", "item_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionaireItemOnQuestionaires_questionaire_id_questionair_key" ON "QuestionaireItemOnQuestionaires"("questionaire_id", "questionaire_item_id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesOnUsers" ADD CONSTRAINT "RolesOnUsers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolesOnUsers" ADD CONSTRAINT "RolesOnUsers_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnJobDescriptions" ADD CONSTRAINT "TagsOnJobDescriptions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "JobDescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnJobDescriptions" ADD CONSTRAINT "TagsOnJobDescriptions_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionaireItemOptionsOnQuestionaireItems" ADD CONSTRAINT "QuestionaireItemOptionsOnQuestionaireItems_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "QuestionaireItemOptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionaireItemOptionsOnQuestionaireItems" ADD CONSTRAINT "QuestionaireItemOptionsOnQuestionaireItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "QuestionaireItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionaireItemOnQuestionaires" ADD CONSTRAINT "QuestionaireItemOnQuestionaires_questionaire_id_fkey" FOREIGN KEY ("questionaire_id") REFERENCES "Questionaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionaireItemOnQuestionaires" ADD CONSTRAINT "QuestionaireItemOnQuestionaires_questionaire_item_id_fkey" FOREIGN KEY ("questionaire_item_id") REFERENCES "QuestionaireItems"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionairesOnJobDescriptions" ADD CONSTRAINT "QuestionairesOnJobDescriptions_job_description_id_fkey" FOREIGN KEY ("job_description_id") REFERENCES "JobDescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionairesOnJobDescriptions" ADD CONSTRAINT "QuestionairesOnJobDescriptions_questionaire_id_fkey" FOREIGN KEY ("questionaire_id") REFERENCES "Questionaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resumes" ADD CONSTRAINT "Resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnlineResumes" ADD CONSTRAINT "OnlineResumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_job_description_id_fkey" FOREIGN KEY ("job_description_id") REFERENCES "JobDescriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_questionaire_id_fkey" FOREIGN KEY ("questionaire_id") REFERENCES "Questionaires"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_resume_id_fkey" FOREIGN KEY ("resume_id") REFERENCES "Resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_onlineResumesId_fkey" FOREIGN KEY ("onlineResumesId") REFERENCES "OnlineResumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
