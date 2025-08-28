CREATE TABLE "session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"secretHash" varchar NOT NULL,
	"createdAt" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name_first" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name_last" SET NOT NULL;