import { useRouter } from "next/navigation";
import { cn, formatRupiah } from "@/lib/utils";

interface LaptopCardProps {
  name: string;
  sku: string;
  price: number;
  status: string;
  image?: string;
}

const BRAND_FALLBACKS: Record<string, string> = {
  apple: "https://images.unsplash.com/photo-1517336715461-d6a7d971510e?w=600&auto=format&fit=crop&q=80",
  asus: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80",
  lenovo: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80",
  default: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80",
};

function getImgFallback(name: string) {
  const lower = (name || "").toLowerCase();
  if (lower.includes("apple") || lower.includes("macbook")) return BRAND_FALLBACKS.apple;
  if (lower.includes("asus")) return BRAND_FALLBACKS.asus;
  if (lower.includes("lenovo") || lower.includes("thinkpad")) return BRAND_FALLBACKS.lenovo;
  return BRAND_FALLBACKS.default;
}

export function LaptopCard({ name, sku, price, status, image }: LaptopCardProps) {
  const router = useRouter();
  const isSold = status === "Sold" || status === "TERJUAL" || status === "ARSIP";
  const fallback = getImgFallback(name);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/inventory/edit/${sku}`);
  };

  return (
    <div className="premium-card group cursor-pointer" onClick={() => router.push(`/inventory/edit/${sku}`)}>
      {/* Media */}
      <div className="aspect-[16/9] relative overflow-hidden bg-surface-high">
        <img
          className={cn(
            "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
            isSold ? "grayscale opacity-40" : ""
          )}
          src={image || fallback}
          onError={(e: any) => { if (e.target.src !== fallback) e.target.src = fallback; }}
          alt={name}
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          {isSold ? (
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider backdrop-blur-md border bg-surface-high/80 text-outline border-outline-variant/30 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-outline mb-px" />
              Terjual
            </span>
          ) : status === "QC" ? (
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider backdrop-blur-md border bg-tertiary/20 text-tertiary border-tertiary/30 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-tertiary animate-pulse mb-px" />
              QC Check
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider backdrop-blur-md border bg-primary/20 text-primary border-primary/30 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-primary animate-pulse mb-px" />
              Ready
            </span>
          )}
        </div>
        {!isSold && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3">
            <span className="material-symbols-outlined text-white/80 text-[18px]">open_in_new</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[9px] font-mono text-outline uppercase tracking-wider mb-0.5">{sku || "SN-UNDEFINED"}</p>
          <h3 className={cn(
            "text-sm font-bold leading-snug truncate",
            isSold ? "text-outline" : "group-hover:text-primary transition-colors"
          )}>{name}</h3>
        </div>

        <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3">
          <div>
            <p className="text-[8px] text-outline uppercase font-black tracking-widest mb-0.5">Harga Jual</p>
            <p className={cn("text-base font-black", isSold ? "text-outline/60" : "text-primary")}>
              {formatRupiah(typeof price === "number" ? price : 0)}
            </p>
          </div>
          <div 
            onClick={handleEdit}
            className="h-7 w-7 rounded-lg bg-surface-high flex items-center justify-center text-outline group-hover:text-primary group-hover:bg-primary/10 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
          </div>
        </div>
      </div>
    </div>
  );
}
