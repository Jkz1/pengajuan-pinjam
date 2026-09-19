CREATE TYPE "public"."application_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."application_type" AS ENUM('MOTORCYCLE', 'CAR', 'MULTIPURPOSE');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_name" varchar(255) NOT NULL,
	"application_type" "application_type" NOT NULL,
	"amount" bigint NOT NULL,
	"tenor" integer NOT NULL,
	"monthly_income" bigint NOT NULL,
	"monthly_payment" bigint NOT NULL,
	"notes" text,
	"status" "application_status" DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
