import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Calendar,
  Video,
  FileText,
  Package,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Globe,
  PlusCircle,
  Activity,
  Users,
  Building,
  CreditCard,
  MapPin,
  Siren,
  QrCode,
  X
} from "lucide-react";
import { useAuthStore } from "../lib/auth";
import { changeLanguage } from "../lib/i18n";
import { AIAgentChatbot } from "./AIAgentChatbot";
import { QRScanner } from "./QRScanner";

export type UserRole = "Patient" | "ASHA" | "Doctor" | "Facility" | "Admin";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const getUserRole = (userRole?: string): UserRole => {
    if (userRole === "PATIENT") return "Patient";
    if (userRole === "DOCTOR") return "Doctor";
    if (userRole === "ASHA" || userRole === "CHO" || userRole === "ANM") return "ASHA";
    if (userRole === "SUPERADMIN") return "Admin";
    return "Patient";
  };

  const [role, setRole] = useState<UserRole>(() => getUserRole(user?.role));

  useEffect(() => {
    if (user?.role) {
      setRole(getUserRole(user.role));
    }
  }, [user?.role]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mr">("en");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const handleLanguageChange = (lang: "en" | "hi" | "mr") => {
    setLanguage(lang);
    changeLanguage(lang === "mr" ? "hi" : lang); // Fallback to Hindi if Marathi translation is pending
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === "Patient") navigate("/patient");
    else if (newRole === "ASHA") navigate("/asha");
    else if (newRole === "Doctor") navigate("/doctor");
    else navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getHomePath = () => {
    if (role === "Patient") return "/patient";
    if (role === "Doctor") return "/doctor";
    if (role === "ASHA") return "/asha";
    return "/dashboard";
  };

  // Grouped Navigation by Role
  const getNavItems = () => {
    switch (role) {
      case "Patient":
        return [
          {
            group: "MY HEALTH PORTAL",
            items: [
              { name: "My Health Dashboard", icon: LayoutDashboard, path: "/patient" },
              { name: "ABHA Health Card", icon: CreditCard, path: "/health-card" }
            ]
          },
          {
            group: "CARE & CONSULTATION",
            items: [
              { name: "Book Appointments", icon: Calendar, path: "/appointments" },
              { name: "Video Doctor", icon: Video, path: "/teleconsult" },
              { name: "Prescriptions & Meds", icon: Package, path: "/pharmacy" }
            ]
          },
          {
            group: "FIND HEALTHCARE",
            items: [
              { name: "Nearby Clinics & Beds", icon: MapPin, path: "/facilities" }
            ]
          }
        ];
      case "ASHA":
        return [
          {
            group: "FIELD OPERATIONS",
            items: [
              { name: "ASHA Field Station", icon: LayoutDashboard, path: "/asha" },
              { name: "Village Households", icon: Users, path: "/patients" },
              { name: "Maternal & NCD", icon: Activity, path: "/ncd-tracking" }
            ]
          },
          {
            group: "CLINICAL TRIAGE",
            items: [
              { name: "Emergency Dispatch", icon: Siren, path: "/emergency-dispatch" },
              { name: "Immunization", icon: PlusCircle, path: "/immunization" },
              { name: "Offline Sync", icon: Package, path: "/asha" }
            ]
          }
        ];
      case "Doctor":
        return [
          {
            group: "OPD CONSOLE",
            items: [
              { name: "Doctor OPD Console", icon: LayoutDashboard, path: "/doctor" },
              { name: "Video Teleconsult", icon: Video, path: "/teleconsult" },
              { name: "Patient Records", icon: FileText, path: "/patients" }
            ]
          },
          {
            group: "CLINICAL CARE",
            items: [
              { name: "Appointments", icon: Calendar, path: "/appointments" },
              { name: "Jan Aushadhi Rx", icon: PlusCircle, path: "/pharmacy" },
              { name: "Closed-Loop Referrals", icon: Building, path: "/referrals" }
            ]
          }
        ];
      default:
        return [
          {
            group: "ADMINISTRATION",
            items: [
              { name: "Enterprise Hub", icon: LayoutDashboard, path: "/dashboard" },
              { name: "Facility & Wards", icon: Building, path: "/admin" },
              { name: "Epidemic Analytics", icon: Activity, path: "/analytics" }
            ]
          },
          {
            group: "SERVICES",
            items: [
              { name: "Central Pharmacy", icon: Package, path: "/pharmacy" },
              { name: "Diagnostic Lab", icon: FileText, path: "/lab" },
              { name: "108 Emergency Fleet", icon: Siren, path: "/emergency-dispatch" }
            ]
          }
        ];
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F6F9FC] font-sans antialiased text-slate-800">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-30 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {!isCollapsed && (
            <Link to={getHomePath()} className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
                AM
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight block">
                  Arogya<span className="text-blue-600">Mitra</span>
                </span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider block">
                  {role === "Patient" ? "Citizen Health" : "Ayushman Care"}
                </span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link to={getHomePath()} className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md">
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

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {getNavItems().map((group, idx) => (
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
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-xs font-bold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className={`w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0 ${
              role === "Patient" ? "bg-teal-100 text-teal-800" : "bg-blue-100 text-blue-700"
            }`}>
              {user?.full_name ? user.full_name[0] : (role === "Patient" ? "P" : "D")}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.full_name || (role === "Patient" ? "Ramesh Yadav" : "Dr. Rajesh Kumar")}
                </p>
                <p className="text-[10px] font-semibold text-emerald-600 uppercase">
                  {role === "Patient" ? "Citizen ABHA" : `${role} Portal`}
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
          <div className="flex items-center space-x-3 flex-1 max-w-md">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={role === "Patient" ? "Search health records, doctors, prescriptions..." : "Search patient name, ABHA ID, or health facility..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Right Controls: Role Switcher, Scan QR, Language, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Role Switcher (Visible only for Staff/Admin, hidden for Patient) */}
            {role !== "Patient" && user?.role !== "PATIENT" && (
              <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
                {(["ASHA", "Doctor", "Admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      role === r ? "bg-white text-blue-700 shadow-xs" : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Camera QR Scan Trigger */}
            <button
              onClick={() => setShowScanner(true)}
              className="hidden lg:flex items-center space-x-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-blue-200 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span>Scan ABHA</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                aria-label="Select Interface Language"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
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
                    <h4 className="font-bold text-xs text-slate-900">Health Alerts & Broadcasts</h4>
                    <span className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                      Live Stream
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-900">
                      <p className="font-bold text-[11px]">Emergency Ambulance 108</p>
                      <p className="text-[10px] text-red-700 mt-0.5">Dispatched to Sinnar Sub-Center for Sita Devi (Hb 6.8 g/dL).</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                      <p className="font-bold text-[11px]">Teleconsultation Scheduled</p>
                      <p className="text-[10px] text-blue-700 mt-0.5">Gopal Singh with Dr. Priya Sharma at 10:30 AM.</p>
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

        {/* 3. MOBILE BOTTOM NAVIGATION */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-20"
        >
          {getNavItems()[0].items.map((item) => {
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
                <span className="text-[10px] mt-1 truncate max-w-[65px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 4. MOBILE SLIDEOUT DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex md:hidden">
          <div className="w-72 bg-white h-full flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-slate-900">Arogya Mitra Navigation</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            {role !== "Patient" && user?.role !== "PATIENT" && (
              <div className="flex items-center justify-around bg-slate-100 p-1 rounded-xl">
                {(["ASHA", "Doctor", "Admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => { handleRoleChange(r); setIsMobileOpen(false); }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      role === r ? "bg-white text-blue-700 shadow-xs" : "text-slate-500"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 overflow-y-auto space-y-4">
              {getNavItems().map((group, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">
                    {group.group}
                  </p>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
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

      {/* 5. GLOBAL FLOATING VOICE AI TRIAGE DOCTOR */}
      <AIAgentChatbot />

      {/* 6. CAMERA QR SCANNER MODAL */}
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
