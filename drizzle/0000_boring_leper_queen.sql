CREATE TABLE IF NOT EXISTS "customers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "customers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "laptops" (
	"id" serial PRIMARY KEY NOT NULL,
	"model" text NOT NULL,
	"sku" text NOT NULL,
	"manufacturer" text NOT NULL,
	"processor" text,
	"ram" text,
	"storage" text,
	"resolution" text,
	"buy_price" double precision DEFAULT 0,
	"extra_cost" double precision DEFAULT 0,
	"sell_price" double precision NOT NULL,
	"image_url" text,
	"specs" text,
	"status" text DEFAULT 'Ready',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "laptops_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer,
	"laptop_id" integer,
	"price_at_sale" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer,
	"total_amount" double precision NOT NULL,
	"payment_method" text NOT NULL,
	"status" text DEFAULT 'Success',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'Sales',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_laptop_id_laptops_id_fk" FOREIGN KEY ("laptop_id") REFERENCES "public"."laptops"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
