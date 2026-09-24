import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  Activity,
  Siren,
  PlusCircle,
  Menu,
  Search,
  Globe,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  QrCode,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "../lib/auth";
import { changeLanguage } from "../lib/i18n";
import { QRScanner } from "./QRScanner";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mr">(() => {
    return (localStorage.getItem("arogya_lang") as "en" | "hi" | "mr") || "en";
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleLanguageChange = (lang: "en" | "hi" | "mr") => {
    setLanguage(lang);
    changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dedicated ASHA Frontline Navigation
  const navGroups = [
    {
      group: "FIELD OPERATIONS",
      items: [
        { name: "ASHA Field Station", icon: LayoutDashboard, path: "/asha" },
        { name: "Village Households", icon: Users, path: "/patients" },
        { name: "High-Risk Maternal & NCD", icon: Activity, path: "/ncd-tracking" },
      ],
    },
    {
      group: "CLINICAL & EMERGENCY",
      items: [
        { name: "108 Emergency Dispatch", icon: Siren, path: "/emergency-dispatch" },
        { name: "Child Immunization & UIP", icon: PlusCircle, path: "/immunization" },
      ],
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F9FC] font-sans antialiased text-slate-800">
      
      {/* 1. DESKTOP SIDEBAR — ONLY FOR ASHA */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!isCollapsed ? (
            <Link to="/asha" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
                AM
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight block">
                  Arogya<span className="text-blue-600">Mitra</span>
                </span>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  ASHA Portal · Ward 4
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/asha" className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
              AM
            </Link>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition hidden lg:block cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-2">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.name}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-2xs font-extrabold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* ASHA User Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0 bg-blue-100 text-blue-800">
              RB
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  Rekha Bai (ASHA)
                </p>
                <p className="text-[10px] font-semibold text-emerald-700 uppercase">
                  Ward 4 Sinnar
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between z-20">
          
          {/* Left: Mobile Menu & Search */}
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search village households, patient name, or ABHA..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Right: ASHA Badge, Scan QR, Language, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Frontline ASHA Badge (NO role switcher buttons) */}
            <div className="hidden lg:flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>ASHA Frontline: Ward 4</span>
            </div>

            {/* Scan ABHA Button */}
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Scan ABHA</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5" />
              <select
                aria-label="Select Language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-bold text-xs text-slate-900">ASHA Ward Alerts</h4>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-900">
                      <p className="font-bold text-[11px]">Emergency Ambulance 108</p>
                      <p className="text-[10px] text-red-700 mt-0.5">Dispatched to Sinnar Ward 4 for Sita Devi.</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                      <p className="font-bold text-[11px]">ANC Checkup Due</p>
                      <p className="text-[10px] text-blue-700 mt-0.5">Kavita Shinde BP follow-up scheduled today.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>

        {/* 3. MOBILE BOTTOM NAVIGATION — ONLY ASHA */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-20"
        >
          {navGroups[0].items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 ${
                  isActive ? "text-blue-600 font-bold" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-1 truncate max-w-[70px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 4. MOBILE SLIDEOUT DRAWER — ONLY ASHA */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex md:hidden">
          <div className="w-72 bg-white h-full flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-slate-900">Arogya Mitra · ASHA</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {navGroups.map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">
                    {group.group}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold transition ${
                          isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4 text-blue-600" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}

      {/* CAMERA QR SCANNER */}
      {showScanner && (
        <QRScanner
          onScan={(code) => {
            setShowScanner(false);
            alert(`Scanned ABHA QR ID: ${code}`);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default AppShell;
