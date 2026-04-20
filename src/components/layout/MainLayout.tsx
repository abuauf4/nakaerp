"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, useCallback } from "react";

const navItems = [
  { name: "Dashboard", href: "/", icon: "dashboard" },
  { name: "Inventory", href: "/inventory", icon: "inventory_2" },
  { name: "Kasir", href: "/kasir", icon: "point_of_sale" },
  { name: "Report", href: "/report", icon: "analytics" },
  { name: "Settings", href: "/settings", icon: "settings" },
];

// ── Profile dropdown ─────────────────────────────────────────────────────────
function ProfileMenu({ collapsed }: { collapsed?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("naka_auth");
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-outline-variant/30 hover:border-primary/60 transition-all flex-shrink-0"
      >
        <img
          src="https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=002b36&textColor=2aa198"
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={`absolute w-52 bg-surface-low border border-outline-variant/30 rounded-2xl shadow-2xl overflow-hidden z-[300] ${
              collapsed !== undefined ? 'bottom-full left-0 mb-2' : 'top-full right-0 mt-2'
            }`}
          >
            <div className="px-4 py-3 border-b border-outline-variant/20 bg-surface/60">
              <p className="text-[11px] font-black">Admin Kurator</p>
              <p className="text-[9px] text-outline">admin@etl-managed.tech</p>
            </div>
            {mounted && (
              <button
                onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); setOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-outline">
                  {theme === "dark" ? "light_mode" : "dark_mode"}
                </span>
                {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              </button>
            )}
            <div className="h-px bg-outline-variant/20 mx-3" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-error hover:bg-error/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Keluar
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Swipe detection hook ─────────────────────────────────────────────────────
function useSwipeNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.8) return;
      const currentIdx = navItems.findIndex(n => n.href === pathname);
      if (currentIdx === -1) return;
      if (dx < 0 && currentIdx < navItems.length - 1) router.push(navItems[currentIdx + 1].href);
      if (dx > 0 && currentIdx > 0) router.push(navItems[currentIdx - 1].href);
      touchStart.current = null;
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pathname, router]);
}

