ALTER TYPE "public"."application_status" RENAME TO "status";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "application_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."application_type";--> statement-breakpoint
CREATE TYPE "public"."application_type" AS ENUM('Sepeda Motor', 'Mobil', 'Multiguna');--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "application_type" SET DATA TYPE "public"."application_type" USING "application_type"::"public"."application_type";--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "amount" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "monthly_income" SET DATA TYPE numeric(15, 2);--> statement-breakpoint
ALTER TABLE "applications" ALTER COLUMN "monthly_payment" SET DATA TYPE numeric(15, 2);