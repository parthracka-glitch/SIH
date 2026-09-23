import React, { useState } from "react";
import {
  Users,
  Wifi,
  WifiOff,
  RefreshCw,
  Baby,
  AlertCircle,
  CheckCircle2,
  QrCode
} from "lucide-react";
import { QRScanner } from "../components/QRScanner";

export const AshaDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);
  const [activeTab, setActiveTab] = useState<"roster" | "new_visit">("roster");
  const [showScanner, setShowScanner] = useState(false);

  // New Visit Form State
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    bp: "",
    spo2: ""
  });

  const handleSaveVisit = () => {
    if (!formData.name) {
      alert("Please enter patient name.");
      return;
    }
    setPendingSyncCount((prev) => prev + 1);
    alert(`Visit for ${formData.name} recorded into offline local queue! Total pending: ${pendingSyncCount + 1}`);
    setFormData({ name: "", mobile: "", bp: "", spo2: "" });
    setActiveTab("roster");
  };

  const handleQrScanned = (code: string) => {
    setShowScanner(false);
    alert(`Scanned ABHA QR code:\n${code}\nPatient lookup loaded.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Offline Sync Status Bar */}
      <div className={`p-4 rounded-2xl flex items-center justify-between text-sm font-semibold transition ${
        isOnline ? "bg-emerald-50 border border-emerald-200 text-emerald-900" : "bg-amber-500 text-white"
      }`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="flex items-center space-x-2 text-left cursor-pointer"
            title="Click to toggle simulated online/offline status"
          >
            {isOnline ? <Wifi className="w-5 h-5 text-emerald-600" /> : <WifiOff className="w-5 h-5 animate-pulse text-white" />}
            <span>
              {isOnline
                ? `Connected to National Health Cloud. ${pendingSyncCount} visits waiting to sync.`
                : `Operating Offline. All changes saved locally to IndexedDB (${pendingSyncCount} queued).`}
            </span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-white/80 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:bg-white transition flex items-center space-x-1.5 cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">Scan ABHA</span>
          </button>
          <button
            onClick={() => { setPendingSyncCount(0); alert("All offline visits synchronized to Central Cloud!"); }}
            className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:bg-slate-50 transition flex items-center space-x-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Sync Now</span>
          </button>
        </div>
      </div>

      {/* 2. Key Field Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Households Covered", count: "142 / 160", icon: Users, color: "text-blue-600" },
          { label: "High Risk Flags", count: "7 Critical", icon: AlertCircle, color: "text-red-500" },
          { label: "ANC Pregnancies", count: "12 Mothers", icon: Baby, color: "text-teal-600" },
          { label: "Visits Synced Today", count: "18 Patients", icon: CheckCircle2, color: "text-emerald-600" }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-slate-900">{stat.count}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Action Tabs */}
      <div className="flex space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("roster")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === "roster" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          Village Household Roster
        </button>
        <button
          onClick={() => setActiveTab("new_visit")}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === "new_visit" ? "border-blue-600 text-blue-700" : "border-transparent text-slate-400 hover:text-slate-700"
          }`}
        >
          + Record New Patient Visit
        </button>
      </div>

      {/* 4. Household Roster View */}
      {activeTab === "roster" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Assigned Patients in Ward 4 (Sinnar / Bagru)</h3>
            <span className="text-xs font-bold text-slate-400">Total: 48 Records</span>
          </div>
          <div className="divide-y divide-slate-100">
            {[
              { name: "Kavita Ramesh Shinde", age: 26, house: "H-42", risk: "HIGH RISK (BP 150/95)", status: "Follow-up due" },
              { name: "Babanrao Tukaram Patil", age: 67, house: "H-19", risk: "DIABETES (Sugar 210)", status: "Medication delivered" },
              { name: "Pooja Santosh Jadhav", age: 22, house: "H-88", risk: "ANC Trimester 3", status: "Ultrasound scheduled" },
              { name: "Sita Devi", age: 34, house: "H-04", risk: "HIGH RISK (Hb 6.8 g/dL)", status: "108 Dispatched to DH" }
            ].map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                  <p className="text-xs text-slate-500">Age: {item.age} yrs • House: {item.house}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                    item.risk.includes("HIGH RISK") ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {item.risk}
                  </span>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">{item.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Fast Field Visit Entry Form */}
      {activeTab === "new_visit" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-2xl">
          <h3 className="font-extrabold text-base text-slate-900">Quick Field Vitals Recording</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-500">Patient Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Mobile Number</label>
              <input
                type="text"
                placeholder="10-digit number"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">Blood Pressure (Systolic/Diastolic)</label>
              <input
                type="text"
                placeholder="e.g. 120/80"
                value={formData.bp}
                onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500">SpO2 (Pulse Oximeter %)</label>
              <input
                type="text"
                placeholder="e.g. 98"
                value={formData.spo2}
                onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSaveVisit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow cursor-pointer"
          >
            Save Record Locally (Offline PWA)
          </button>
        </div>
      )}

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

export default AshaDashboard;
