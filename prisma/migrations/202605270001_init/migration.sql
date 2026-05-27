-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL DEFAULT 'classic',
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverLetter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "linkedResumeId" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoverLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CoverLetter_linkedResumeId_idx" ON "CoverLetter"("linkedResumeId");

-- AddForeignKey
ALTER TABLE "CoverLetter"
ADD CONSTRAINT "CoverLetter_linkedResumeId_fkey"
FOREIGN KEY ("linkedResumeId") REFERENCES "Resume"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
