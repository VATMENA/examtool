CREATE TABLE "examAvailableQuestion" (
	"id" serial PRIMARY KEY NOT NULL,
	"examId" integer NOT NULL,
	"questionData" json NOT NULL
);
--> statement-breakpoint
ALTER TABLE "examAvailableQuestion" ADD CONSTRAINT "examAvailableQuestion_examId_exam_id_fk" FOREIGN KEY ("examId") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;