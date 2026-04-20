"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatRupiah } from "@/lib/utils";
import Barcode from "react-barcode";

export default function AddUnitPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    model: "",
    manufacturer: "Apple",
    sku: "",
    specs: "",
    buyPrice: 0,
    extraCost: 0,
    sellPrice: 0,
    imageUrl: "",
    status: "Ready",
    processor: "",
    ram: "",
    storage: "",
  });

  const [isCapturing, setIsCapturing] = useState(false);

  // Auto-generate IDB handle
  useEffect(() => {
    fetch("/api/inventory")
      .then(res => res.json())
      .then(data => {
        const count = data.length || 0;
        const nextId = `IDB-${(count + 1).toString().padStart(4, '0')}`;
        setFormData(prev => ({ ...prev, sku: nextId }));
      });
  }, []);

  const takePhoto = async (isCamera: boolean) => {
    setIsCapturing(true);
    try {
      // Try Capacitor Camera API first (works on native Android/iOS)
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: isCamera ? CameraSource.Camera : CameraSource.Photos,
        width: 1200,
        height: 900,
      });
      if (image.dataUrl) {
        setFormData(prev => ({ ...prev, imageUrl: image.dataUrl! }));
      }
    } catch (err: any) {
      // Fallback to HTML file input (works in browser)
      console.log("Capacitor Camera unavailable, using fallback:", err.message);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      if (isCamera) {
        input.capture = "environment";
      }
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Unit berhasil didaftarkan!");
        router.push("/inventory");
      } else {
        alert("Gagal mendaftarkan unit.");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    }
  };

  const [displayValues, setDisplayValues] = useState({
    buyPrice: "",
    extraCost: "",
    sellPrice: "",
  });

  // Format number with thousand dots: 1000000 -> "1.000.000"
  const formatNumber = (val: string) => {
    const raw = val.replace(/\D/g, ""); // digits only
    if (!raw) return "";
    return parseInt(raw, 10).toLocaleString("id-ID");
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const numericFields = ["buyPrice", "extraCost", "sellPrice"];
    if (numericFields.includes(name)) {
      const raw = value.replace(/\D/g, "");
      const numVal = raw ? parseInt(raw, 10) : 0;
      setFormData((prev) => ({ ...prev, [name]: numVal }));
      setDisplayValues((prev) => ({ ...prev, [name]: raw ? parseInt(raw, 10).toLocaleString("id-ID") : "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalModal = formData.buyPrice + formData.extraCost;

  return (
    <div className="animate-fade-in pb-20">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-0.5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Warehouse Assets</p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gradient-primary uppercase leading-none">
          Add Unit
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-6 md:space-y-10">
          {/* Identitas Card */}
          <div className="premium-card p-5 md:p-10 space-y-8 md:space-y-12">
             <div className="space-y-6 md:space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">barcode_scanner</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Identity & Labeling</h3>
                    <p className="text-[10px] md:text-[11px] text-outline font-medium tracking-wide uppercase">Internal tracking & ID registration</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Internal Asset ID</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Input 
                        name="sku" 
                        placeholder="IDB-0001" 
                        value={formData.sku}
                        onChange={handleChange}
                        className="bg-surface-low border-outline-variant/30 h-14 rounded-xl focus:ring-primary/20 font-mono font-bold text-primary flex-1"
                      />
                      <div className="w-full sm:w-24 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 px-2">
                        <Barcode 
                          value={formData.sku || "IDB-XXXX"} 
                          width={1} 
                          height={28} 
                          displayValue={false} 
                          background="transparent" 
                          lineColor="#000" 
                          margin={0} 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Manufacturer</label>
                    <div className="relative group">
                      <select 
                        name="manufacturer"
                        className="w-full bg-surface-low border border-outline-variant/30 rounded-xl h-14 px-5 text-foreground appearance-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                        value={formData.manufacturer}
                        onChange={handleChange}
                      >
                        <option>Apple</option>
                        <option>Lenovo</option>
                        <option>Dell</option>
                        <option>HP</option>
                        <option>Asus</option>
                        <option>Acer</option>
                        <option>MSI</option>
                        <option>Razer</option>
                        <option>Microsoft</option>
                        <option>Samsung</option>
                        <option>Sony</option>
                        <option>Other</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-4 pointer-events-none text-outline group-focus-within:text-primary">
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Model Name</label>
                    <Input 
                      name="model"
                      className="bg-surface-low border-outline-variant/30 h-14 rounded-xl focus:ring-primary/20 font-bold" 
                      placeholder="e.g. MacBook Pro M3 14-inch Space Black" 
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>
                </div>
             </div>

             {/* Tech Specs */}
             <div className="space-y-6 md:space-y-10 pt-8 md:pt-10 border-t border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary border border-tertiary/20 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">memory</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">Technical Data</h3>
                    <p className="text-[10px] md:text-[11px] text-outline font-medium tracking-wide uppercase">Processor, Memory & Storage details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-outline font-black px-1">CPU / Processor</label>
                      <Input name="processor" value={formData.processor} onChange={handleChange} placeholder="M3 Max / i7-13th" className="bg-surface-low h-12 rounded-xl" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-outline font-black px-1">RAM</label>
                      <Input name="ram" value={formData.ram} onChange={handleChange} placeholder="16GB / 32GB" className="bg-surface-low h-12 rounded-xl" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-outline font-black px-1">Storage</label>
                      <Input name="storage" value={formData.storage} onChange={handleChange} placeholder="512GB / 1TB SSD" className="bg-surface-low h-12 rounded-xl" />
                   </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Additional Notes & Condition</label>
                    <textarea
                      name="specs"
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-xl p-4 md:p-6 text-foreground placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all resize-none min-h-[120px] font-medium"
                      placeholder="Battery health, physical condition, warranty status..."
                      value={formData.specs}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  
                  {/* Financial Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 bg-surface-lowest/50 p-4 md:p-6 rounded-2xl border border-white/5">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Harga Beli</label>
                      <div className="relative">
                        <Input 
                          name="buyPrice"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={displayValues.buyPrice}
                          onChange={handleChange}
                          className="pl-14 bg-surface-low border-outline-variant/20 h-12 rounded-xl focus:ring-primary/20 font-bold"
                        />
                        <span className="absolute left-5 top-3.5 font-black text-outline text-[10px]">Rp</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.15em] text-outline font-black px-1">Biaya Tambahan</label>
                      <div className="relative">
                        <Input 
                          name="extraCost"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={displayValues.extraCost}
                          onChange={handleChange}
                          className="pl-14 bg-surface-low border-outline-variant/20 h-12 rounded-xl focus:ring-primary/20 font-bold"
                        />
                        <span className="absolute left-5 top-3.5 font-black text-outline text-[10px]">Rp</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-[0.15em] text-primary font-black px-1">Harga Jual</label>
                      <div className="relative">
                        <Input 
                          name="sellPrice"
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={displayValues.sellPrice}
                          onChange={handleChange}
                          className="pl-14 bg-surface-low border-primary/30 h-12 rounded-xl focus:ring-primary font-black text-primary"
                        />
                        <span className="absolute left-5 top-3.5 font-black text-primary/60 text-[10px]">Rp</span>
                      </div>
                    </div>
                    
                    <div className="md:col-span-3 flex justify-between items-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <div className="flex gap-4">
                            <div>
                                <p className="text-[9px] uppercase font-black text-outline">Total Modal</p>
                                <p className="text-xs font-bold text-foreground">{formatRupiah(totalModal)}</p>
                            </div>
                            <div className="border-l border-outline-variant/30 pl-4">
                                <p className="text-[9px] uppercase font-black text-outline">Est. Profit</p>
                                <p className={cn("text-xs font-black", (formData.sellPrice - totalModal) > 0 ? "text-primary" : "text-error")}>
                                    {formatRupiah(formData.sellPrice - totalModal)}
                                </p>
                            </div>
                        </div>
                        <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest italic">Visual Preview Updated Below</div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

          <div className="hidden md:flex items-center justify-end gap-4 glass-panel p-6 rounded-2xl border-white/5">
                <Button variant="ghost" className="px-8 h-12 uppercase text-[10px] font-black tracking-widest text-outline hover:text-foreground" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button className="technical-gradient px-12 h-14 rounded-xl uppercase text-[11px] font-black tracking-[0.2em]" onClick={handleSubmit}>
                  Finalize Unit Registration
                </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Visual Media Selection */}
          <div className="premium-card overflow-hidden">
             <div className="aspect-[4/3] relative bg-surface-high group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={formData.imageUrl || "https://images.unsplash.com/photo-1517336715461-d6a7d971510e?auto=format&fit=crop&q=80&w=800"}
                  alt="Unit Preview"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute top-4 right-4 h-6 px-3 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[9px] font-black text-primary uppercase">{formData.status}</span>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                   <div>
                      <h4 className="text-white font-bold text-sm truncate">{formData.model || "Untitled Model"}</h4>
                      <p className="text-white/60 text-[10px] uppercase font-black tracking-widest">{formData.sku}</p>
                   </div>
                   <div className="text-primary text-xl font-black">
                      {formatRupiah(formData.sellPrice)}
                   </div>
                </div>
             </div>

             <div className="p-5 md:p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <Button 
                    onClick={() => takePhoto(true)}
                    type="button"
                    className="flex flex-col h-20 bg-surface-low border border-outline-variant/30 rounded-2xl gap-1 hover:border-primary/50 transition-all group"
                   >
                      <span className="material-symbols-outlined text-primary transition-transform group-hover:scale-110">photo_camera</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-outline">Camera</span>
                   </Button>
                   <Button 
                    onClick={() => takePhoto(false)}
                    type="button"
                    className="flex flex-col h-20 bg-surface-low border border-outline-variant/30 rounded-2xl gap-1 hover:border-primary/50 transition-all group"
                   >
                      <span className="material-symbols-outlined text-secondary transition-transform group-hover:scale-110">image</span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-outline">Gallery</span>
                   </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-outline font-black">Direct Media Link</label>
                  <Input 
                    name="imageUrl" 
                    placeholder="https://images.unsplash.com/..." 
                    value={formData.imageUrl.startsWith('data:') ? 'Image Captured (Base64)' : formData.imageUrl}
                    readOnly={formData.imageUrl.startsWith('data:')}
                    onChange={handleChange}
                    className="bg-surface-low border-outline-variant/30 h-12 rounded-xl text-[10px] focus:ring-primary/20"
                  />
                  {formData.imageUrl.startsWith('data:') && (
                    <button type="button" onClick={() => setFormData({...formData, imageUrl: ""})} className="text-[9px] text-error font-bold uppercase tracking-widest hover:underline mt-1">Clear Captured Image</button>
                  )}
                </div>
             </div>
          </div>

          {/* Status Selection */}
          <div className="premium-card p-5 md:p-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-outline mb-6">Internal Status</h3>
            <div className="space-y-3">
              <StatusCard 
                label="SIAP (Ready)" 
                desc="Item is verified and ready for sale"
                value="Ready" 
                color="bg-primary" 
                checked={formData.status === "Ready"} 
                onChange={() => setFormData({...formData, status: "Ready"})} 
              />
              <StatusCard 
                label="QC (Checking)" 
                desc="Currently in technical verification"
                value="QC" 
                color="bg-tertiary" 
                checked={formData.status === "QC"} 
                onChange={() => setFormData({...formData, status: "QC"})} 
              />
              <StatusCard 
                label="TERJUAL" 
                desc="Unit has been successfully settled"
                value="Sold" 
                color="bg-outline" 
                checked={formData.status === "Sold"} 
                onChange={() => setFormData({...formData, status: "Sold"})} 
              />
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="md:hidden space-y-4 pb-12">
            <Button className="technical-gradient w-full h-16 rounded-2xl uppercase text-[11px] font-black tracking-[0.2em]" onClick={handleSubmit}>
              Register Unit
            </Button>
            <Button variant="ghost" className="w-full h-14 uppercase text-[10px] font-black tracking-widest text-outline" onClick={() => router.back()}>
              Cancel Process
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, desc, color, checked, onChange }: any) {
  return (
    <div 
      onClick={onChange}
      className={cn(
        "group cursor-pointer p-4 rounded-xl border transition-all duration-300 flex items-center gap-4",
        checked 
          ? "bg-primary/5 border-primary/30" 
          : "bg-surface-low border-outline-variant/20 hover:border-outline/50"
      )}
    >
      <div className={cn(
        "w-2 h-2 rounded-full",
        color,
        checked && "shadow-[0_0_8px_currentColor]"
      )} />
      <div className="flex-grow">
        <p className={cn("text-xs font-bold uppercase tracking-wider", checked ? "text-primary" : "text-foreground")}>{label}</p>
        <p className="text-[9px] text-outline font-medium mt-0.5">{desc}</p>
      </div>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
        checked ? "border-primary bg-primary" : "border-outline-variant group-hover:border-outline"
      )}>
        {checked && <span className="material-symbols-outlined text-[14px] text-on-primary font-black">check</span>}
      </div>
    </div>
  );
}
