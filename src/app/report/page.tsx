"use client";

import { useState, useEffect } from "react";
import { formatRupiah } from "@/lib/utils";
import { motion } from "framer-motion";

const FALLBACK_IMAGES: Record<string, string> = {
  "Apple": "https://images.unsplash.com/photo-1517336715461-d6a7d971510e?w=800&auto=format&fit=crop&q=80",
  "Asus": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80",
  "Lenovo": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80",
  "default": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80",
};

export default function ReportPage() {
  const [laptops, setLaptops] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/inventory").then(r => r.json()),
      fetch("/api/transactions").then(r => r.json()).catch(() => []),
    ]).then(([inv, txn]) => {
      setLaptops(inv);
      setTransactions(txn);
      setLoading(false);
    });
  }, []);

  const soldUnits = laptops.filter(l => l.status === "Sold");
  const readyUnits = laptops.filter(l => l.status === "Ready");
  const totalRevenue = soldUnits.reduce((a, l) => a + (l.sellPrice || 0), 0);
  const totalModal = soldUnits.reduce((a, l) => a + (l.buyPrice || 0) + (l.extraCost || 0), 0);
  const totalProfit = totalRevenue - totalModal;
  const avgSale = soldUnits.length > 0 ? totalRevenue / soldUnits.length : 0;

  // Count by manufacturer for distribution
  const byBrand: Record<string, number> = {};
  laptops.forEach(l => {
    byBrand[l.manufacturer] = (byBrand[l.manufacturer] || 0) + 1;
  });
  const brandEntries = Object.entries(byBrand).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const totalUnits = laptops.length || 1;

  const brandColors = ["bg-primary", "bg-secondary", "bg-tertiary", "bg-outline"];

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Intelligence & Analytics</p>
          <h2 className="text-2xl font-black tracking-tight text-gradient-primary uppercase">Report</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => alert("Export CSV dalam pengembangan")}
            className="h-9 px-4 rounded-xl border border-outline-variant/30 text-[10px] font-black uppercase text-outline hover:text-foreground hover:border-outline/50 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[15px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Total Revenue"
          value={loading ? "—" : formatRupiah(totalRevenue)}
          trend={soldUnits.length > 0 ? `${soldUnits.length} unit` : "—"}
          positive
          icon="payments"
        />
        <KpiCard
          label="Net Profit"
          value={loading ? "—" : formatRupiah(totalProfit)}
          trend={totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margin` : "—"}
          positive={totalProfit >= 0}
          icon="trending_up"
        />
        <KpiCard
          label="Unit Terjual"
          value={loading ? "—" : soldUnits.length.toString()}
          trend={`${readyUnits.length} ready`}
          icon="inventory_2"
        />
        <KpiCard
          label="Rata-rata Jual"
          value={loading ? "—" : formatRupiah(avgSale)}
          trend="per unit"
          icon="analytics"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Stock Status Chart */}
        <div className="lg:col-span-8 premium-card p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight">Status Stok</h3>
              <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-0.5">Distribusi unit per kondisi</p>
            </div>
          </div>

          {/* Visual bar chart of laptop prices */}
          <div className="h-48 flex items-end gap-2">
            {laptops.slice(0, 8).map((l, i) => {
              const maxPrice = Math.max(...laptops.map(x => x.sellPrice || 0)) || 1;
              const h = ((l.sellPrice || 0) / maxPrice) * 160;
              const isSold = l.status === "Sold";
              return (
                <div key={i} className="flex-1 group relative flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 relative overflow-hidden ${isSold ? "bg-outline/30" : "bg-primary/30 group-hover:bg-primary/60"}`}
                    style={{ height: `${Math.max(h, 12)}px` }}
                  >
                    <div className={`absolute bottom-0 w-full h-0.5 ${isSold ? "bg-outline/60" : "bg-primary"}`} />
                  </div>
                  <span className="text-[7px] font-black text-outline uppercase truncate text-center w-full">
                    {l.sku?.split("-")[1]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-outline-variant/20">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-2 rounded bg-primary/60" />
              <span className="text-outline font-bold">Ready ({readyUnits.length})</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-2 rounded bg-outline/40" />
              <span className="text-outline font-bold">Terjual ({soldUnits.length})</span>
            </div>
          </div>
        </div>

        {/* Brand Distribution */}
        <div className="lg:col-span-4 space-y-4">
          <div className="premium-card p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 border-b border-white/5 pb-3">Brand Distribution</h3>
            <div className="space-y-4">
              {loading ? (
                <p className="text-xs text-outline">Memuat...</p>
              ) : brandEntries.map(([brand, count], i) => (
                <DistributionItem
                  key={brand}
                  label={brand}
                  percentage={Math.round((count / totalUnits) * 100)}
                  color={brandColors[i] || "bg-outline"}
                />
              ))}
            </div>
          </div>

          <div className="premium-card p-5 bg-primary/5 border-primary/20 relative overflow-hidden group">
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-8xl text-primary/10 group-hover:scale-110 transition-transform duration-700">insights</span>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Smart Insight</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {soldUnits.length > 0
                ? `${soldUnits.length} unit telah terjual. Total profit bersih ${formatRupiah(totalProfit)} dari modal ${formatRupiah(totalModal)}.`
                : "Belum ada transaksi tercatat. Mulai tambah unit dan lakukan penjualan lewat Kasir."}
            </p>
          </div>
        </div>
      </div>

      {/* Top Units */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <h3 className="text-base font-black uppercase tracking-tight">Semua Unit</h3>
          <span className="text-[9px] text-outline font-bold">{laptops.length} total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {laptops.slice(0, 6).map((l, i) => {
            const fallback = FALLBACK_IMAGES[l.manufacturer] || FALLBACK_IMAGES["default"];
            return (
              <div key={i} className="premium-card p-4 flex items-center gap-4 hover:border-primary/40 transition-all">
                <div className="text-2xl font-black text-outline/20 italic w-8">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="w-14 h-10 rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                  <img
                    src={l.imageUrl || fallback}
                    onError={(e: any) => { e.target.src = fallback; }}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[11px] font-black truncate">{l.model}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[9px] text-outline uppercase font-mono">{l.sku}</span>
                    <span className={`text-[9px] font-black ${l.status === "Sold" ? "text-outline" : "text-primary"}`}>
                      {formatRupiah(l.sellPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function KpiCard({ label, value, trend, positive, icon }: any) {
  return (
    <div className="premium-card p-3 md:p-4 flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-2 md:mb-3">
        <span className="material-symbols-outlined text-[16px] md:text-[18px] text-outline group-hover:text-primary transition-colors">{icon}</span>
        <span className={`text-[7px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded-full ${positive === false ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}>
          {trend}
        </span>
      </div>
      <div>
        <div className="text-xs md:text-lg font-black text-foreground group-hover:text-primary transition-colors break-all leading-tight">{value}</div>
        <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-outline mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function DistributionItem({ label, percentage, color }: any) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-bold text-on-surface-variant">{label}</span>
        <span className="text-[10px] font-black text-foreground">{percentage}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-high rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
