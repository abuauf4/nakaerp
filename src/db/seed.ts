import "dotenv/config";
import { db } from "./index";
import { laptops, users, transactions, transactionItems, customers } from "./schema";

const seed = async () => {
  console.log("Cleaning and Seeding database...");

  // Delete in reverse FK order
  await db.delete(transactionItems);
  await db.delete(transactions);
  await db.delete(customers);
  await db.delete(laptops);
  await db.delete(users);

  await db.insert(users).values({
    name: "Admin Kurator",
    email: "admin@etl-managed.tech",
    passwordHash: "password123",
    role: "Superadmin",
  });

  await db.insert(laptops).values([
    {
      model: 'MacBook Pro 14" M3 Max - Space Black',
      sku: "IDB-0001",
      manufacturer: "Apple",
      processor: "Apple M3 Max (14-core)",
      ram: "36GB",
      storage: "1TB SSD",
      resolution: "3024 x 1964",
      buyPrice: 38000000,
      extraCost: 500000,
      sellPrice: 45500000,
      // Reliable Unsplash direct-format
      imageUrl: "https://images.unsplash.com/photo-1517336715461-d6a7d971510e?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Mulus 99%, garansi iBox aktif. Battery Health 100%.",
    },
    {
      model: "ASUS ROG Zephyrus G14 2024",
      sku: "IDB-0002",
      manufacturer: "Asus",
      processor: "AMD Ryzen 9 8945HS",
      ram: "32GB",
      storage: "1TB SSD",
      resolution: "2880 x 1800 (OLED)",
      buyPrice: 26000000,
      extraCost: 0,
      sellPrice: 32000000,
      imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Baru segel, Garansi resmi ASUS Indonesia 2 tahun.",
    },
    {
      model: "ThinkPad X1 Carbon Gen 11",
      sku: "IDB-0003",
      manufacturer: "Lenovo",
      processor: "Intel Core i7-1365U vPro",
      ram: "16GB",
      storage: "512GB SSD",
      resolution: "1920 x 1200",
      buyPrice: 14000000,
      extraCost: 1500000,
      sellPrice: 18500000,
      imageUrl: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Laptop eks-kantor, ganti keyboard baru + thermal paste.",
    },
    {
      model: 'MacBook Air 15" M3 - Midnight',
      sku: "IDB-0004",
      manufacturer: "Apple",
      processor: "Apple M3",
      ram: "16GB",
      storage: "512GB SSD",
      resolution: "2880 x 1864",
      buyPrice: 18000000,
      extraCost: 250000,
      sellPrice: 23500000,
      imageUrl: "https://images.unsplash.com/photo-1611186871348-71ce4fe4759e?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Fullset, kemulusan 99%. iBox regional. Plastik belum dilepas.",
    },
    {
      model: "Lenovo Legion 5i Pro Gen 8",
      sku: "IDB-0005",
      manufacturer: "Lenovo",
      processor: "Intel Core i7-13700HX",
      ram: "16GB",
      storage: "1TB SSD",
      resolution: "2560 x 1600",
      buyPrice: 15500000,
      extraCost: 500000,
      sellPrice: 19800000,
      imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Lengkap nota, garansi ADP aktif s/d Mei 2025. Mulus.",
    },
    {
      model: "Dell XPS 15 OLED 9530",
      sku: "IDB-0006",
      manufacturer: "Dell",
      processor: "Intel Core i9-13900H",
      ram: "32GB",
      storage: "1TB SSD",
      resolution: "3840 x 2400 (OLED)",
      buyPrice: 22000000,
      extraCost: 800000,
      sellPrice: 28000000,
      imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd81b2f612?w=800&auto=format&fit=crop&q=80",
      status: "Ready",
      specs: "Panel OLED 4K touch. Kondisi 97%, bekas developer.",
    },
    {
      model: "ASUS ProArt Studiobook 16 OLED",
      sku: "IDB-0007",
      manufacturer: "Asus",
      processor: "AMD Ryzen 9 7945HX",
      ram: "64GB",
      storage: "2TB SSD",
      resolution: "3200 x 2000 (OLED)",
      buyPrice: 32000000,
      extraCost: 0,
      sellPrice: 38500000,
      imageUrl: "https://images.unsplash.com/photo-1593642632632-72ced7779d34?w=800&auto=format&fit=crop&q=80",
      status: "QC",
      specs: "Workstation kelas kreator. Layar OLED 120Hz. Masih dalam pengecekan.",
    },
  ]);

  console.log("Seeding completed successfully ✅");
};

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
