CREATE TABLE "auditLogEntry" (
	"id" serial PRIMARY KEY NOT NULL,
	"timestamp" integer NOT NULL,
	"userId" integer NOT NULL,
	"action" varchar NOT NULL,
	"data" json NOT NULL
);
