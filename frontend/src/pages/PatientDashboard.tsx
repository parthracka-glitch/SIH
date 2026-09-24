import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Sparkles,
  QrCode,
  MapPin,
  Video,
  CreditCard,
  Pill,
  Calendar,
  PhoneCall,
  Heart,
  ChevronRight,
  User
} from "lucide-react";
import { DigitalIDCard } from "../components/DigitalIDCard";
import { FacilityFinder } from "../components/FacilityFinder";
import { useAuthStore } from "../lib/auth";

export const PatientDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [showFacilities, setShowFacilities] = useState(false);

  const patient = {
    name: user?.full_name || "Ramesh Yadav",
    abhaAddress: user?.username ? `${user.username}@abdm` : "patient.ramesh@abdm",
    abhaNumber: "91-4829-1029-3847",
    village: "Sinnar",
    district: "Nashik",
    age: 38,
    gender: "Male"
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* 1. Welcoming Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('citizen.abha_linked', 'ABDM Linked')}: {patient.abhaAddress}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {t('citizen.welcome', 'Namaste')}, {patient.name}
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            {t('citizen.asha_notice', 'Your health records are up-to-date. Next scheduled ASHA checkup is on')} <strong>Thursday, Sinnar Sub-Centre</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link
              to="/teleconsult"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>{t('citizen.talk_video_doctor', 'Talk to Video Doctor')}</span>
            </Link>

            <button
              onClick={() => window.dispatchEvent(new CustomEvent("arogya_open_voice_ai"))}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>{t('citizen.talk_ai_doctor', 'Talk to AI Doctor')}</span>
            </button>

            <a
              href="tel:108"
              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition flex items-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{t('citizen.emergency_108', 'Emergency 108')}</span>
            </a>
          </div>
        </div>

        {/* Ambient subtle shape */}
        <div className="absolute right-0 top-0 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Big, Simple 4-Card Quick Navigation for Rural Citizens */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/teleconsult"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
            <Video className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition">
              {t('nav.teleconsult', 'Video Doctor')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              ● {t('citizen.doctor_online', 'Doctor Online')}
            </p>
          </div>
        </Link>

        <Link
          to="/health-card"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition">
              {t('nav.health_card', 'ABHA Health Card')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {t('health_card.official_pass', 'Digital Pass')}
            </p>
          </div>
        </Link>

        <Link
          to="/pharmacy"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
            <Pill className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition">
              {t('nav.pharmacy', 'Prescriptions & Meds')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              3 {t('pharmacy.active_prescriptions', 'Active Meds')}
            </p>
          </div>
        </Link>

        <Link
          to="/appointments"
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="mt-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-600 transition">
              {t('nav.appointments', 'Book Appointments')}
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {t('appointments.active_pass', 'OPD Token Pass')}
            </p>
          </div>
        </Link>
      </div>

      {/* 3. Simple & Clear Vitals Cards */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">
            {t('citizen.vitals_title', 'Latest Health Checkup (by ASHA Worker)')}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">{t('citizen.blood_pressure', 'Blood Pressure')}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">120/80 <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              {t('citizen.status_optimal', 'Optimal')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">{t('citizen.spo2', 'Oxygen (SpO2)')}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">98% <span className="text-xs text-slate-400 font-normal">Air</span></div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              {t('citizen.status_normal', 'Normal')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">{t('citizen.heart_rate', 'Heart Rate')}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">74 <span className="text-xs text-slate-400 font-normal">bpm</span></div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              {t('citizen.status_good', 'Good')}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">{t('citizen.blood_sugar', 'Blood Sugar')}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">115 <span className="text-xs text-slate-400 font-normal">mg/dL</span></div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
              {t('citizen.status_fasting', 'Fasting')}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Simple 2-Column Split: Active OPD Ticket & ABHA Card Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Active OPD Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                {t('appointments.active_pass', 'Active OPD Pass')}
              </h3>
            </div>
            <Link to="/appointments" className="text-xs font-bold text-blue-600 hover:underline">
              {t('appointments.book_new', 'Book New')} &rarr;
            </Link>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-base font-black text-slate-900">TK-MED-108</span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Room 104
              </span>
            </div>
            <div className="text-xs text-slate-700 font-medium">General Medicine • Dr. Priya Sharma</div>
            <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
              <span>Position: <strong>#2 in line</strong></span>
              <span>Wait: <strong className="text-emerald-600">~8 mins</strong></span>
            </div>
          </div>
        </div>

        {/* ABHA Digital Card Preview */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                {t('citizen.my_id_card', 'ABHA Health Card')}
              </h3>
            </div>
            <Link to="/health-card" className="text-xs font-bold text-blue-600 hover:underline">
              {t('health_card.print_card', 'View Card')} &rarr;
            </Link>
          </div>

          <DigitalIDCard
            user={{
              name: patient.name,
              qrId: patient.abhaNumber,
              age: patient.age,
              gender: patient.gender,
              village: patient.village,
              phone: "+91 98765 43210"
            }}
          />
        </div>
      </div>

      {/* Optional Facility Finder */}
      {showFacilities && <FacilityFinder />}
    </div>
  );
};

export default PatientDashboard;
