CREATE TABLE "facilityRole" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"facilityId" varchar NOT NULL,
	"role" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "facilityRole_userId_facilityId_unique" UNIQUE("userId","facilityId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"secretHash" varchar NOT NULL,
	"createdAt" integer NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" integer PRIMARY KEY NOT NULL,
	"name_first" varchar NOT NULL,
	"name_last" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "facilityRole" ADD CONSTRAINT "facilityRole_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;