import React, { useState, useEffect } from "react";
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
  Stethoscope,
  Calendar,
  Pill,
  FlaskConical,
  FileText,
  BarChart3,
  Building2,
  Video,
  CreditCard,
  Settings,
  UserCircle,
  ChevronDown,
} from "lucide-react";
import { useAuthStore, type UserProfile } from "../lib/auth";
import { changeLanguage } from "../lib/i18n";
import { QRScanner } from "./QRScanner";

interface AppShellProps {
  children: React.ReactNode;
}

interface NavItem {
  name: string;
  icon: any;
  path: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

/** Role-based navigation configuration */
const getNavGroups = (role?: string, t?: any): NavGroup[] => {
  const tr = (k: string, d?: string) => (t ? t(k, d) : d || k);
  switch (role) {
    case 'ASHA':
    case 'CHO':
    case 'ANM':
      return [
        {
          group: tr("sidebar.field_operations", "FIELD OPERATIONS"),
          items: [
            { name: tr("sidebar.asha_field_station", "ASHA Field Station"), icon: LayoutDashboard, path: "/asha" },
            { name: tr("sidebar.village_households", "Village Households"), icon: Users, path: "/patients" },
            { name: tr("sidebar.high_risk_maternal_ncd", "High-Risk Maternal & NCD"), icon: Activity, path: "/ncd-tracking" },
          ],
        },
        {
          group: tr("sidebar.clinical_emergency", "CLINICAL & EMERGENCY"),
          items: [
            { name: tr("sidebar.emergency_dispatch", "108 Emergency Dispatch"), icon: Siren, path: "/emergency-dispatch" },
            { name: tr("sidebar.child_immunization", "Child Immunization & UIP"), icon: PlusCircle, path: "/immunization" },
          ],
        },
      ];

    case 'DOCTOR':
      return [
        {
          group: tr("sidebar.clinical", "CLINICAL"),
          items: [
            { name: tr("sidebar.dashboard", "Dashboard"), icon: LayoutDashboard, path: "/doctor" },
            { name: tr("sidebar.patients", "Patients"), icon: Users, path: "/patients" },
            { name: tr("sidebar.appointments", "Appointments"), icon: Calendar, path: "/appointments" },
            { name: tr("sidebar.teleconsultation", "Teleconsultation"), icon: Video, path: "/teleconsult" },
            { name: tr("sidebar.referrals", "Referrals"), icon: FileText, path: "/referrals" },
          ],
        },
        {
          group: tr("sidebar.emergency", "EMERGENCY"),
          items: [
            { name: tr("sidebar.emergency_dispatch", "108 Emergency Dispatch"), icon: Siren, path: "/emergency-dispatch" },
            { name: tr("sidebar.maternal_ncd", "Maternal & NCD Tracking"), icon: Activity, path: "/ncd-tracking" },
          ],
        },
      ];

    case 'SUPERADMIN':
      return [
        {
          group: tr("sidebar.administration", "ADMINISTRATION"),
          items: [
            { name: tr("sidebar.dashboard", "Dashboard"), icon: LayoutDashboard, path: "/dashboard" },
            { name: tr("sidebar.admin_panel", "Admin Panel"), icon: Settings, path: "/admin" },
            { name: tr("sidebar.analytics", "Analytics"), icon: BarChart3, path: "/analytics" },
            { name: tr("sidebar.facilities", "Facilities"), icon: Building2, path: "/facilities" },
          ],
        },
        {
          group: tr("sidebar.operations", "OPERATIONS"),
          items: [
            { name: tr("sidebar.patients", "Patients"), icon: Users, path: "/patients" },
            { name: tr("sidebar.appointments", "Appointments"), icon: Calendar, path: "/appointments" },
            { name: tr("sidebar.pharmacy", "Pharmacy"), icon: Pill, path: "/pharmacy" },
            { name: tr("sidebar.laboratory", "Laboratory"), icon: FlaskConical, path: "/lab" },
            { name: tr("sidebar.referrals", "Referrals"), icon: FileText, path: "/referrals" },
          ],
        },
        {
          group: tr("sidebar.clinical", "CLINICAL"),
          items: [
            { name: tr("sidebar.teleconsultation", "Teleconsultation"), icon: Video, path: "/teleconsult" },
            { name: tr("sidebar.emergency_dispatch", "Emergency Dispatch"), icon: Siren, path: "/emergency-dispatch" },
            { name: tr("sidebar.child_immunization", "Immunization"), icon: PlusCircle, path: "/immunization" },
            { name: tr("sidebar.maternal_ncd", "Maternal & NCD"), icon: Activity, path: "/ncd-tracking" },
          ],
        },
      ];

    case 'PATIENT':
      return [
        {
          group: tr("sidebar.my_health", "MY HEALTH"),
          items: [
            { name: tr("sidebar.my_dashboard", "My Dashboard"), icon: LayoutDashboard, path: "/patient" },
            { name: tr("sidebar.health_card", "Health Card"), icon: CreditCard, path: "/health-card" },
            { name: tr("sidebar.appointments", "Appointments"), icon: Calendar, path: "/appointments" },
            { name: tr("sidebar.teleconsult", "Teleconsult"), icon: Video, path: "/teleconsult" },
          ],
        },
      ];

    default:
      return [
        {
          group: tr("sidebar.navigation", "NAVIGATION"),
          items: [
            { name: tr("sidebar.dashboard", "Dashboard"), icon: LayoutDashboard, path: "/dashboard" },
            { name: tr("sidebar.patients", "Patients"), icon: Users, path: "/patients" },
          ],
        },
      ];
  }
};

/** Get role display info */
const getRoleInfo = (role?: string, t?: any) => {
  const tr = (k: string, d?: string) => (t ? t(k, d) : d || k);
  switch (role) {
    case 'ASHA': return { label: tr('shell.role_asha', 'ASHA Frontline'), color: 'blue', badge: 'Ward 4' };
    case 'CHO': return { label: tr('shell.role_cho', 'Community Health Officer'), color: 'teal', badge: 'PHC' };
    case 'ANM': return { label: tr('shell.role_anm', 'Auxiliary Nurse Midwife'), color: 'purple', badge: 'SC' };
    case 'DOCTOR': return { label: tr('shell.role_doctor', 'Doctor'), color: 'emerald', badge: 'OPD' };
    case 'SUPERADMIN': return { label: tr('shell.role_admin', 'Hospital Admin'), color: 'amber', badge: 'Admin' };
    case 'PATIENT': return { label: tr('shell.role_patient', 'Patient'), color: 'sky', badge: 'ABHA' };
    default: return { label: role || tr('shell.role_user', 'User'), color: 'slate', badge: '' };
  }
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, login } = useAuthStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [language, setLanguage] = useState<"en" | "hi" | "mr">(() => {
    return ((i18n.language || localStorage.getItem("arogya_lang")) as "en" | "hi" | "mr") || "en";
  });

