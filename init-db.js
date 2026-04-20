const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

console.log("Initializing database...");

// Create Tables
db.prepare(`
  CREATE TABLE IF NOT EXISTS laptops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT NOT NULL,
    sku TEXT NOT NULL UNIQUE,
    manufacturer TEXT NOT NULL,
    processor TEXT,
    ram TEXT,
    storage TEXT,
    resolution TEXT,
    price REAL NOT NULL,
    image_url TEXT,
    status TEXT DEFAULT 'Ready',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    total_amount REAL NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'Success',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(customer_id) REFERENCES customers(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS transaction_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id INTEGER,
    laptop_id INTEGER,
    price_at_sale REAL NOT NULL,
    FOREIGN KEY(transaction_id) REFERENCES transactions(id),
    FOREIGN KEY(laptop_id) REFERENCES laptops(id)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Sales',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log("Tables created. Seeding data...");

// Seed User
const userCheck = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@etl-managed.tech");
if (!userCheck) {
  db.prepare(`
    INSERT INTO users (name, email, password_hash, role)
    VALUES ('Admin Kurator', 'admin@etl-managed.tech', 'password123', 'Superadmin')
  `).run();
}

// Seed Laptops
const laptopSeeds = [
  {
    model: "MacBook Pro 14\" M3",
    sku: "AAP-MBP-14-M3",
    manufacturer: "Apple",
    processor: "Apple M3",
    ram: "16GB",
    storage: "512GB",
    resolution: "3024 x 1964",
    price: 1999,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzcqOyf2s5HaHm0L1l9LeVO6kYp1wwQ2t4BOCOm7_Z13mRrUEo3I5VaqgcyP8TRJ5izFTWJj3teFtvsne4wniaDqKpeiqeI-IYBH0R1S3PYF4xsCPLd8qUrglYcrfpa2xvcPXSd6hnWPVS6qy6LQOQ10RpV5YBM97Qv2DU9jhoWyena5ZBO3SxgKU70z6gBGvOSVLq0ksIOOshYUUpztfLJu8tN5bqPoX0suvG46Lxgz4OGHwHy2NYcDqL1gaAiXhlPfAdYZJATRDT",
    status: "Ready",
  },
  {
    model: "Dell XPS 15 9530",
    sku: "DLL-XPS-15-9530",
    manufacturer: "Dell",
    processor: "Intel Core i7-13700H",
    ram: "16GB",
    storage: "512GB",
    resolution: "1920 x 1200",
    price: 1450,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuALy0kEiAhwXEzzdeFr5MACsp-FszD7uDi_fNkMyxcaUk-XJoBq1g2E9gtcnNFdYx-3SX-atpc_JttHe-JGrmHR2-DBZ2Gq4sI7gMgEjSU9EcONWEtUSxSrGcK9LxCZbyGPECNYdfA5vre34LjjApjAin-FJI6p0Z4QMsIj04KqUgFJz_1KHOKxieNj3J5pFBWrnsPJaN8uYU2_3HOuDFrApF1v2LSXXl74TkvUZ7tvsD1TjM-886NC253zmyzVwe71-yJ8au9__yKP",
    status: "Ready",
  },
  {
    model: "ThinkPad X1 Carbon Gen 11",
    sku: "LNV-X1C-11",
    manufacturer: "Lenovo",
    processor: "Intel Core i7-1355U",
    ram: "16GB",
    storage: "512GB",
    resolution: "1920 x 1200",
    price: 1299,
    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQqmgeiZ3DMLA6_ogX5KppQ7KbwlkEerXuHcbjbiBy7WUjGot6cUrlLID7XoCjF1XR8MGcx7YXy9DywejDKm4i0a_ABM5Eu3GK5RPzinNfs54b2ZT6GzTzwpwDaBduGBvvFtT59sSdjUYF08Go6PmLIfehr75DIWcjtXvd0MYcM6ibbXFaaz7-ER-N8XdpnlMp-NzpCoU8TOo5xwX3lZehdqEPEMaJVFCg50L9tik1aO6m0uCP03omcEcCCpLFMReK5jwbJr_75tTi",
    status: "QC",
  },
];

for (const laptop of laptopSeeds) {
  const check = db.prepare("SELECT id FROM laptops WHERE sku = ?").get(laptop.sku);
  if (!check) {
    db.prepare(`
      INSERT INTO laptops (model, sku, manufacturer, processor, ram, storage, resolution, price, image_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(laptop.model, laptop.sku, laptop.manufacturer, laptop.processor, laptop.ram, laptop.storage, laptop.resolution, laptop.price, laptop.image_url, laptop.status);
  }
}

console.log("Database initialized and seeded successfully.");
db.close();
