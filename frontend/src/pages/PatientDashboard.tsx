import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Sparkles,
  QrCode,
  MapPin
} from "lucide-react";
import { DigitalIDCard } from "../components/DigitalIDCard";
import { QRScanner } from "../components/QRScanner";
import { FacilityFinder } from "../components/FacilityFinder";
import { useAuthStore } from "../lib/auth";

export const PatientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [showScanner, setShowScanner] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);

  const patient = {
    name: user?.full_name || "Ramesh Yadav",
    abhaAddress: user?.username ? `${user.username}@abdm` : "ramesh.yadav@abdm",
    abhaNumber: "91-8472-9104-5821",
    village: "Sinnar",
    district: "Nashik",
    age: 38,
    gender: "Male"
  };

  const handleQrScanned = (code: string) => {
    setShowScanner(false);
    alert(`ABHA QR Code Scanned Successfully:\n${code}`);
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Banner & Emergency Action */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ABDM Linked: {patient.abhaAddress}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
            Namaste, {patient.name}
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed">
            Your health records are up-to-date. Next scheduled ASHA household checkup is on <strong>Thursday, 26th September</strong> at Sinnar Sub-Center.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("arogya_open_voice_ai"))}
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Talk to AI Doctor</span>
            </button>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-teal-300" />
              <span>Scan ABHA QR</span>
            </button>
            <button
              onClick={() => setShowFacilities(!showFacilities)}
              className="bg-white/15 hover:bg-white/25 text-white border border-white/30 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-blue-200" />
              <span>{showFacilities ? "Hide Facilities" : "Nearby Beds"}</span>
            </button>
            <a
              href="tel:108"
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center space-x-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Emergency 108</span>
            </a>
          </div>
        </div>

        {/* Ambient Decorative Shapes */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      </div>

      {/* Optional Facility Finder Drawer */}
      {showFacilities && <FacilityFinder />}

      {/* 2. Key Vitals Grid */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>Latest Recorded Vitals (by ASHA Worker)</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Blood Pressure", val: "120/80", unit: "mmHg", status: "Optimal", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "SpO2 (Oxygen)", val: "98%", unit: "Air", status: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Heart Rate", val: "74", unit: "bpm", status: "Good", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Blood Sugar", val: "115", unit: "mg/dL", status: "Fasting", color: "text-amber-600", bg: "bg-amber-50" }
          ].map((vital, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{vital.label}</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-black text-slate-900">{vital.val}</span>
                <span className="text-xs text-slate-400 font-semibold">{vital.unit}</span>
              </div>
              <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${vital.bg} ${vital.color}`}>
                {vital.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Care Journey Stepper */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">Active Care Navigation Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          {[
            { step: "1. Village Sub-Center", desc: "Vitals screened by ASHA", date: "20 Sep", done: true },
            { step: "2. Tele-Consultation", desc: "PHC Doctor reviewed symptoms", date: "21 Sep", done: true },
            { step: "3. Specialist Referral", desc: "Cardiology at District Hospital", date: "25 Sep", active: true },
            { step: "4. Medicine Delivery", desc: "Free pharmacy dispatch to village", date: "Pending", done: false }
          ].map((node, i) => (
            <div
              key={i}
              className={`care-journey-node p-4 rounded-xl border ${
                node.done
                  ? "bg-emerald-50/60 border-emerald-300 text-emerald-950"
                  : node.active
                  ? "bg-blue-50 border-blue-400 text-blue-950 ring-2 ring-blue-400/20"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{node.step}</span>
                <span className="opacity-75">{node.date}</span>
              </div>
              <p className="text-xs opacity-80">{node.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Appointments & Digital Card Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900">Upcoming Appointments</h2>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { doctor: "Dr. Rajesh Kulkarni", spec: "General Medicine, Sinnar PHC", time: "Tomorrow, 10:30 AM", type: "Video Consult" },
              { doctor: "Dr. Ananya Deshmukh", spec: "Pediatrics & Maternal Health", time: "Fri, 27 Sep, 2:00 PM", type: "In-Person Visit" }
            ].map((appt, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition">
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{appt.doctor}</h4>
                  <p className="text-xs text-slate-500">{appt.spec}</p>
                  <p className="text-xs font-semibold text-blue-600 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 mr-1 inline" />
                    <span>{appt.time}</span>
                  </p>
                </div>
                <button className="bg-white border border-slate-200 hover:bg-blue-600 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 transition shadow-2xs cursor-pointer">
                  {appt.type}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ABHA Digital ID Card Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900 mb-1">Your ABHA Digital ID</h2>
            <p className="text-xs text-slate-400">Scan at any PHC or clinic for instant paperless admission.</p>
          </div>
          <DigitalIDCard
            user={{
              name: patient.name,
              qrId: patient.abhaNumber,
              age: patient.age,
              gender: patient.gender,
              village: patient.village,
              phone: "9823418290"
            }}
          />
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQrScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default PatientDashboard;
