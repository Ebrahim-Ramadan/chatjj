CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(256) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
