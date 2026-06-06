-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('GOVERNMENT', 'PRIVATE');

-- CreateEnum
CREATE TYPE "NaacGrade" AS ENUM ('A_PLUS_PLUS', 'A_PLUS', 'A', 'B_PLUS_PLUS', 'B_PLUS', 'B', 'C', 'NOT_ACCREDITED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colleges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "fees" DECIMAL(12,2) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownershipType" "OwnershipType" NOT NULL,
    "naacGrade" "NaacGrade" NOT NULL DEFAULT 'NOT_ACCREDITED',
    "establishedYear" INTEGER NOT NULL,
    "placementAverage" DECIMAL(12,2) NOT NULL,
    "placementHighest" DECIMAL(12,2) NOT NULL,
    "topRecruiters" TEXT[],
    "imageUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "colleges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "courseName" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fees" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_colleges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_colleges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "colleges_slug_key" ON "colleges"("slug");

-- CreateIndex
CREATE INDEX "colleges_state_idx" ON "colleges"("state");

-- CreateIndex
CREATE INDEX "colleges_city_idx" ON "colleges"("city");

-- CreateIndex
CREATE INDEX "colleges_rating_idx" ON "colleges"("rating");

-- CreateIndex
CREATE INDEX "colleges_fees_idx" ON "colleges"("fees");

-- CreateIndex
CREATE INDEX "colleges_ownershipType_idx" ON "colleges"("ownershipType");

-- CreateIndex
CREATE INDEX "colleges_naacGrade_idx" ON "colleges"("naacGrade");

-- CreateIndex
CREATE INDEX "colleges_isDeleted_idx" ON "colleges"("isDeleted");

-- CreateIndex
CREATE INDEX "colleges_createdAt_idx" ON "colleges"("createdAt");

-- CreateIndex
CREATE INDEX "courses_collegeId_idx" ON "courses"("collegeId");

-- CreateIndex
CREATE INDEX "reviews_collegeId_idx" ON "reviews"("collegeId");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_userId_collegeId_key" ON "reviews"("userId", "collegeId");

-- CreateIndex
CREATE INDEX "saved_colleges_userId_idx" ON "saved_colleges"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_colleges_userId_collegeId_key" ON "saved_colleges"("userId", "collegeId");

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_colleges" ADD CONSTRAINT "saved_colleges_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "colleges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