  useEffect(() => {
    const onLangChanged = (lng: string) => {
      if (lng === "en" || lng === "hi" || lng === "mr") {
        setLanguage(lng);
      }
    };
    i18n.on("languageChanged", onLangChanged);
    return () => {
      i18n.off("languageChanged", onLangChanged);
    };
  }, [i18n]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const quickSwitchRoles = [
    { label: t('shell.asha_worker', 'ASHA Worker'), username: 'asha', password: 'asha123', icon: ShieldCheck, color: 'blue' },
    { label: t('shell.doctor', 'Doctor'), username: 'doctor', password: 'doctor123', icon: Stethoscope, color: 'emerald' },
    { label: t('shell.patient', 'Patient'), username: 'patient', password: 'patient123', icon: UserCircle, color: 'sky' },
    { label: t('shell.admin', 'Hospital Admin'), username: 'admin', password: 'admin123', icon: Settings, color: 'amber' },
  ];

  const handleLanguageChange = (lang: "en" | "hi" | "mr") => {
    setLanguage(lang);
    changeLanguage(lang);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRoleSwitch = async (username: string, password: string) => {
    setShowRoleSwitcher(false);
    try {
      const loggedUser = await login(username, password);
      // Navigate to the role's home page
      switch (loggedUser.role) {
        case 'PATIENT': navigate('/patient'); break;
        case 'DOCTOR': navigate('/doctor'); break;
        case 'ASHA':
        case 'CHO':
        case 'ANM': navigate('/asha'); break;
        case 'SUPERADMIN': navigate('/dashboard'); break;
        default: navigate('/dashboard'); break;
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    }
  };

  const navGroups = getNavGroups(user?.role, t);
  const roleInfo = getRoleInfo(user?.role, t);
  const userInitials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

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
          {!isCollapsed ? (
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md text-sm">
                AM
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight block">
                  Arogya<span className="text-blue-600">Mitra</span>
                </span>
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                  {roleInfo.label} {roleInfo.badge ? `· ${roleInfo.badge}` : ''}
                </span>
              </div>
            </Link>
          ) : (
            <Link to="/" className="w-9 h-9 mx-auto rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-black shadow-md text-sm">
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

        {/* User Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3 p-2 rounded-xl">
            <div className="w-8 h-8 rounded-full font-bold flex items-center justify-center text-xs flex-shrink-0 bg-blue-100 text-blue-800">
              {userInitials}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-[10px] font-semibold text-emerald-700 uppercase">
                  {roleInfo.label}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
              title={t('shell.sign_out', 'Sign Out')}
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
                placeholder={t('shell.search_placeholder', 'Search village households, patient name, or ABHA...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          {/* Right: Role Badge, Role Switcher, Scan QR, Language, Notifications */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Role Badge with Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="hidden lg:flex items-center gap-1.5 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-100 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{roleInfo.label}{roleInfo.badge ? `: ${roleInfo.badge}` : ''}</span>
                <ChevronDown className="w-3 h-3 text-blue-500" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5">
                    {t('shell.switch_role', 'Switch Demo Role')}
                  </p>
                  {quickSwitchRoles.map((r) => {
                    const RIcon = r.icon;
                    const isCurrentRole = user?.username === r.username || 
                      (user?.role === 'ASHA' && r.username === 'asha') ||
                      (user?.role === 'DOCTOR' && r.username === 'doctor') ||
                      (user?.role === 'PATIENT' && r.username === 'patient') ||
                      (user?.role === 'SUPERADMIN' && r.username === 'admin');
                    return (
                      <button
                        key={r.username}
                        onClick={() => handleRoleSwitch(r.username, r.password)}
                        disabled={isCurrentRole}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isCurrentRole
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <RIcon className={`w-4 h-4 ${isCurrentRole ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span>{r.label}</span>
                        {isCurrentRole && (
                          <span className="ml-auto text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">
                            {t('shell.active', 'Active')}
                          </span>
                        )}
                      </button>
                    );
                  })}
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('shell.sign_out', 'Sign Out')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Scan ABHA Button */}
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t('shell.scan_abha', 'Scan ABHA')}</span>
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
                    <h4 className="font-bold text-xs text-slate-900">{t('shell.alerts', 'Alerts')}</h4>
                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-full">
                      {t('shell.live', 'Live')}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-900">
                      <p className="font-bold text-[11px]">{t('shell.alert_emergency_title', 'Emergency Ambulance 108')}</p>
                      <p className="text-[10px] text-red-700 mt-0.5">{t('shell.alert_emergency_desc', 'Dispatched to Sinnar Ward 4 for Sita Devi.')}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-900">
                      <p className="font-bold text-[11px]">{t('shell.alert_anc_title', 'ANC Checkup Due')}</p>
                      <p className="text-[10px] text-blue-700 mt-0.5">{t('shell.alert_anc_desc', 'Kavita Shinde BP follow-up scheduled today.')}</p>
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
          {(navGroups[0]?.items || []).slice(0, 4).map((item) => {
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

      {/* 4. MOBILE SLIDEOUT DRAWER */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex md:hidden">
          <div className="w-72 bg-white h-full flex flex-col p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-black text-slate-900">Arogya Mitra · {roleInfo.label}</span>
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

            {/* Mobile Role Switcher */}
            <div className="border-t border-slate-100 pt-3 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-1">
                {t('shell.switch_role', 'Switch Demo Role')}
              </p>
              {quickSwitchRoles.map((r) => {
                const RIcon = r.icon;
                return (
                  <button
                    key={r.username}
                    onClick={() => {
                      setIsMobileOpen(false);
                      handleRoleSwitch(r.username, r.password);
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <RIcon className="w-4 h-4 text-slate-400" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('shell.sign_out', 'Sign Out')}</span>
              </button>
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

      {/* Click outside to close role switcher */}
      {showRoleSwitcher && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowRoleSwitcher(false)} 
        />
      )}
    </div>
  );
};

export default AppShell;
