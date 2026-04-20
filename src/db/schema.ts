import { pgTable, serial, text, doublePrecision, timestamp, integer } from "drizzle-orm/pg-core";

export const laptops = pgTable("laptops", {
  id: serial("id").primaryKey(),
  model: text("model").notNull(),
  sku: text("sku").notNull().unique(),
  manufacturer: text("manufacturer").notNull(),
  processor: text("processor"),
  ram: text("ram"),
  storage: text("storage"),
  resolution: text("resolution"),
  buyPrice: doublePrecision("buy_price").default(0),
  extraCost: doublePrecision("extra_cost").default(0),
  sellPrice: doublePrecision("sell_price").notNull(),
  imageUrl: text("image_url"),
  specs: text("specs"),
  status: text("status").default("Ready"), // Can be Ready, Sold, QC, Archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  totalAmount: doublePrecision("total_amount").notNull(),
  paymentMethod: text("payment_method").notNull(), // Tunai, Kartu, QRIS
  status: text("status").default("Success"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactionItems = pgTable("transaction_items", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").references(() => transactions.id),
  laptopId: integer("laptop_id").references(() => laptops.id),
  priceAtSale: doublePrecision("price_at_sale").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").unique(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").default("Sales"), // Developer, Owner, Admin, Sales
  permissions: text("permissions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const loginHistory = pgTable("login_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: text("ip_address"),
  status: text("status").default("Success"),
});
