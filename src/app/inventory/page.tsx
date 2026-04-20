"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LaptopCard } from "@/components/inventory/LaptopCard";
import { Button } from "@/components/ui/Button";
import { formatRupiah, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_FILTERS = [
  { label: "Semua", value: "" },
  { label: "Ready", value: "Ready" },
  { label: "Terjual", value: "Sold" },
  { label: "QC", value: "QC" },
];

export default function InventoryPage() {
  const router = useRouter();
  const [laptops, setLaptops] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("/api/inventory")
      .then(res => res.json())
      .then(data => setLaptops(data));
  }, []);

  const filtered = laptops.filter(l => {
    const matchSearch = !search || 
      l.model?.toLowerCase().includes(search.toLowerCase()) ||
      l.sku?.toLowerCase().includes(search.toLowerCase()) ||
      l.manufacturer?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalValue = laptops.reduce((a, l) => a + (l.sellPrice || 0), 0);

  return (
    <div className="animate-fade-in space-y-5 pb-24">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Warehouse Assets</p>
          <h2 className="text-2xl font-black tracking-tight text-gradient-primary uppercase">Inventory</h2>
        </div>
        <div className="flex gap-3">
          <div className="premium-card px-4 py-2.5 flex flex-col justify-center border-none bg-surface-high/50 min-w-[90px]">
            <span className="text-[8px] text-outline font-black uppercase tracking-widest">Total Stock</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black">{laptops.length}</span>
              <span className="text-[9px] text-outline">units</span>
            </div>
          </div>
          <div className="premium-card px-4 py-2.5 flex flex-col justify-center border-none bg-primary/10">
            <span className="text-[8px] text-primary/80 font-black uppercase tracking-widest">Asset Value</span>
            <span className="text-lg font-black text-primary">{formatRupiah(totalValue)}</span>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="glass-panel p-2 rounded-2xl flex flex-wrap gap-2 items-center border-white/5 shadow-lg">
        {/* Search */}
        <div className="relative flex-grow min-w-[180px] group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline group-focus-within:text-primary transition-colors">search</span>
          <input
            className="w-full bg-transparent pl-10 pr-4 h-10 rounded-xl border-none outline-none text-sm placeholder:text-outline/40 font-medium"
            placeholder="Cari SKU, model, atau merk..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="h-7 w-px bg-outline-variant/30 hidden md:block" />

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                statusFilter === f.value
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "text-outline hover:bg-surface-high/60 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="h-7 w-px bg-outline-variant/30 hidden md:block" />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-surface-high/40 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center transition-all",
              viewMode === "grid" ? "bg-primary/20 text-primary" : "text-outline hover:text-foreground"
            )}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center transition-all",
              viewMode === "list" ? "bg-primary/20 text-primary" : "text-outline hover:text-foreground"
            )}
          >
            <span className="material-symbols-outlined text-[18px]">view_list</span>
          </button>
        </div>
      </div>

      {/* Results count */}
      {(search || statusFilter) && (
        <p className="text-[10px] text-outline font-bold">
          {filtered.length} unit ditemukan
          {search && <span> untuk "<span className="text-primary">{search}</span>"</span>}
          {statusFilter && <span> · status: <span className="text-primary">{statusFilter}</span></span>}
        </p>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((laptop, i) => (
              <motion.div
                key={laptop.id || i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.2 }}
              >
                <LaptopCard
                  name={laptop.model}
                  sku={laptop.sku}
                  price={laptop.sellPrice}
                  status={laptop.status}
                  image={laptop.imageUrl}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {filtered.map((laptop, i) => {
              const isSold = laptop.status === "Sold";
              const fallback = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80";
              return (
                <motion.div
                  key={laptop.id || i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  className="premium-card flex items-center gap-4 p-4 hover:border-primary/30 transition-all group cursor-pointer"
                >
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-surface-high flex-shrink-0">
                    <img
                      src={laptop.imageUrl || fallback}
                      onError={(e: any) => { e.target.src = fallback; }}
                      className={cn("w-full h-full object-cover group-hover:scale-105 transition-transform", isSold && "grayscale opacity-50")}
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[9px] font-mono text-outline uppercase">{laptop.sku}</p>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full",
                        isSold ? "bg-outline/20 text-outline" : "bg-primary/20 text-primary"
                      )}>
                        {isSold ? "Terjual" : laptop.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{laptop.model}</h3>
                    {(laptop.processor || laptop.ram) && (
                      <p className="text-[10px] text-outline mt-0.5 truncate">{laptop.processor}{laptop.ram && ` · ${laptop.ram}`}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[8px] text-outline uppercase font-black">Harga Jual</p>
                    <p className={cn("text-base font-black", isSold ? "text-outline/60" : "text-primary")}>{formatRupiah(laptop.sellPrice)}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center premium-card border-dashed">
          <span className="material-symbols-outlined text-outline/20 text-6xl mb-3">inventory_2</span>
          <p className="text-outline font-black uppercase tracking-widest text-sm">
            {search ? "Tidak ditemukan" : "Tidak ada unit"}
          </p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => router.push("/inventory/add")}
        className="fixed bottom-20 md:bottom-8 right-5 md:right-8 technical-gradient h-14 px-5 gap-2 rounded-2xl shadow-[0_12px_30px_rgba(42,161,152,0.35)] z-50 flex items-center hover:scale-105 transition-transform border border-white/10"
      >
        <span className="material-symbols-outlined text-xl">add</span>
        <span className="font-black uppercase tracking-widest text-[10px] hidden md:block">Register Unit</span>
      </button>
    </div>
  );
}
