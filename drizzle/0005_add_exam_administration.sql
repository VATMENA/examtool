CREATE TABLE "examAdministration" (
	"id" serial PRIMARY KEY NOT NULL,
	"examId" integer NOT NULL,
	"userId" integer NOT NULL,
	"examData" json NOT NULL,
	"startedAt" integer NOT NULL,
	"timeExpiresAt" integer NOT NULL,
	"isSubmitted" boolean NOT NULL,
	"points" integer NOT NULL,
	"pointsAvailable" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "examAdministration" ADD CONSTRAINT "examAdministration_examId_exam_id_fk" FOREIGN KEY ("examId") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examAdministration" ADD CONSTRAINT "examAdministration_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;