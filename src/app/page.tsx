"use client";

import { useEffect, useState, useRef } from "react";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function DetailModal({ item, onClose }: { item: any; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal Card */}
        <motion.div
          className="relative w-full sm:max-w-lg bg-surface-low rounded-t-3xl sm:rounded-3xl border border-outline-variant/30 shadow-2xl overflow-hidden"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        >
          {/* Image */}
          <div className="aspect-[16/7] relative overflow-hidden">
            <img
              src={item.imageUrl}
              onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"; }}
              className="w-full h-full object-cover"
              alt={item.model}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black text-primary uppercase tracking-wider">Ready</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div>
              <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-1">{item.sku} · {item.manufacturer}</p>
              <h3 className="text-lg font-black tracking-tight leading-snug">{item.model}</h3>
            </div>

            {/* Specs grid */}
            {(item.processor || item.ram || item.storage) && (
              <div className="grid grid-cols-3 gap-2">
                {item.processor && (
                  <div className="bg-surface rounded-xl p-3 space-y-1">
                    <p className="text-[8px] font-black text-outline uppercase tracking-wider">CPU</p>
                    <p className="text-[11px] font-bold leading-tight">{item.processor}</p>
                  </div>
                )}
                {item.ram && (
                  <div className="bg-surface rounded-xl p-3 space-y-1">
                    <p className="text-[8px] font-black text-outline uppercase tracking-wider">RAM</p>
                    <p className="text-[11px] font-bold">{item.ram}</p>
                  </div>
                )}
                {item.storage && (
                  <div className="bg-surface rounded-xl p-3 space-y-1">
                    <p className="text-[8px] font-black text-outline uppercase tracking-wider">Storage</p>
                    <p className="text-[11px] font-bold">{item.storage}</p>
                  </div>
                )}
              </div>
            )}

            {item.specs && (
              <p className="text-xs text-on-surface-variant leading-relaxed px-1">{item.specs}</p>
            )}

            {/* Price & CTA */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
              <div>
                <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-0.5">Harga Jual</p>
                <p className="text-2xl font-black text-primary tracking-tight">{formatRupiah(item.sellPrice)}</p>
              </div>
              <button
                onClick={onClose}
                className="px-5 h-10 rounded-xl technical-gradient text-[10px] font-black uppercase tracking-[0.2em]"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HeroSlider({ units }: { units: any[] }) {
  const [current, setCurrent] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % units.length);
    }, 4000);
  };

  useEffect(() => {
    if (units.length < 2) return;
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [units.length]);

  const goTo = (idx: number) => {
    setCurrent(idx);
    resetTimer();
  };

  if (units.length === 0) return null;
  const item = units[current];

  return (
    <>
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      <div
        className="relative premium-card overflow-hidden cursor-pointer group"
        onClick={() => setSelectedItem(item)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row gap-0"
          >
            {/* Image side */}
            <div className="w-full md:w-2/5 aspect-[16/8] md:aspect-auto overflow-hidden relative">
              <img
                src={item.imageUrl}
                onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt={item.model}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-low/50 hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-low via-surface-low/20 to-transparent md:hidden" />
            </div>

            {/* Content side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary px-2.5 py-1 rounded-lg bg-primary/10">Hot Asset</span>
                  <span className="text-[9px] font-black text-outline uppercase tracking-widest">{item.sku}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tight leading-tight">{item.model}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{item.specs}</p>

                {(item.processor || item.ram) && (
                  <div className="flex gap-2 flex-wrap">
                    {item.processor && (
                      <span className="text-[9px] font-bold bg-surface px-2.5 py-1 rounded-lg text-outline border border-outline-variant/30">{item.processor}</span>
                    )}
                    {item.ram && (
                      <span className="text-[9px] font-bold bg-surface px-2.5 py-1 rounded-lg text-outline border border-outline-variant/30">{item.ram}</span>
                    )}
                    {item.storage && (
                      <span className="text-[9px] font-bold bg-surface px-2.5 py-1 rounded-lg text-outline border border-outline-variant/30">{item.storage}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between pt-4 mt-4 border-t border-outline-variant/20">
                <div>
                  <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-1">Harga Jual</p>
                  <p className="text-3xl font-black text-primary tracking-tight">{formatRupiah(item.sellPrice)}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/60 uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">touch_app</span>
                  Tap detail
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        {units.length > 1 && (
          <div className="absolute bottom-4 left-6 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
            {units.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === current ? "bg-primary w-6" : "bg-outline/40 w-1.5 hover:bg-outline/70"
                )}
              />
            ))}
          </div>
        )}

        {/* Nav arrows */}
        {units.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo((current - 1 + units.length) % units.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo((current + 1) % units.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </>
        )}
      </div>
    </>
  );
}

function UnitCard({ item }: { item: any }) {
  const [showDetail, setShowDetail] = useState(false);
  const isSold = item.status === "Sold" || item.status === "TERJUAL";

  return (
    <>
      {showDetail && <DetailModal item={item} onClose={() => setShowDetail(false)} />}
      <div
        className="premium-card group cursor-pointer"
        onClick={() => setShowDetail(true)}
      >
        {/* Image */}
        <div className="aspect-[16/9] relative overflow-hidden bg-surface-high">
          <img
            className={cn(
              "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
              isSold ? "grayscale opacity-40" : ""
            )}
            src={item.imageUrl || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"}
            onError={(e: any) => { e.target.src = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80"; }}
            alt={item.model}
          />
          <div className="absolute top-3 left-3">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider backdrop-blur-md border",
              isSold
                ? "bg-surface-high/80 text-outline border-outline-variant/30"
                : "bg-primary/20 text-primary border-primary/30"
            )}>
              <span className={cn("inline-block w-1 h-1 rounded-full mr-1 mb-px", isSold ? "bg-outline" : "bg-primary animate-pulse")} />
              {isSold ? "Terjual" : "Ready"}
            </span>
          </div>
          {!isSold && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-end p-3">
              <span className="material-symbols-outlined text-white/80 text-[18px]">open_in_new</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[9px] font-mono text-outline uppercase tracking-wider mb-1">{item.sku}</p>
            <h3 className={cn(
              "text-sm font-bold leading-snug truncate",
              isSold ? "text-outline" : "group-hover:text-primary transition-colors"
            )}>{item.model}</h3>
          </div>
          <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3">
            <div>
              <p className="text-[8px] text-outline uppercase font-black tracking-widest mb-0.5">Harga</p>
              <p className={cn("text-base font-black", isSold ? "text-outline/60" : "text-primary")}>
                {formatRupiah(item.sellPrice)}
              </p>
            </div>
            <span className="text-[9px] text-outline/50 font-bold uppercase tracking-wider">Tap detail →</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardPage() {
  const [units, setUnits] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/inventory?status=Ready")
      .then((res) => res.json())
      .then((data) => setUnits(data));
  }, []);

  const filteredUnits = units.filter((unit) => {
    const query = searchQuery.toLowerCase();
    return (
      unit.model.toLowerCase().includes(query) ||
      unit.manufacturer.toLowerCase().includes(query) ||
      unit.sku.toLowerCase().includes(query)
    );
  });

  const featuredUnits = units.slice(0, 5); // Use first 5 for slider

  return (
    <div className="animate-fade-in space-y-6 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Live Catalog</p>
          <h2 className="text-2xl font-black tracking-tight text-gradient-primary uppercase">Price List</h2>
          <p className="text-[10px] text-outline font-medium">Temukan unit terbaik untuk kebutuhan Anda</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative group min-w-[280px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[18px] group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text"
              placeholder="Cari model, merk, atau SKU..."
              className="w-full h-11 bg-surface-low border border-outline-variant/30 rounded-xl pl-11 pr-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="hidden sm:flex glass-panel px-3 py-1.5 h-11 rounded-xl items-center gap-2 border-white/5 text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {mounted ? new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Live"}
          </div>
        </div>
      </header>

      {/* Swipeable Hero Slider (only if no search) */}
      {!searchQuery && featuredUnits.length > 0 && (
        <HeroSlider units={featuredUnits} />
      )}

      {/* Catalog Grid */}
      {filteredUnits.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-outline">
              {searchQuery ? `Hasil Pencarian (${filteredUnits.length})` : "Semua Unit Ready"}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredUnits.map((item, i) => (
              <UnitCard key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {filteredUnits.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center premium-card border-dashed">
          <span className="material-symbols-outlined text-outline/20 text-6xl mb-3">inventory_2</span>
          <p className="text-outline font-black uppercase tracking-widest text-sm">Tidak ada unit tersedia</p>
        </div>
      )}
    </div>
  );
}
