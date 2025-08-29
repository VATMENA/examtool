CREATE TABLE "examTicket" (
	"id" serial PRIMARY KEY NOT NULL,
	"ticket" varchar NOT NULL,
	"timestamp" integer NOT NULL,
	"validUntil" integer NOT NULL,
	"examId" integer NOT NULL,
	"studentId" integer NOT NULL,
	"issuerId" integer NOT NULL,
	CONSTRAINT "examTicket_ticket_unique" UNIQUE("ticket")
);
--> statement-breakpoint
ALTER TABLE "examAdministration" ADD COLUMN "ticketId" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "examTicket" ADD CONSTRAINT "examTicket_examId_exam_id_fk" FOREIGN KEY ("examId") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examTicket" ADD CONSTRAINT "examTicket_studentId_user_id_fk" FOREIGN KEY ("studentId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examTicket" ADD CONSTRAINT "examTicket_issuerId_user_id_fk" FOREIGN KEY ("issuerId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "examAdministration" ADD CONSTRAINT "examAdministration_ticketId_examTicket_id_fk" FOREIGN KEY ("ticketId") REFERENCES "public"."examTicket"("id") ON DELETE no action ON UPDATE no action;