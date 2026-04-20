"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn, formatRupiah } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const FALLBACK = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&auto=format&fit=crop&q=80";

export default function KasirPage() {
  const [skuSearch, setSkuSearch] = useState("");
  const [skuResults, setSkuResults] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [paperSize, setPaperSize] = useState<"a4" | "letter">("a4");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Predictive SKU search
  useEffect(() => {
    if (skuSearch.length > 1) {
      fetch(`/api/inventory?query=${encodeURIComponent(skuSearch)}`)
        .then(r => r.json())
        .then(data => {
          setSkuResults(data.filter((i: any) => i.status === "Ready"));
          setShowResults(true);
        });
    } else {
      setSkuResults([]);
      setShowResults(false);
    }
  }, [skuSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowResults(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const addToCart = (item: any) => {
    setCart(prev => prev.find(i => i.id === item.id) ? prev : [...prev, { ...item }]);
    setSkuSearch("");
    setShowResults(false);
    inputRef.current?.focus();
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const totalDeal = cart.reduce((a, i) => a + (i.sellPrice || 0), 0);

  const scanBarcode = () => {
    setScanning(true);
  };

  useEffect(() => {
    if (!scanning) return;
    
    let html5QrcodeScanner: any;
    import("html5-qrcode").then((Html5Qrcode) => {
      html5QrcodeScanner = new Html5Qrcode.Html5QrcodeScanner(
        "barcode-reader",
        { fps: 10, qrbox: { width: 250, height: 100 } },
        false
      );

      html5QrcodeScanner.render(
        (decodedText: string) => {
          setSkuSearch(decodedText);
          setScanning(false);
          html5QrcodeScanner.clear();
        },
        (error: any) => {
          // Ignore periodic scanning errors
        }
      );
    });

    return () => {
      if (html5QrcodeScanner) {
        html5QrcodeScanner.clear().catch(console.error);
      }
    };
  }, [scanning]);

  const handleCheckout = async () => {
    if (cart.length === 0 || !customerName) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          items: cart.map(i => ({ id: i.id, price: i.sellPrice })),
          total: totalDeal,
        }),
      });
      if (res.ok) {
        // --- Generate PDF Invoice ---
        try {
          const { generateInvoicePDF } = await import("@/lib/pdf");
          generateInvoicePDF({
            transactionId: `TRX-${Math.floor(Date.now() / 1000)}`,
            customerName,
            customerPhone,
            items: cart,
            total: totalDeal,
            date: new Date().toLocaleString("id-ID"),
          }, paperSize);
        } catch(e) { console.error("PDF Generate Error", e) }
        // ----------------------------

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setCart([]);
          setCustomerName("");
          setCustomerPhone("");
        }, 3000);
      } else {
        alert("Gagal memproses transaksi.");
      }
    } catch {
      alert("Kesalahan sistem.");
    }
  };

  const PaperSizeSelector = () => (
    <div className="flex gap-2 mb-3">
      <button 
        onClick={() => setPaperSize("a4")}
        className={cn("flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors", paperSize === "a4" ? "bg-primary text-on-primary" : "bg-surface-high text-outline")}
      >
        A4 (A4)
      </button>
      <button 
        onClick={() => setPaperSize("letter")}
        className={cn("flex-1 h-8 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors", paperSize === "letter" ? "bg-primary text-on-primary" : "bg-surface-high text-outline")}
      >
        STRUK (Letter)
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] lg:h-[calc(100vh-72px)] lg:-mx-5 lg:-mt-5 overflow-hidden rounded-2xl lg:rounded-none bg-surface-lowest">

      {/* ════ LEFT: Search + Customer ════ */}
      <section className="flex-1 overflow-y-auto hide-scrollbar flex flex-col border-r border-outline-variant/10">
        <div className="px-5 pt-4 pb-3 border-b border-outline-variant/15">
          <p className="text-[9px] font-black uppercase tracking-widest text-primary">Point of Sale</p>
          <h2 className="text-xl font-black tracking-tight text-gradient-primary uppercase">Kasir</h2>
        </div>

        <div className="flex-1 p-4 space-y-3">
          {/* SKU Search with Barcode button */}
          <div className="relative" ref={searchRef}>
            <div className={cn(
              "flex items-center gap-2 bg-surface-low rounded-xl px-3 h-11 border transition-colors",
              showResults ? "border-primary/50" : "border-outline-variant/30 focus-within:border-primary/50"
            )}>
              <span className="material-symbols-outlined text-primary text-[19px] flex-shrink-0">barcode_scanner</span>
              <input
                ref={inputRef}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold placeholder:text-outline/40 placeholder:font-normal"
                placeholder="Ketik ID Barang (IDB-XXXX)..."
                value={skuSearch}
                onChange={e => setSkuSearch(e.target.value)}
                autoFocus
              />
              {skuSearch ? (
                <button onClick={() => setSkuSearch("")} className="text-outline hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              ) : (
                <button
                  onClick={scanBarcode}
                  disabled={scanning}
                  className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary/70 hover:text-primary transition-colors px-1.5 py-1 rounded-lg hover:bg-primary/10"
                  title="Scan Barcode"
                >
                  <span className="material-symbols-outlined text-[17px]">{scanning ? "hourglass_top" : "photo_camera"}</span>
                  <span className="hidden sm:block">Scan</span>
                </button>
              )}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {showResults && skuResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.12 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-surface-low border border-outline-variant/30 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="px-4 py-1.5 border-b border-outline-variant/20 text-[8px] font-black text-primary uppercase tracking-widest">
                    {skuResults.length} unit ditemukan
                  </div>
                  {skuResults.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => addToCart(item)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 cursor-pointer border-b border-outline-variant/10 last:border-0 transition-colors group"
                    >
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-surface-high flex-shrink-0">
                        <img
                          src={item.imageUrl || FALLBACK}
                          onError={(e: any) => { e.target.src = FALLBACK; }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold truncate group-hover:text-primary transition-colors">{item.model}</p>
                        <p className="text-[9px] font-mono text-outline">{item.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-primary">{formatRupiah(item.sellPrice)}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
              {showResults && skuSearch.length > 1 && skuResults.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-surface-low border border-outline-variant/30 rounded-xl p-4 text-center z-50"
                >
                  <p className="text-[10px] text-outline font-bold">Tidak ada unit Ready dengan ID "{skuSearch}"</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Customer Form */}
          <div className="bg-surface-low border border-outline-variant/20 rounded-xl p-4 space-y-3">
            <p className="text-[9px] font-black uppercase tracking-widest text-outline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-primary">person</span>
              Data Pelanggan
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[8px] uppercase tracking-widest text-outline/70 font-black block mb-1">Nama *</label>
                <input
                  className="w-full bg-surface border border-outline-variant/20 rounded-lg px-3 h-9 text-sm font-medium placeholder:text-outline/30 focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="Nama customer..."
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[8px] uppercase tracking-widest text-outline/70 font-black block mb-1">No. HP / WA</label>
                <input
                  className="w-full bg-surface border border-outline-variant/20 rounded-lg px-3 h-9 text-sm font-medium placeholder:text-outline/30 focus:outline-none focus:border-primary/40 transition-colors"
                  placeholder="0812xxxx"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mobile cart items */}
          <div className="lg:hidden space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-surface-low border border-outline-variant/20 rounded-xl p-3">
                <img src={item.imageUrl || FALLBACK} onError={(e: any) => { e.target.src = FALLBACK; }} className="w-12 h-9 rounded-lg object-cover flex-shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{item.model}</p>
                  <p className="text-[10px] text-primary font-bold">{formatRupiah(item.sellPrice)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-error/70 hover:text-error transition-colors">
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            ))}
            {cart.length > 0 && (
              <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20 rounded-xl mb-4">
                <span className="text-[10px] font-black uppercase">Total</span>
                <span className="text-lg font-black text-primary">{formatRupiah(totalDeal)}</span>
              </div>
            )}

            {/* Mobile Checkout Component */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 rounded-xl p-3"
                >
                  <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                  <p className="text-sm font-black text-primary">Transaksi Berhasil!</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!isSuccess && (
              <div className="space-y-3">
                <div className="bg-surface-high/30 p-3 rounded-xl border border-outline-variant/10">
                  <p className="text-[9px] font-black uppercase text-outline mb-2">Ukuran Cetak & PDF</p>
                  <PaperSizeSelector />
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || !customerName}
                  className={cn(
                    "w-full h-14 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2",
                    cart.length > 0 && customerName
                      ? "technical-gradient shadow-[0_6px_20px_rgba(42,161,152,0.3)] hover:scale-[1.02] active:scale-95"
                      : "bg-surface-high text-outline cursor-not-allowed"
                  )}
                >
                  <span className="material-symbols-outlined text-[16px]">payment</span>
                  Selesaikan Transaksi
                </button>
                {!customerName && cart.length > 0 && (
                  <p className="text-[8px] text-center text-error/70 font-bold">* Isi nama customer terlebih dahulu</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════ RIGHT: Cart Sidebar (Desktop Only) ════ */}
      <aside className="hidden lg:flex w-full lg:w-[340px] flex-col bg-surface-lowest/60 backdrop-blur-xl flex-shrink-0">
        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b border-outline-variant/15">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline flex items-center gap-2">
            <span className="material-symbols-outlined text-[15px] text-primary">receipt_long</span>
            Keranjang
            {cart.length > 0 && (
              <span className="bg-primary text-on-primary text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </h4>
          {cart.length > 0 && (
            <button onClick={() => setCart([])} className="text-[9px] text-error font-black uppercase hover:underline">Hapus Semua</button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {cart.map(item => (
              <motion.div
                layout key={item.id}
                initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                className="flex items-center gap-3 bg-surface-low border border-outline-variant/20 rounded-xl p-3 group"
              >
                <div className="w-12 h-9 rounded-lg overflow-hidden bg-surface-high flex-shrink-0">
                  <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={item.imageUrl || FALLBACK} onError={(e: any) => { e.target.src = FALLBACK; }} alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold truncate group-hover:text-primary transition-colors">{item.model}</p>
                  <p className="text-[9px] font-mono text-outline">{item.sku}</p>
                  <p className="text-[11px] font-black text-primary mt-0.5">{formatRupiah(item.sellPrice)}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 rounded-lg text-outline/50 hover:text-error hover:bg-error/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-36 text-center">
              <span className="material-symbols-outlined text-3xl text-outline/20 mb-2">inventory_2</span>
              <p className="text-[9px] font-black uppercase tracking-widest text-outline/50">Scan atau ketik ID barang</p>
            </div>
          )}
        </div>

        {/* Checkout footer */}
        <div className="p-4 border-t border-outline-variant/15 space-y-3">
          <div className="bg-surface-low rounded-xl p-3">
            <div className="flex justify-between text-[9px] text-outline font-medium mb-1">
              <span>{cart.length} unit</span>
              <span>{cart.length > 0 ? "✓ Siap" : "—"}</span>
            </div>
            <div className="flex justify-between items-end">
              <p className="text-[8px] font-black uppercase tracking-widest text-outline">Total Deal</p>
              <p className="text-2xl font-black tracking-tight">{formatRupiah(totalDeal)}</p>
            </div>
          </div>

          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center gap-2 bg-primary/10 border border-primary/30 rounded-xl p-4 text-center mt-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg mb-1 animate-bounce">
                  <span className="material-symbols-outlined text-2xl">check</span>
                </div>
                <p className="text-sm font-black text-primary">Transaksi Berhasil!</p>
                <p className="text-[10px] uppercase font-bold text-primary/70">PDF Nota sedang diunduh</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess && (
            <div className="mt-4">
              <PaperSizeSelector />
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || !customerName}
                className={cn(
                  "w-full h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2",
                  cart.length > 0 && customerName
                    ? "technical-gradient shadow-[0_6px_20px_rgba(42,161,152,0.3)] hover:scale-[1.02] active:scale-95"
                    : "bg-surface-high text-outline cursor-not-allowed"
                )}
              >
                <span className="material-symbols-outlined text-[16px]">payment</span>
                Selesaikan Transaksi
              </button>
            </div>
          )}
          {!customerName && cart.length > 0 && (
            <p className="text-[8px] text-center text-error/70 font-bold">* Isi nama customer terlebih dahulu</p>
          )}
        </div>
      </aside>

      {/* Barcode Scanner Modal */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-surface-low rounded-2xl w-full max-w-md overflow-hidden relative">
              <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center">
                <h3 className="font-black uppercase tracking-widest text-sm text-primary">Scan ID Barcode</h3>
                <button onClick={() => setScanning(false)} className="text-outline hover:text-error transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-4 min-h-[300px]">
                {/* DOM element for HTML5-QRCode to mount to */}
                <div id="barcode-reader" className="w-full overflow-hidden rounded-xl border-2 border-primary/20"></div>
                <p className="text-[10px] text-outline text-center mt-4">Arahkan kamera ke barcode ID Barang (mis. IDB-0001)</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
