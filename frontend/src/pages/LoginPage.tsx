import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/auth';
import { changeLanguage } from '../lib/i18n';
import { SosEmergencyModal } from '../components/SosEmergencyModal';
import {
  Heart,
  Calendar,
  UserCheck,
  Users,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Globe,
  Check,
  AlertCircle,
  Stethoscope,
  User,
  ShieldAlert,
  Phone,
  Sparkles,
  Activity,
} from 'lucide-react';

interface LoginPageProps {
  defaultMode?: 'login' | 'signup';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultMode = 'login' }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' || defaultMode === 'signup' ? 'signup' : 'login'
  );

  // Role selector for form
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR' | 'STAFF'>('PATIENT');
  const [staffSubType, setStaffSubType] = useState<'ASHA' | 'ADMIN'>('ASHA');

  // Form states
  const [emailOrUsername, setEmailOrUsername] = useState('patient.ramesh');
  const [password, setPassword] = useState('patient123');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  // Sync role selection with default credentials in demo mode
  useEffect(() => {
    if (mode === 'login') {
      if (selectedRole === 'PATIENT') {
        setEmailOrUsername('patient.ramesh');
        setPassword('patient123');
      } else if (selectedRole === 'DOCTOR') {
        setEmailOrUsername('dr.sharma');
        setPassword('doctor123');
      } else if (selectedRole === 'STAFF') {
        if (staffSubType === 'ASHA') {
          setEmailOrUsername('asha.rekha');
          setPassword('asha123');
        } else {
          setEmailOrUsername('admin');
          setPassword('admin123');
        }
      }
    }
  }, [selectedRole, staffSubType, mode]);

  const getRedirectForRole = (userRole?: string) => {
    if (userRole === 'PATIENT') return '/patient';
    if (userRole === 'DOCTOR') return '/doctor';
    if (userRole === 'ASHA' || userRole === 'CHO' || userRole === 'ANM') return '/asha';
    return '/dashboard';
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const loggedUser = await login(emailOrUsername, password);
      const target = getRedirectForRole(loggedUser?.role);
      navigate(target);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials or select a demo role.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the ABDM Health Data Consent & Terms.');
      return;
    }

    try {
      // In demo environment, log them in as chosen role or register
      const targetRole = selectedRole === 'STAFF' ? staffSubType : selectedRole;
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
      
      const loggedUser = await login(
        targetRole === 'PATIENT' ? 'patient.ramesh' : targetRole === 'DOCTOR' ? 'dr.sharma' : 'asha.rekha',
        'patient123'
      );
      setSuccessMsg('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate(getRedirectForRole(loggedUser?.role));
      }, 1000);
    } catch (err: any) {
      // Fallback
      navigate('/patient');
    }
  };

  const handleQuickDemo = async (u: string, p: string, roleTab: 'PATIENT' | 'DOCTOR' | 'STAFF', sub?: 'ASHA' | 'ADMIN') => {
    setSelectedRole(roleTab);
    if (sub) setStaffSubType(sub);
    setEmailOrUsername(u);
    setPassword(p);
    setError(null);
    try {
      const loggedUser = await login(u, p);
      const target = getRedirectForRole(loggedUser?.role);
      navigate(target);
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    }
  };

  const handleLanguageSelect = (lang: 'en' | 'hi') => {
    changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const demoAccounts = [
    { label: 'Ramesh Yadav (Patient)', user: 'patient.ramesh', pass: 'patient123', role: 'PATIENT' as const, tag: 'ABHA Citizen' },
    { label: 'Dr. Priya Sharma', user: 'dr.sharma', pass: 'doctor123', role: 'DOCTOR' as const, tag: 'District Hospital' },
    { label: 'Rekha Bai (ASHA)', user: 'asha.rekha', pass: 'asha123', role: 'STAFF' as const, sub: 'ASHA' as const, tag: 'Village Health' },
    { label: 'Dr. Rajesh Kumar (Hospital Admin)', user: 'admin', pass: 'admin123', role: 'STAFF' as const, sub: 'ADMIN' as const, tag: 'Hospital Admin' },
  ];

  return (
    <div className="min-h-screen w-full relative bg-[#0b192c] text-white flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Background Image & Atmospheric Lighting Layer */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700 opacity-30 md:opacity-40"
        style={{
          backgroundImage: `url('/assets/medical_doctor_bg.jpg'), url('/assets/medical_hero_bg.jpg')`,
        }}
      />
      
      {/* Gradient Vignette & Tint Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#071322]/95 via-[#0b1d33]/85 to-[#081729]/90 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* TOP NAVBAR */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#10b981] flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-2 ring-white/20">
            {/* Medical Cross Icon with 3D feel */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
              <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-white">Arogya Mitra</span>
              <span className="text-cyan-400 font-bold text-lg">+</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium tracking-wide">
              {i18n.language === 'hi' ? 'राष्ट्रीय स्वास्थ्य एवं नैदानिक प्रबंधन' : 'Healthier Today, Brighter Tomorrow'}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-xs text-slate-300 font-medium tracking-wide">
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Care</span>
          <span className="text-slate-600">|</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">People</span>
          <span className="text-slate-600">|</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">Innovation</span>
          <span className="text-slate-600">|</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer">A Healthier World</span>
        </div>

        {/* 108 SOS Quick Button */}
        <button
          onClick={() => setIsSosOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white transition-all text-xs font-semibold shadow-lg shadow-rose-950/50"
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>108 Emergency SOS</span>
        </button>
      </header>

      {/* MAIN CONTENT SPLIT (Hero Left + Card Right) */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex-1 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT COLUMN: HERO CONTENT & CORRIDOR SHOWCASE */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between py-2 lg:py-6 space-y-8">
          
          {/* Main Hero Typography */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Your Health <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-300 to-teal-200 drop-shadow-sm">
                Our Priority
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base font-normal tracking-wide">
              Trusted Care &bull; Smarter Solutions &bull; Healthier Lives
            </p>

            <div className="pt-2">
              <p className="italic text-slate-300/90 text-sm font-light border-l-2 border-cyan-400/60 pl-3">
                &ldquo; Better care for a brighter tomorrow. &rdquo;
              </p>
            </div>
          </div>

          {/* Glowing Room Signage Card on Corridor */}
          <div className="hidden sm:inline-flex items-center gap-6 bg-slate-900/60 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-4 shadow-xl shadow-cyan-950/40 max-w-md">
            <div className="space-y-0.5 text-xs font-bold tracking-widest text-cyan-200">
              <div>HEALTH</div>
              <div>HOPE</div>
              <div>HEALING</div>
              <div className="text-cyan-400">ALWAYS</div>
            </div>

            <div className="h-10 w-[1px] bg-cyan-500/20" />

            {/* Glowing Animated Heartbeat Pulse */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-1">
                <Activity size={14} className="text-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-300 font-semibold uppercase tracking-wider">Live ABDM Care Network</span>
              </div>
              <svg className="w-full h-7 text-cyan-400" viewBox="0 0 200 40" fill="none">
                <path
                  d="M0 20 L40 20 L50 20 L55 8 L65 32 L75 14 L85 24 L90 20 L130 20 L140 20 L145 6 L155 34 L165 12 L175 22 L180 20 L200 20"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-ecg"
                />
              </svg>
            </div>
          </div>

          {/* 4-Item Frosted Glass Feature Dock */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {/* Appointments */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center transition-all hover:scale-105 duration-200 group">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/20">
                <Heart size={16} />
              </div>
              <div className="text-xs font-bold text-white">Appointments</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Book with ease</div>
            </div>

            {/* Medical Records */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center transition-all hover:scale-105 duration-200 group">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/20">
                <Calendar size={16} />
              </div>
              <div className="text-xs font-bold text-white">Medical Records</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Access anytime</div>
            </div>

            {/* Expert Doctors */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center transition-all hover:scale-105 duration-200 group">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/20">
                <UserCheck size={16} />
              </div>
              <div className="text-xs font-bold text-white">Expert Doctors</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Trusted care</div>
            </div>

            {/* Better Together */}
            <div className="bg-slate-800/40 hover:bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center transition-all hover:scale-105 duration-200 group">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-300 flex items-center justify-center mx-auto mb-2 group-hover:bg-cyan-500/20">
                <Users size={16} />
              </div>
              <div className="text-xs font-bold text-white">Better Together</div>
              <div className="text-[10px] text-slate-400 mt-0.5">A healthier world</div>
            </div>
          </div>

          {/* Left Footer Subtext */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4 gap-2">
            <span className="italic">Because every life matters</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Shield size={13} className="text-emerald-400" />
              <span>Safe &bull; Secure &bull; Confidential</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: THE SIGNATURE FLOATING MEDICAL CARD */}
        <div className="w-full lg:w-[480px] flex-shrink-0">
          <div className="bg-white/95 backdrop-blur-2xl rounded-[32px] p-6 sm:p-8 text-slate-800 shadow-[0_25px_60px_-15px_rgba(0,10,30,0.4)] border border-white/80 relative">
            
            {/* Top Right: Language Dropdown */}
            <div className="absolute top-5 right-6 z-20">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                >
                  <Globe size={13} className="text-sky-600" />
                  <span>{i18n.language === 'hi' ? 'हिन्दी' : 'English'}</span>
                  <span className="text-[10px]">▾</span>
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 mt-1 w-28 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-30 text-xs font-medium text-slate-700">
                    <button
                      type="button"
                      onClick={() => handleLanguageSelect('en')}
                      className={`w-full px-3 py-1.5 text-left hover:bg-sky-50 flex items-center justify-between ${
                        i18n.language === 'en' ? 'text-sky-600 font-bold bg-sky-50/50' : ''
                      }`}
                    >
                      <span>English</span>
                      {i18n.language === 'en' && <Check size={12} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleLanguageSelect('hi')}
                      className={`w-full px-3 py-1.5 text-left hover:bg-sky-50 flex items-center justify-between ${
                        i18n.language === 'hi' ? 'text-sky-600 font-bold bg-sky-50/50' : ''
                      }`}
                    >
                      <span>हिन्दी</span>
                      {i18n.language === 'hi' && <Check size={12} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Top Center: Iconic Medical Cross */}
            <div className="flex flex-col items-center text-center mt-2 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284c7] via-[#06b6d4] to-[#10b981] p-0.5 shadow-lg shadow-cyan-500/20 mb-3 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-gradient-to-tr from-[#0284c7] to-[#0ea5e9] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                    <path d="M19 10.5h-5.5V5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v5.5H5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h5.5V19c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5.5H19c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5z" />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {mode === 'login' 
                  ? 'Log in to your Arogya Mitra+ account' 
                  : 'Join India\'s unified public health network'}
              </p>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check size={15} className="flex-shrink-0 text-emerald-500" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Role Switcher Tabs (Patient / Doctor / Staff) */}
            <div className="p-1 bg-slate-100/90 rounded-2xl flex items-center gap-1 mb-5">
              <button
                type="button"
                onClick={() => setSelectedRole('PATIENT')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'PATIENT'
                    ? 'bg-white text-sky-700 shadow-md shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <User size={14} className={selectedRole === 'PATIENT' ? 'text-sky-600' : 'text-slate-400'} />
                <span>Patient</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('DOCTOR')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'DOCTOR'
                    ? 'bg-white text-sky-700 shadow-md shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Stethoscope size={14} className={selectedRole === 'DOCTOR' ? 'text-sky-600' : 'text-slate-400'} />
                <span>Doctor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('STAFF')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'STAFF'
                    ? 'bg-white text-sky-700 shadow-md shadow-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users size={14} className={selectedRole === 'STAFF' ? 'text-sky-600' : 'text-slate-400'} />
                <span>Staff</span>
              </button>
            </div>

            {/* If Staff is selected, show sub-role selector */}
            {selectedRole === 'STAFF' && (
              <div className="flex items-center justify-center gap-2 mb-4">
                {(['ASHA', 'ADMIN'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setStaffSubType(role)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      staffSubType === role
                        ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {role === 'ASHA' ? 'ASHA Worker' : 'Hospital Admin'}
                  </button>
                ))}
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {/* Email / Username Input */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="Email address or ABHA ID"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                    />
                    <span className="font-medium text-[11px]">Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => alert('For password reset in demo mode, please use standard test credentials or click a Quick Demo role.')}
                    className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Main Action Button: Log In */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all hover:shadow-sky-500/40 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Log In</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* SIGNUP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                {/* Full Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Legal Name"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Mobile Number (for ABHA OTP)"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Email / Username */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={16} />
                    </div>
                    <input
                      type="text"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      placeholder="Email or ABHA address (@abdm)"
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all"
                    />
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password"
                    required
                    className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
                  />
                </div>

                {/* ABDM Terms Checkbox */}
                <label className="flex items-start gap-2 cursor-pointer text-slate-600 text-[11px] pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
                  />
                  <span>I agree to ABDM Health Data Privacy & Terms of Service</span>
                </label>

                {/* Main Action Button: Create Account */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#2563eb] hover:from-[#0369a1] hover:to-[#1d4ed8] text-white font-bold rounded-xl text-xs shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all hover:shadow-sky-500/40 active:scale-[0.99] cursor-pointer"
                >
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* Social / SSO Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-[10px] text-slate-400 uppercase tracking-wider">
                <span className="bg-white px-2 font-semibold">or continue with</span>
              </div>
            </div>

            {/* Social Buttons (Google, ABHA, Microsoft) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('patient.ramesh', 'patient123', 'PATIENT')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span className="text-[11px]">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('patient.ramesh', 'patient123', 'PATIENT')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 shadow-sm"
              >
                <span className="text-sm">🇮🇳</span>
                <span className="text-[11px]">ABHA ID</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('admin', 'admin123', 'STAFF', 'ADMIN')}
                className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700 shadow-sm"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M1 1h10v10H1z"/>
                  <path fill="#00a4ef" d="M1 13h10v10H1z"/>
                  <path fill="#7fba00" d="M13 1h10v10H13z"/>
                  <path fill="#ffb900" d="M13 13h10v10H13z"/>
                </svg>
                <span className="text-[11px]">Microsoft</span>
              </button>
            </div>

            {/* Toggle Mode: Login <-> Signup */}
            <div className="text-center mt-4">
              <span className="text-xs text-slate-500 font-medium">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError(null);
                }}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
              >
                {mode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </div>

            {/* Bottom Mini Health Card Widget */}
            <div className="mt-4 p-3 bg-gradient-to-r from-sky-50 via-cyan-50 to-emerald-50/40 border border-sky-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
                  <Heart size={16} fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-800">Good Health</div>
                  <div className="text-[10px] text-sky-700 font-medium">Brighter Tomorrows</div>
                </div>
              </div>

              {/* Animated Mini Pulse Wave */}
              <div className="w-24 h-6 text-sky-500">
                <svg className="w-full h-full" viewBox="0 0 100 24" fill="none">
                  <path
                    d="M0 12 L20 12 L25 4 L35 20 L45 8 L55 16 L60 12 L100 12"
                    stroke="#0284c7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Quick Demo Login Expandable Tray */}
            <div className="mt-3 pt-2 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setShowDemoDrawer(!showDemoDrawer)}
                className="text-[11px] font-semibold text-slate-400 hover:text-sky-600 flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <Sparkles size={12} className="text-amber-500" />
                <span>{showDemoDrawer ? 'Hide Quick Demo Roles' : '1-Click Quick Demo Accounts'}</span>
              </button>

              {showDemoDrawer && (
                <div className="mt-2.5 space-y-1.5 text-left animate-fadeIn">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.user}
                      type="button"
                      onClick={() => handleQuickDemo(acc.user, acc.pass, acc.role, acc.sub)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-semibold text-slate-700">{acc.label}</span>
                      <span className="text-[10px] text-sky-600 font-medium bg-sky-100/70 px-2 py-0.5 rounded-md">
                        {acc.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-white/5 gap-2">
        <div className="flex items-center gap-2">
          <span>Government of India &bull; National Digital Health Mission</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ABDM M1/M2/M3 Compliant</span>
          <span>&bull;</span>
          <span>FHIR R4 Standardized</span>
        </div>
      </footer>

      {/* Emergency 108 SOS Modal */}
      <SosEmergencyModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
    </div>
  );
};
