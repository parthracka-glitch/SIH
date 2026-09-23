import React, { useState } from "react";
import {
  Video,
  Clock,
  Send,
  Printer
} from "lucide-react";

export const DoctorDashboard: React.FC = () => {
  const [queue, _setQueue] = useState([
    {
      name: "Ramesh Tukaram Patil",
      age: 58,
      village: "Sinnar",
      severity: "EMERGENCY",
      time: "Waiting 5m",
      sym: "Chest Pain & Sweating",
      vitals: { bp: "155/95", hr: "94", spo2: "94%", sugar: "185" },
    },
    {
      name: "Savita Kailash More",
      age: 34,
      village: "Bagru",
      severity: "HIGH",
      time: "Waiting 12m",
      sym: "Severe Fever & Chills",
      vitals: { bp: "118/76", hr: "102", spo2: "96%", sugar: "110" },
    },
    {
      name: "Gopal Krishna Rao",
      age: 71,
      village: "Bassi",
      severity: "MODERATE",
      time: "Waiting 22m",
      sym: "Chronic Cough & Dyspnea",
      vitals: { bp: "138/86", hr: "78", spo2: "98%", sugar: "188" },
    },
    {
      name: "Meena Devi Verma",
      age: 29,
      village: "Chaksu",
      severity: "LOW",
      time: "Waiting 30m",
      sym: "Skin Rash & Mild Itching",
      vitals: { bp: "112/70", hr: "72", spo2: "99%", sugar: "92" },
    },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(queue[0]);

  // Rx State
  const [rxMedicine, setRxMedicine] = useState("Tab. Amlodipine");
  const [rxDosage, setRxDosage] = useState("5mg");
  const [rxFrequency, setRxFrequency] = useState("1-0-0 (Morning OD)");
  const [rxAdvice, setRxAdvice] = useState("Low sodium diet, plenty of water. Avoid strenuous exertion.");

  const handleDispatchRx = () => {
    alert(`Prescription for ${selectedPatient.name} digitally signed with Doctor DSC and dispatched to ABHA Patient Locker!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Live Patient OPD Waiting Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[700px]">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Live OPD Queue (ESI Triage)</h3>
            <p className="text-xs text-slate-400">Primary Health Centre & DH Hub</p>
          </div>
          <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">
            {queue.length} Waiting
          </span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {queue.map((pat, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPatient(pat)}
              className={`p-3.5 rounded-xl border transition cursor-pointer ${
                selectedPatient.name === pat.name
                  ? "bg-blue-50/80 border-blue-300 shadow-xs"
                  : "border-transparent hover:border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-sm text-slate-900">{pat.name}</h4>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    pat.severity === "EMERGENCY"
                      ? "bg-red-500 text-white animate-pulse"
                      : pat.severity === "HIGH"
                      ? "bg-amber-100 text-amber-800"
                      : pat.severity === "MODERATE"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {pat.severity}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{pat.sym} • {pat.age} yrs</span>
                <span className="flex items-center space-x-1 text-slate-400">
                  <Clock className="w-3 h-3 inline" />
                  <span>{pat.time}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Patient Clinical Console & e-Prescription (2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Patient Vitals & Clinical Brief */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  selectedPatient.severity === "EMERGENCY" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                  {selectedPatient.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{selectedPatient.age} yrs • Male • Village: {selectedPatient.village}</p>
            </div>
            <button
              onClick={() => alert(`Connecting secure WebRTC video room for ${selectedPatient.name}...`)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow cursor-pointer"
            >
              <Video className="w-4 h-4" />
              <span>Start Video Call</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
              <p className="text-base font-black text-red-600">{selectedPatient.vitals.bp}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
              <p className="text-base font-black text-slate-900">{selectedPatient.vitals.hr} bpm</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">SpO2 Oxygen</span>
              <p className="text-base font-black text-amber-600">{selectedPatient.vitals.spo2}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Sugar</span>
              <p className="text-base font-black text-slate-900">{selectedPatient.vitals.sugar} mg/dL</p>
            </div>
          </div>
        </div>

        {/* e-Prescription Generator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">Digital e-Prescription (ABDM Compliant)</h3>
            <span className="text-xs text-teal-600 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full">
              Jan Aushadhi Formulary
            </span>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Medicine Name</label>
                <input
                  type="text"
                  value={rxMedicine}
                  onChange={(e) => setRxMedicine(e.target.value)}
                  placeholder="Medicine Name (e.g. Tab Amlodipine)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Dosage</label>
                <input
                  type="text"
                  value={rxDosage}
                  onChange={(e) => setRxDosage(e.target.value)}
                  placeholder="Dosage (5mg)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Frequency</label>
                <input
                  type="text"
                  value={rxFrequency}
                  onChange={(e) => setRxFrequency(e.target.value)}
                  placeholder="Frequency (1-0-0 OD)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Clinical Advice & Diet (Marathi/Hindi)</label>
              <textarea
                value={rxAdvice}
                onChange={(e) => setRxAdvice(e.target.value)}
                placeholder="Clinical Advice & Dietary Restrictions (in Marathi/Hindi)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none h-24 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Rx</span>
              </button>
              <button
                onClick={handleDispatchRx}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold shadow transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sign & Dispatch to Patient Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
