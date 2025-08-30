CREATE TABLE "examAdministrationAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"examAdministrationId" integer NOT NULL,
	"questionId" integer NOT NULL,
	"answer" json NOT NULL,
	"isGraded" boolean NOT NULL,
	"requiresManualGrading" boolean NOT NULL,
	"pointsGiven" integer NOT NULL,
	"pointsPossible" integer NOT NULL,
	CONSTRAINT "examAdministrationAnswer_examAdministrationId_questionId_unique" UNIQUE("examAdministrationId","questionId")
);
--> statement-breakpoint
ALTER TABLE "examAdministrationAnswer" ADD CONSTRAINT "examAdministrationAnswer_examAdministrationId_examAdministration_id_fk" FOREIGN KEY ("examAdministrationId") REFERENCES "public"."examAdministration"("id") ON DELETE no action ON UPDATE no action;