// ── Main Layout ──────────────────────────────────────────────────────────────
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authPerms, setAuthPerms] = useState<string[]>([]);

  useEffect(() => { setMounted(true); }, []);

  // ── Auth guard & RBAC Logic ─────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const authRaw = localStorage.getItem("naka_auth");
    if (!authRaw) {
      setIsAuthenticated(false);
      // Only redirect to login if not on the public landing page (/)
      if (pathname !== "/" && pathname !== "/login") {
        router.replace("/login");
      }
    } else {
      setIsAuthenticated(true);
      try {
        const loaded = JSON.parse(authRaw);
        setAuthPerms(loaded.permissions || ["/"]);
      } catch {
        // Corrupted auth data
        localStorage.removeItem("naka_auth");
        setIsAuthenticated(false);
        if (pathname !== "/" && pathname !== "/login") {
          router.replace("/login");
        }
      }
    }
  }, [pathname, router, mounted]);

  useEffect(() => {
    if (mounted && pathname !== "/login" && authPerms.length > 0) {
      const hasPermission = authPerms.includes("*") || authPerms.some(p => 
        pathname === p || pathname.startsWith(p + "/")
      );
      
      if (!hasPermission) {
        router.replace(authPerms[0] || "/");
      }
    }
  }, [pathname, authPerms, mounted, router]);

  // Track direction for swiping transition
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const getSlideDir = () => {
    const pIdx = navItems.findIndex(i => i.href === prevPathRef.current);
    const cIdx = navItems.findIndex(i => i.href === pathname);
    if (cIdx === pIdx) return 1;
    return cIdx > pIdx ? 1 : -1;
  };

  const slideDir = getSlideDir();

  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shouldShowNav = isAuthenticated || pathname === "/login";

  useSwipeNavigation();

  const allowedNavItems = navItems.filter(item => authPerms.includes("*") || authPerms.includes(item.href));



  if (pathname === "/login") return <>{children}</>;
  if (!mounted) return <div className="min-h-screen bg-background" />; // Prevent hydration flash

  const currentPage = allowedNavItems.find(i => i.href === pathname) || navItems.find(i => i.href === pathname);

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20 selection:text-primary">

      {/* ════════ DESKTOP SIDEBAR ════════ */}
      {isAuthenticated && (
        <motion.aside
          animate={{ width: collapsed ? 64 : 220 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-50 border-r border-outline-variant/20 bg-surface-lowest/90 backdrop-blur-2xl overflow-hidden"
        >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-14 border-b border-outline-variant/20 flex-shrink-0 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              all_inclusive
            </span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="text-base font-black tracking-tight whitespace-nowrap overflow-hidden"
              >
                Naka <span className="text-outline font-medium">ERP</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-hidden">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl h-10 transition-colors duration-150 group overflow-hidden",
                  collapsed ? "justify-center px-0" : "px-3",
                  isActive ? "text-primary" : "text-outline hover:bg-surface-high/60 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarPill"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                  />
                )}
                <span
                  className="material-symbols-outlined text-[20px] z-10 flex-shrink-0"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{ duration: 0.15 }}
                      className="text-[12px] font-black uppercase tracking-wider z-10 whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-outline-variant/20 space-y-1 flex-shrink-0">
          <button
            onClick={() => setCollapsed(c => !c)}
            className={cn(
              "flex items-center gap-3 rounded-xl h-9 w-full text-outline hover:bg-surface-high/60 hover:text-foreground transition-colors",
              collapsed ? "justify-center" : "px-3"
            )}
          >
            <motion.span
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ duration: 0.25 }}
              className="material-symbols-outlined text-[18px]"
            >
              chevron_right
            </motion.span>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="text-[11px] font-bold"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className={cn("flex items-center gap-3 px-2 py-1.5 rounded-xl", collapsed && "justify-center")}>
            <ProfileMenu collapsed={collapsed} />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="min-w-0"
                >
                  <p className="text-[11px] font-black truncate">Admin</p>
                  <p className="text-[9px] text-outline truncate">Superadmin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
      )}

      {/* ════════ MAIN CONTENT ════════ */}
      <motion.div
        animate={{ marginLeft: isDesktop ? (isAuthenticated ? (collapsed ? 64 : 220) : 0) : 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-screen"
      >
        {/* Desktop topbar */}
        <header className="hidden md:flex items-center justify-between px-5 h-14 border-b border-outline-variant/20 bg-surface-lowest/60 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-2 text-[10px] text-outline font-medium">
            {isAuthenticated && currentPage && (
              <>
                <span className="material-symbols-outlined text-[14px]">{currentPage.icon}</span>
                <span className="font-black uppercase tracking-widest">{currentPage.name}</span>
              </>
            )}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>all_inclusive</span>
                </div>
                <span className="text-sm font-black text-foreground">Naka <span className="text-outline font-medium">ERP</span></span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-outline">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Live Mode
              </span>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-xl technical-gradient text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Masuk / Login
              </Link>
            )}
          </div>
        </header>

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-outline-variant/20 bg-surface-lowest/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>all_inclusive</span>
            </div>
            <span className="text-sm font-black text-foreground">Naka <span className="text-outline font-medium">ERP</span></span>
          </div>
          {isAuthenticated ? <ProfileMenu /> : (
            <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-primary">Login</Link>
          )}
        </header>

        {/* Page */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto pb-20 md:pb-4 relative">
          <AnimatePresence mode="popLayout" initial={false} custom={slideDir}>
            <motion.div
              key={pathname}
              custom={slideDir}
              initial={((dir: number) => ({ x: dir > 0 ? "100%" : "-100%" })) as any}
              animate={{ x: "0%" }}
              exit={((dir: number) => ({ x: dir > 0 ? "-100%" : "100%" })) as any}
              transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
              className="max-w-5xl mx-auto px-5 py-5 w-full"
              style={{ willChange: "transform" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>

      {/* ════════ MOBILE BOTTOM NAV ════════ */}
      {isAuthenticated && (
        <nav className="md:hidden fixed bottom-0 w-full z-50 border-t border-outline-variant/20 bg-surface-lowest/90 backdrop-blur-xl flex justify-around items-center h-16">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center py-2 px-3 min-w-[56px] transition-colors",
                  isActive ? "text-primary" : "text-outline"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileNav"
                    className="absolute inset-1 bg-primary/10 rounded-xl -z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span
                  className="material-symbols-outlined text-[22px] z-10"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className={cn("text-[8px] font-black uppercase tracking-wider mt-0.5 z-10", isActive ? "opacity-100" : "opacity-60")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
