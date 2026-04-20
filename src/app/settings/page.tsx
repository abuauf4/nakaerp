"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState(0);
  const [activeTab, setActiveTab] = useState("Agent Management");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", username: "", password: "", role: "Sales", permissions: ["/"] });

  const togglePermission = (path: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(path) 
        ? prev.permissions.filter(p => p !== path)
        : [...prev.permissions, path]
    }));
  };

  const fetchUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setActiveSessions(data.length);
      });
  };

  const fetchLogs = () => {
    fetch("/api/logs")
      .then(res => res.json())
      .then(data => setLogs(data));
  };

  useEffect(() => {
    fetchUsers();
    fetchLogs();
    const auth = localStorage.getItem("naka_auth");
    if (auth) setCurrentUser(JSON.parse(auth));
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", email: "", username: "", password: "", role: "Sales", permissions: ["/"] });
        fetchUsers();
    } else {
        const errorData = await res.json();
        alert(errorData.error || "Gagal menambahkan user.");
    }
    setIsSubmitting(false);
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Are you sure you want to permanently revoke this agent's access?")) return;
    const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
    if (res.ok) {
        fetchUsers();
    } else {
        alert("Gagal menghapus user.");
    }
    setOpenMenuId(null);
  };

  return (
    <div className="animate-fade-in pb-20 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-4">
        <div className="space-y-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Configuration</p>
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gradient-primary uppercase leading-tight">
            Settings
          </h2>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="technical-gradient px-8 h-14 gap-3 rounded-2xl shadow-xl hover:scale-105 transition-all group">
          <span className="material-symbols-outlined text-[20px] group-hover:rotate-45 transition-transform duration-500">add_moderator</span>
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">Authorize Agent</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: "Agent Management", icon: "admin_panel_settings", label: "Agent Management", level: ["Developer", "Owner", "Admin"] },
            { id: "Encryption & Keys", icon: "security", label: "Encryption & Keys", level: ["Developer"] },
            { id: "Log Monitoring", icon: "terminal", label: "Log Monitoring", level: ["Developer", "Owner"] },
            { id: "Vault Backup", icon: "database", label: "Vault Backup", level: ["Developer"] },
            { id: "Alert Protocols", icon: "notifications_active", label: "Alert Protocols", level: ["Developer", "Owner", "Admin"] },
          ].filter(item => !currentUser || item.level.includes(currentUser.role)).map(item => (
            <NavItem 
              key={item.id}
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </aside>

        {/* Setting Content Content Area */}
        <div className="lg:col-span-9 space-y-20">
          
          {activeTab === "Agent Management" && (
            <>
              {/* Section: Roles */}
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                    <div>
                      <h3 className="text-xl font-black tracking-tight uppercase">Privilege Architecture</h3>
                      <p className="text-[11px] text-outline font-medium tracking-wide">Hierarchical access control configuration</p>
                    </div>
                    <div className="glass-panel px-4 py-1.5 rounded-full border-white/5 flex items-center gap-2">
                      <span className="text-[9px] font-black text-outline uppercase tracking-widest">Active Schema:</span>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">Standard-V2</span>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RoleCard role="Developer" level="Level 0" desc="Unrestricted systemic control, root-level environment access, and organizational governance." accent="primary" icon="shield_person" />
                    <RoleCard role="Owner" level="Level 1" desc="Operational supervision including bulk asset acquisition and financial report generation." accent="secondary" icon="monitoring" />
                    <RoleCard role="Admin" level="Level 2" desc="Verification of asset serials, stock health analysis, and quality assurance logging." accent="tertiary" icon="fact_check" />
                    <RoleCard role="Sales" level="Level 3" desc="Standard read access for inventory availability and technical specifications viewing." accent="outline" icon="data_exploration" />
                </div>
              </section>

              {/* Section: Active User List */}
              <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                    <div>
                      <h3 className="text-xl font-black tracking-tight uppercase">Authorized Agents</h3>
                      <p className="text-[11px] text-outline font-medium tracking-wide">Live list of identities currently within the perimeter</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{activeSessions} LIVE SESSIONS</span>
                    </div>
                </div>

                <div className="premium-card overflow-hidden border-white/5">
                    <div className="overflow-x-auto overflow-y-hidden">
                      <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-surface-high/50 border-b border-outline-variant/20">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-outline">Delegated Role</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-outline">System Log</th>
                                <th className="px-8 py-5 text-right w-20"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-outline-variant/10">
                            {users.map((user, i) => (
                                <tr key={i} className="group hover:bg-primary/[0.02] transition-colors cursor-pointer">
                                  <td className="px-8 py-6">
                                      <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 rounded-2xl overflow-hidden bg-surface-high border border-white/10 group-hover:border-primary/40 transition-colors shadow-sm ring-4 ring-transparent group-hover:ring-primary/5">
                                            <img className="w-full h-full object-cover" src={user.image} alt="" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{user.name}</p>
                                            <p className="text-[11px] text-outline font-medium mt-0.5">{user.email}</p>
                                        </div>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest",
                                        user.roleAccent === 'primary' ? "bg-primary/10 border-primary/20 text-primary" : 
                                        user.roleAccent === 'tertiary' ? "bg-tertiary/10 border-tertiary/20 text-tertiary" :
                                        "bg-surface-high border-outline-variant/30 text-outline-variant"
                                      )}>
                                        <span className={cn("w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]")}></span>
                                        {user.role}
                                      </div>
                                  </td>
                                  <td className="px-8 py-6">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-foreground/80 font-black uppercase tracking-widest">Authorized</span>
                                        <span className="text-[9px] text-outline font-mono">ID: {user.lastActivity?.substring(0, 8) || "LOG-ERR-X0"}</span>
                                      </div>
                                  </td>
                                  <td className="px-8 py-6 text-right relative">
                                      <button onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)} className="relative z-10 h-9 w-9 rounded-xl flex items-center justify-center text-outline hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
                                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                                      </button>
                                      <AnimatePresence>
                                          {openMenuId === user.id && (
                                              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute right-8 top-14 w-40 bg-surface-low border border-outline-variant/30 rounded-xl shadow-2xl z-50 p-2 text-left">
                                                  <button onClick={() => handleDeleteUser(user.id)} className="w-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-error/80 hover:text-error hover:bg-error/10 p-2.5 rounded-lg transition-colors">
                                                      <span className="material-symbols-outlined text-[14px]">person_remove</span>
                                                      Revoke Identity
                                                  </button>
                                              </motion.div>
                                          )}
                                      </AnimatePresence>
                                  </td>
                                </tr>
                            ))}
                          </tbody>
                      </table>
                    </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "Encryption & Keys" && <EncryptionTab />}
          {activeTab === "Log Monitoring" && <LogsTab logs={logs} />}
          {activeTab === "Vault Backup" && <BackupTab />}
          {activeTab === "Alert Protocols" && <AlertsTab />}
        </div>
      </div>

      {/* Add Agent Modal */}
      <AnimatePresence>
        {isModalOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-surface border border-outline-variant/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    <div className="flex justify-between items-center px-6 py-4 border-b border-outline-variant/10 bg-surface flex-shrink-0">
                        <div>
                            <h3 className="text-base font-black uppercase tracking-widest text-primary">Authorize New Agent</h3>
                            <p className="text-[9px] text-outline font-medium tracking-wide">Secure systemic identity creation</p>
                        </div>
                        <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:bg-white/5 hover:text-error transition-colors">
                            <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleAddUser} className="flex flex-col min-h-0 overflow-hidden">
                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-1.5 ml-1">Agent Name</label>
                                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 h-11 text-sm font-bold placeholder:text-outline/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-1.5 ml-1">Secure Email</label>
                                    <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 h-11 text-sm font-bold placeholder:text-outline/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="agent@..." />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-1.5 ml-1">Initial Password</label>
                                    <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 h-11 text-sm font-bold placeholder:text-outline/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="••••••••" />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-1.5 ml-1">System Handle (Username)</label>
                                    <input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 h-11 text-sm font-bold placeholder:text-outline/40 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" placeholder="naka_agent" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-1.5 ml-1">Delegated Role</label>
                                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-surface-low border border-outline-variant/20 rounded-xl px-4 h-11 text-sm font-bold text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none appearance-none">
                                    <option value="Developer">Developer</option>
                                    <option value="Owner">Owner</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Sales">Sales</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-[9px] uppercase tracking-[0.2em] font-black text-outline block mb-2 ml-1">Access Matrix (Permissions)</label>
                                <div className="grid grid-cols-2 gap-2.5 p-3.5 bg-surface-low border border-outline-variant/20 rounded-xl">
                                    {[
                                      { id: "/", label: "Dashboard" },
                                      { id: "/inventory", label: "Inventory" },
                                      { id: "/kasir", label: "Kasir (POS)" },
                                      { id: "/report", label: "Reports" },
                                      { id: "/settings", label: "Settings" }
                                    ].map(route => (
                                        <label key={route.id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center flex-shrink-0">
                                                <input type="checkbox" checked={formData.permissions.includes(route.id)} onChange={() => togglePermission(route.id)} className="peer sr-only" />
                                                <div className="w-4.5 h-4.5 rounded border border-outline-variant/50 bg-background peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-[12px] text-background opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-outline group-hover:text-foreground transition-colors truncate">{route.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-outline-variant/10 bg-surface-low/30 flex gap-3 flex-shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-11 rounded-xl border border-outline-variant/30 text-[10px] font-black uppercase tracking-widest text-outline hover:text-foreground hover:bg-surface-high transition-colors">Cancel</button>
                            <button disabled={isSubmitting} type="submit" className="flex-1 h-11 rounded-xl technical-gradient text-[10px] font-black uppercase tracking-widest text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                {isSubmitting ? "Processing..." : "Deploy Identity"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all border duration-300 group relative",
        active
          ? "bg-primary text-on-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]"
          : "text-outline bg-transparent border-transparent hover:bg-surface-high/50 hover:text-foreground hover:translate-x-1"
      )}
    >
      <span className="material-symbols-outlined text-[18px] transition-transform group-hover:scale-110">{icon}</span>
      {label}
      {active && <motion.div layoutId="navActiveGlow" className="absolute inset-x-0 bottom-0 h-1 bg-white/30 rounded-full mx-6 mb-2" />}
    </button>
  );
}

function EncryptionTab() {
  const [keys, setKeys] = useState([
    { name: "Main API Key", key: "sk_live_v1_4a8s...9k2b", created: "2024-04-01" },
    { name: "Stripe Webhook", key: "whsec_2b9c...a7s1", created: "2024-04-10" }
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard label="Transport Layer" value="TLS 1.3 Active" icon="lock" accent="primary" />
        <StatusCard label="Database Encryption" value="AES-256 Enabled" icon="encrypted" accent="secondary" />
        <StatusCard label="Vault Protocol" value="FIPS 140-2" icon="token" accent="tertiary" />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-xl font-black uppercase tracking-tight">Access Gateways</h3>
          <Button className="h-10 px-6 technical-gradient text-[10px] rounded-xl">Rotate All Keys</Button>
        </div>
        <div className="premium-card p-6 space-y-4">
          {keys.map((k, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-surface-high/50 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
              <div className="space-y-1">
                <p className="text-xs font-black text-foreground">{k.name}</p>
                <p className="text-[10px] text-outline font-mono tracking-tighter">{k.key}</p>
              </div>
              <p className="text-[9px] font-bold text-outline uppercase">{k.created}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogsTab({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
        <div>
          <h3 className="text-xl font-black tracking-tight uppercase">Live System Perimeter</h3>
          <p className="text-[11px] text-outline font-medium tracking-wide">Authorized authentication stream</p>
        </div>
      </div>
      <div className="premium-card p-4 font-mono text-[11px] h-[500px] overflow-y-auto custom-scrollbar space-y-2.5 bg-background/50">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4 p-2 hover:bg-white/5 rounded-lg transition-colors border-l-2 border-transparent hover:border-primary">
            <span className="text-primary font-black">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className="text-outline">AUTH_EVT:</span>
            <span className="text-secondary font-bold font-black uppercase text-[10px] tracking-widest">{log.userName}</span>
            <span className="text-foreground/80">INFILTRATED FROM</span>
            <span className="text-tertiary font-bold">{log.ipAddress}</span>
            <span className="ml-auto text-primary opacity-60">HTTP_200</span>
          </div>
        ))}
        {logs.length === 0 && <div className="py-10 text-center text-outline">No logs scanned yet...</div>}
      </div>
    </div>
  );
}

function BackupTab() {
  const [backingUp, setBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);

  const startBackup = () => {
    setBackingUp(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setBackingUp(false);
          window.location.href = "/api/backup/download";
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 text-center py-10">
      <div className="relative inline-block">
        <div className="w-56 h-56 rounded-full border-4 border-outline-variant/20 flex items-center justify-center relative overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-t-4 border-primary rounded-full opacity-40"
          />
          <div className="z-10 text-center">
            <span className="material-symbols-outlined text-6xl text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">database</span>
            <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-2">{progress}% SYNCED</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <h3 className="text-2xl font-black uppercase tracking-tighter">Vault Encryption Sync</h3>
        <p className="text-xs text-outline leading-relaxed">Prepare a full systemic snapshot of all inventories, transactions, and authorized identities. This file is encrypted with AES-256 for secure cold storage.</p>
        <Button 
          onClick={startBackup} 
          disabled={backingUp}
          className="w-full h-16 technical-gradient rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20"
        >
          {backingUp ? "Compiling Vault Assets..." : "Initiate Full Backup Download"}
        </Button>
      </div>
    </div>
  );
}

function AlertsTab() {
  const [toggles, setToggles] = useState({
    login: true,
    sales: true,
    stock: false,
    security: true
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { id: 'login', label: 'Push Login Notifications', desc: 'Alert Developer on every unauthorized or root-level login attempt.' },
          { id: 'sales', label: 'Real-time Sales Feed', desc: 'Instant WhatsApp broadcast for transactions exceeding threshold.' },
          { id: 'stock', label: 'Critical Stock Level', desc: 'Summary of low-inventory assets delivered daily at 08:00.' },
          { id: 'security', label: 'System Health Alerts', desc: 'Technical monitoring for server latency and vault lock status.' }
        ].map(opt => (
          <div key={opt.id} className="premium-card p-6 flex justify-between items-start gap-6">
            <div className="space-y-1.5 text-left">
              <p className="text-sm font-black uppercase tracking-tight">{opt.label}</p>
              <p className="text-[10px] text-outline leading-relaxed font-medium">{opt.desc}</p>
            </div>
            <button 
              onClick={() => setToggles(p => ({ ...p, [opt.id]: !p[opt.id as keyof typeof toggles] }))}
              className={cn(
                "w-12 h-6 rounded-full p-1 transition-all duration-300 flex items-center",
                toggles[opt.id as keyof typeof toggles] ? "bg-primary" : "bg-surface-high border border-white/10"
              )}
            >
              <motion.div animate={{ x: toggles[opt.id as keyof typeof toggles] ? 24 : 0 }} className="w-4 h-4 rounded-full bg-white shadow-lg" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusCard({ label, value, icon, accent }: any) {
  return (
    <div className="premium-card p-6 flex items-center gap-5 group hover:border-primary/20 transition-all">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center border",
        accent === 'primary' ? "bg-primary/10 border-primary/20 text-primary" :
        accent === 'secondary' ? "bg-secondary/10 border-secondary/20 text-secondary" :
        "bg-tertiary/10 border-tertiary/20 text-tertiary"
      )}>
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div className="text-left">
        <p className="text-[9px] font-black text-outline uppercase tracking-widest">{label}</p>
        <p className="text-xs font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}

function RoleCard({ role, level, desc, icon, accent }: any) {
  return (
    <div className="premium-card p-8 group transition-all duration-500 hover:-translate-y-1">
       <div className="flex justify-between items-start mb-6">
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500",
            accent === 'primary' ? "bg-primary/10 border-primary/30 text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:shadow-[0_0_20px_var(--primary)]" :
            accent === 'secondary' ? "bg-secondary/10 border-secondary/30 text-secondary group-hover:bg-secondary group-hover:text-on-primary group-hover:shadow-[0_0_20px_var(--secondary)]" :
            accent === 'tertiary' ? "bg-tertiary/10 border-tertiary/30 text-tertiary group-hover:bg-tertiary group-hover:text-on-primary group-hover:shadow-[0_0_20px_var(--tertiary)]" :
            "bg-surface-high border-outline-variant/30 text-outline group-hover:bg-foreground group-hover:text-background"
          )}>
             <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-outline opacity-60 px-3 py-1 rounded-full border border-white/5">{level}</span>
       </div>
       <h4 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">{role}</h4>
       <p className="text-xs text-outline font-medium mt-3 leading-relaxed group-hover:text-outline-variant transition-colors">{desc}</p>
       
       <div className="mt-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-outline-variant group-hover:bg-primary/40 transition-colors"></div>
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
       </div>
    </div>
  );
}
