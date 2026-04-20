"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email dan password wajib diisi."); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("naka_auth", JSON.stringify({ 
          email: data.user.email, 
          role: data.user.role, 
          name: data.user.name,
          permissions: data.user.permissions,
          ts: Date.now() 
        }));
        router.push("/");
      } else {
        setError(data.error || "Email atau password salah.");
      }
    } catch (err) {
      setError("Kesalahan koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/8 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm z-10"
      >
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4 shadow-[0_0_40px_rgba(42,161,152,0.15)]">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>all_inclusive</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">Naka <span className="text-outline font-medium">ERP</span></h1>
          <p className="text-[11px] text-outline mt-1 font-medium">Masuk untuk melanjutkan</p>
        </div>

        {/* Form */}
        <div className="premium-card p-6 space-y-4 bg-surface-low border-outline-variant/30">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-error/10 border border-error/30 rounded-xl p-3"
            >
              <span className="material-symbols-outlined text-error text-[16px]">error</span>
              <p className="text-[11px] font-bold text-error">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-outline">Email / Username</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline group-focus-within:text-primary transition-colors">person</span>
                <input
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin atau email@naka.erp"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-10 pr-4 h-11 text-sm font-medium placeholder:text-outline/30 focus:outline-none focus:border-primary/50 transition-colors"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-outline">Password</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline group-focus-within:text-primary transition-colors">lock</span>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface border border-outline-variant/30 rounded-xl pl-10 pr-12 h-11 text-sm font-medium placeholder:text-outline/30 focus:outline-none focus:border-primary/50 transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{showPass ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full h-11 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 mt-2",
                loading
                  ? "bg-surface-high text-outline cursor-not-allowed"
                  : "technical-gradient shadow-[0_6px_20px_rgba(42,161,152,0.3)] hover:scale-[1.02] active:scale-95"
              )}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="material-symbols-outlined text-[18px]"
                  >
                    progress_activity
                  </motion.span>
                  Memverifikasi...
                </>
              ) : (
                <>
                  Masuk
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-[9px] text-outline font-bold uppercase tracking-widest">Hanya personel berwenang</p>
          </div>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center">
          <p className="text-[9px] text-outline/50 font-mono">
            Demo: admin / admin
          </p>
        </div>
      </motion.div>
    </div>
  );
}
