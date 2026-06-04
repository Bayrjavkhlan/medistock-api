CREATE TABLE IF NOT EXISTS "ImagingStudyImage" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "imageId" TEXT NOT NULL,
  "captureDateTime" TIMESTAMP(3) NOT NULL,
  "captureDate" TEXT NOT NULL,
  "captureTime" TEXT NOT NULL,
  "fileSizeBytes" INTEGER NOT NULL,
  "studyType" TEXT NOT NULL,
  "department" TEXT NOT NULL,
  "patientCode" TEXT NOT NULL,
  "hospitalId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ImagingStudyImage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AnalyticsReport" (
  "id" TEXT NOT NULL,
  "deviceId" TEXT NOT NULL,
  "period" TEXT NOT NULL,
  "periodStart" TIMESTAMP(3) NOT NULL,
  "periodEnd" TIMESTAMP(3) NOT NULL,
  "fileName" TEXT NOT NULL,
  "pdfBase64" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnalyticsReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ImagingStudyImage_imageId_key" ON "ImagingStudyImage"("imageId");
CREATE INDEX IF NOT EXISTS "ImagingStudyImage_deviceId_captureDateTime_idx" ON "ImagingStudyImage"("deviceId", "captureDateTime");
CREATE INDEX IF NOT EXISTS "ImagingStudyImage_hospitalId_captureDateTime_idx" ON "ImagingStudyImage"("hospitalId", "captureDateTime");
CREATE INDEX IF NOT EXISTS "AnalyticsReport_deviceId_period_createdAt_idx" ON "AnalyticsReport"("deviceId", "period", "createdAt");

DO $$
BEGIN
  ALTER TABLE "ImagingStudyImage"
    ADD CONSTRAINT "ImagingStudyImage_deviceId_fkey"
    FOREIGN KEY ("deviceId") REFERENCES "Equipment"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "ImagingStudyImage"
    ADD CONSTRAINT "ImagingStudyImage_hospitalId_fkey"
    FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER TABLE "AnalyticsReport"
    ADD CONSTRAINT "AnalyticsReport_deviceId_fkey"
    FOREIGN KEY ("deviceId") REFERENCES "Equipment"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
