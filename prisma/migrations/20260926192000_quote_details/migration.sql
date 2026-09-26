ALTER TABLE "User" ADD COLUMN "company" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "serviceType" TEXT NOT NULL DEFAULT 'Autre';
ALTER TABLE "QuoteRequest" ADD COLUMN "dimensions" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "quantity" INTEGER;
ALTER TABLE "QuoteRequest" ADD COLUMN "material" TEXT;
ALTER TABLE "QuoteRequest" ADD COLUMN "tolerance" TEXT;
