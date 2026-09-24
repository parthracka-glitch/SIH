import React, { useState } from "react";
import {
  Video,
  Clock,
  Send,
  Printer,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Activity,
  Droplets,
  Search,
  Sparkles,
  FileCheck,
  Stethoscope,
  ShieldCheck,
  User,
  ArrowUpRight
} from "lucide-react";

interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  janAushadhiPrice: string;
}

interface PatientQueueItem {
  id: string;
  abhaId: string;
  name: string;
  age: number;
  gender: string;
  village: string;
  severity: "EMERGENCY" | "HIGH" | "MODERATE" | "LOW";
  time: string;
  sym: string;
  ashaWorker: string;
  vitals: {
    bp: string;
    bpStatus: "Normal" | "High" | "Critical";
    hr: string;
    hrStatus: "Normal" | "Elevated";
    spo2: string;
    spo2Status: "Normal" | "Low";
    sugar: string;
    sugarStatus: "Normal" | "High";
    temp: string;
  };
  allergies: string[];
  history: string;
  defaultMedications: MedicationItem[];
}

const INITIAL_QUEUE: PatientQueueItem[] = [
  {
    id: "P-101",
    abhaId: "91-4820-1928-4491",
    name: "Ramesh Tukaram Patil",
    age: 58,
    gender: "Male",
    village: "Sinnar PHC",
    severity: "EMERGENCY",
    time: "5m ago",
    sym: "Acute Retrosternal Chest Pain & Sweating",
    ashaWorker: "Sunita Shinde (ASHA #104)",
    vitals: {
      bp: "155/95",
      bpStatus: "High",
      hr: "94",
      hrStatus: "Elevated",
      spo2: "94%",
      spo2Status: "Low",
      sugar: "185",
      sugarStatus: "High",
      temp: "98.4°F"
    },
    allergies: ["Penicillin", "Sulfa drugs"],
    history: "Known Hypertensive (3 yrs), Heavy manual farm worker",
    defaultMedications: [
      {
        id: "m1",
        name: "Tab. Amlodipine",
        genericName: "Amlodipine Besylate 5mg",
        dosage: "5mg",
        frequency: "1-0-0 (Morning)",
        duration: "30 Days",
        instructions: "After breakfast with water",
        janAushadhiPrice: "₹4.50"
      },
      {
        id: "m2",
        name: "Tab. Sorbitrate",
        genericName: "Isosorbide Dinitrate 5mg",
        dosage: "5mg",
        frequency: "SOS (Sublingual)",
        duration: "10 Days",
        instructions: "Place under tongue if chest pain recurs",
        janAushadhiPrice: "₹8.00"
      },
      {
        id: "m3",
        name: "Tab. Ecosprin",
        genericName: "Aspirin Gastro-resistant 75mg",
        dosage: "75mg",
        frequency: "0-1-0 (Afternoon)",
        duration: "30 Days",
        instructions: "Post meal. Do not take on empty stomach",
        janAushadhiPrice: "₹5.20"
      }
    ]
  },
  {
    id: "P-102",
    abhaId: "91-3310-8472-1102",
    name: "Savita Kailash More",
    age: 34,
    gender: "Female",
    village: "Bagru Health Sub-centre",
    severity: "HIGH",
    time: "12m ago",
    sym: "High Grade Continuous Fever with Rigors & Body Ache",
    ashaWorker: "Kavita Rao (ASHA #108)",
    vitals: {
      bp: "118/76",
      bpStatus: "Normal",
      hr: "102",
      hrStatus: "Elevated",
      spo2: "97%",
      spo2Status: "Normal",
      sugar: "110",
      sugarStatus: "Normal",
      temp: "102.2°F"
    },
    allergies: ["None known"],
    history: "Suspected seasonal viral / malaria endemic area",
    defaultMedications: [
      {
        id: "m1",
        name: "Tab. Paracetamol (Jan Aushadhi)",
        genericName: "Paracetamol IP 650mg",
        dosage: "650mg",
        frequency: "1-1-1 (TID)",
        duration: "5 Days",
        instructions: "Take every 8 hours after food for fever",
        janAushadhiPrice: "₹5.50"
      },
      {
        id: "m2",
        name: "Oral Rehydration Salts (WHO formula)",
        genericName: "Electrolyte ORS Sachet 21.8g",
        dosage: "1 Sachet",
        frequency: "Daily in 1L Water",
        duration: "3 Days",
        instructions: "Mix in boiled & cooled water. Sip throughout day",
        janAushadhiPrice: "₹4.00"
      }
    ]
  },
  {
    id: "P-103",
    abhaId: "91-7721-0043-9811",
    name: "Gopal Krishna Rao",
    age: 71,
    gender: "Male",
    village: "Bassi Rural Dispensary",
    severity: "MODERATE",
    time: "24m ago",
    sym: "Productive Cough with Exertional Dyspnea (2 weeks)",
    ashaWorker: "Meera Bai (ASHA #112)",
    vitals: {
      bp: "138/86",
      bpStatus: "Normal",
      hr: "78",
      hrStatus: "Normal",
      spo2: "95%",
      spo2Status: "Normal",
      sugar: "188",
      sugarStatus: "High",
      temp: "98.6°F"
    },
    allergies: ["Dust, Smoke"],
    history: "Ex-smoker, Type-2 Diabetes on oral hypoglycemics",
    defaultMedications: [
      {
        id: "m1",
        name: "Syp. Terbutaline + Bromhexine",
        genericName: "Bronchodilator Expectorant 100ml",
        dosage: "10ml",
        frequency: "1-0-1 (BD)",
        duration: "7 Days",
        instructions: "Take with warm water",
        janAushadhiPrice: "₹22.00"
      },
      {
        id: "m2",
        name: "Tab. Metformin PR (Jan Aushadhi)",
        genericName: "Metformin Hydrochloride 500mg",
        dosage: "500mg",
        frequency: "1-0-1 (After meals)",
        duration: "30 Days",
        instructions: "Do not skip meals",
        janAushadhiPrice: "₹9.00"
      }
    ]
  },
  {
    id: "P-104",
    abhaId: "91-1209-5561-3990",
    name: "Meena Devi Verma",
    age: 29,
    gender: "Female",
    village: "Chaksu Sub-centre",
    severity: "LOW",
    time: "35m ago",
    sym: "Erythematous Skin Rash & Itching across arms",
    ashaWorker: "Anita Kumari (ASHA #115)",
    vitals: {
      bp: "112/70",
      bpStatus: "Normal",
      hr: "72",
      hrStatus: "Normal",
      spo2: "99%",
      spo2Status: "Normal",
      sugar: "92",
      sugarStatus: "Normal",
      temp: "98.2°F"
    },
    allergies: ["Synthetic detergents"],
    history: "No systemic disease. Contact dermatitis suspect",
    defaultMedications: [
      {
        id: "m1",
        name: "Tab. Cetirizine (Jan Aushadhi)",
        genericName: "Cetirizine Dihydrochloride 10mg",
        dosage: "10mg",
        frequency: "0-0-1 (Bedtime)",
        duration: "5 Days",
        instructions: "May cause mild drowsiness. Take at night",
        janAushadhiPrice: "₹3.80"
      },
      {
        id: "m2",
        name: "Calamine Lotion 100ml",
        genericName: "Calamine + Light Liquid Paraffin",
        dosage: "Apply twice",
        frequency: "Morning & Night",
        duration: "7 Days",
        instructions: "Apply gently to affected skin after bath",
        janAushadhiPrice: "₹18.00"
      }
    ]
  }
];

export const DoctorDashboard: React.FC = () => {
  const [queue, setQueue] = useState<PatientQueueItem[]>(INITIAL_QUEUE);
  const [selectedPatient, setSelectedPatient] = useState<PatientQueueItem>(INITIAL_QUEUE[0]);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"rx" | "history">("rx");

  // Medication list for current prescription
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_QUEUE[0].defaultMedications);
  const [clinicalAdvice, setClinicalAdvice] = useState(
    "1. Avoid oily & high-salt foods.\n2. Hydrate well with minimum 2.5L water/day.\n3. Return immediately to PHC if chest discomfort increases."
  );
  const [followupDays, setFollowupDays] = useState("7");
  const [isSigned, setIsSigned] = useState(false);

  // Switch patient handler
  const handleSelectPatient = (patient: PatientQueueItem) => {
    setSelectedPatient(patient);
    setMedications(patient.defaultMedications);
    setIsSigned(false);
  };

  // Add medication
  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: Date.now().toString(),
      name: "Tab. Paracetamol",
      genericName: "Paracetamol IP 500mg",
      dosage: "500mg",
      frequency: "1-0-1 (BD)",
      duration: "5 Days",
      instructions: "After meals",
      janAushadhiPrice: "₹4.00"
    };
    setMedications([...medications, newMed]);
  };

  // Update medication
  const handleUpdateMedication = (id: string, field: keyof MedicationItem, value: string) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Remove medication
  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Presets
  const applyPreset = (type: "fever" | "hypertension" | "gastric") => {
    if (type === "fever") {
      setMedications([
        {
          id: "pr-1",
          name: "Tab. Paracetamol IP 650mg",
          genericName: "Paracetamol 650mg",
          dosage: "650mg",
          frequency: "1-1-1 (TID)",
          duration: "5 Days",
          instructions: "Post meals with water",
          janAushadhiPrice: "₹5.50"
        },
        {
          id: "pr-2",
          name: "Oral Rehydration Salts WHO",
          genericName: "ORS Sachet 21.8g",
          dosage: "1 Sachet",
          frequency: "Daily",
          duration: "3 Days",
          instructions: "In 1 Litre boiled water",
          janAushadhiPrice: "₹4.00"
        }
      ]);
      setClinicalAdvice("Rest, drink warm fluids, sponge with room temp water if temp > 101°F.");
    } else if (type === "hypertension") {
      setMedications([
        {
          id: "pr-3",
          name: "Tab. Amlodipine 5mg",
          genericName: "Amlodipine Besylate",
          dosage: "5mg",
          frequency: "1-0-0 (Morning)",
          duration: "30 Days",
          instructions: "Empty stomach or after breakfast",
          janAushadhiPrice: "₹4.50"
        },
        {
          id: "pr-4",
          name: "Tab. Telmisartan 40mg",
          genericName: "Telmisartan IP",
          dosage: "40mg",
          frequency: "0-0-1 (Night)",
          duration: "30 Days",
          instructions: "At bedtime",
          janAushadhiPrice: "₹12.00"
        }
      ]);
      setClinicalAdvice("Low sodium diet (<3g salt/day), 30 mins brisk walk, monitor BP weekly.");
    } else if (type === "gastric") {
      setMedications([
        {
          id: "pr-5",
          name: "Tab. Pantoprazole 40mg",
          genericName: "Pantoprazole Sodium IP",
          dosage: "40mg",
          frequency: "1-0-0 (Morning)",
          duration: "14 Days",
          instructions: "30 mins before breakfast on empty stomach",
          janAushadhiPrice: "₹8.50"
        },
        {
          id: "pr-6",
          name: "Syp. Antacid Gel 200ml",
          genericName: "Magaldrate + Simethicone",
          dosage: "10ml",
          frequency: "1-0-1 (After meals)",
          duration: "7 Days",
          instructions: "Shake well before use",
          janAushadhiPrice: "₹24.00"
        }
      ]);
      setClinicalAdvice("Avoid spicy food, eat on regular intervals, avoid tea/coffee on empty stomach.");
    }
  };

  // Sign & Dispatch
  const handleSignAndDispatch = () => {
    setIsSigned(true);
    alert(
      `✓ ABDM E-Prescription Digitally Signed!\n\nPatient: ${selectedPatient.name} (ABHA: ${selectedPatient.abhaId})\nMedications: ${medications.length} Generic Items\nDispatched to: Patient Health Locker & PMBJP Jan Aushadhi Kendra, ${selectedPatient.village}.`
    );
  };

  // Filtered queue
  const filteredQueue = queue.filter(pat => {
    const matchesSeverity = filterSeverity === "ALL" || pat.severity === filterSeverity;
    const matchesQuery =
      pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.sym.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesQuery;
  });

  return (
    <div className="space-y-5 pb-10">
      {/* TOP COMPACT DOCTOR STATS BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Live OPD Queue</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{queue.length} Patients</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Critical / Emergency</p>
            <p className="text-xl font-bold text-red-600 mt-0.5">
              {queue.filter(q => q.severity === "EMERGENCY" || q.severity === "HIGH").length} Urgent
            </p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Avg. Wait Time</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">14 Mins</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">Generic Jan Aushadhi</p>
            <p className="text-xl font-bold text-emerald-600 mt-0.5">100% ABDM</p>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: PATIENT QUEUE (4 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[740px]">
          {/* Header & Search */}
          <div className="p-3.5 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-slate-900 text-sm">OPD Triage Queue</h3>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                {filteredQueue.length} Active
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patient, village or symptom..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Severity Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5">
              {["ALL", "EMERGENCY", "HIGH", "MODERATE", "LOW"].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`text-[10px] font-semibold px-2 py-1 rounded-md transition shrink-0 cursor-pointer ${
                    filterSeverity === sev
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-100/60">
            {filteredQueue.map(pat => {
              const isSelected = selectedPatient.id === pat.id;
              return (
                <div
                  key={pat.id}
                  onClick={() => handleSelectPatient(pat)}
                  className={`p-3 rounded-lg border transition cursor-pointer text-left ${
                    isSelected
                      ? "bg-blue-50/70 border-blue-300 shadow-xs"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-slate-900 truncate">{pat.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        pat.severity === "EMERGENCY"
                          ? "bg-red-100 text-red-700 animate-pulse"
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

                  <p className="text-[11px] text-slate-600 line-clamp-1 mb-1.5">{pat.sym}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{pat.age}y • {pat.gender} • {pat.village}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-2.5 h-2.5" />
                      <span>{pat.time}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: CLINICAL PATIENT CONSOLE (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* 1. CURRENT PATIENT CARD & VITALS MONITOR */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2.5">
                  <h2 className="text-lg font-bold text-slate-900">{selectedPatient.name}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedPatient.severity === "EMERGENCY" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {selectedPatient.severity} TRIAGE
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                  <span>ABHA: <strong className="text-slate-700 font-mono">{selectedPatient.abhaId}</strong></span>
                  <span>•</span>
                  <span>{selectedPatient.age} yrs, {selectedPatient.gender}</span>
                  <span>•</span>
                  <span>{selectedPatient.village}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert(`Starting ABDM Teleconsult Video Session with ${selectedPatient.name}...`)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Video Call</span>
                </button>
              </div>
            </div>

            {/* Clinical Chief Complaint & ASHA Worker info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/80 p-3 rounded-lg text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chief Complaint</span>
                <p className="text-slate-800 font-medium mt-0.5">{selectedPatient.sym}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ASHA Field Triage By</span>
                <p className="text-slate-800 font-medium mt-0.5">{selectedPatient.ashaWorker}</p>
              </div>
            </div>

            {/* Vitals Telemetry Grid */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Live Vitals & Telemetry</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold mb-1">
                    <span>Blood Pressure</span>
                    <Heart className="w-3 h-3 text-red-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedPatient.vitals.bp}</p>
                  <span className={`text-[9px] font-bold ${selectedPatient.vitals.bpStatus === 'High' ? 'text-red-600' : 'text-emerald-600'}`}>
                    {selectedPatient.vitals.bpStatus}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold mb-1">
                    <span>Heart Rate</span>
                    <Activity className="w-3 h-3 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedPatient.vitals.hr} <span className="text-[10px] font-normal text-slate-500">bpm</span></p>
                  <span className="text-[9px] font-bold text-slate-600">{selectedPatient.vitals.hrStatus}</span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold mb-1">
                    <span>SpO2 Oxygen</span>
                    <Droplets className="w-3 h-3 text-teal-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedPatient.vitals.spo2}</p>
                  <span className={`text-[9px] font-bold ${selectedPatient.vitals.spo2Status === 'Low' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {selectedPatient.vitals.spo2Status}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold mb-1">
                    <span>Blood Glucose</span>
                    <Activity className="w-3 h-3 text-purple-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedPatient.vitals.sugar} <span className="text-[10px] font-normal text-slate-500">mg/dL</span></p>
                  <span className={`text-[9px] font-bold ${selectedPatient.vitals.sugarStatus === 'High' ? 'text-purple-600' : 'text-emerald-600'}`}>
                    {selectedPatient.vitals.sugarStatus}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/50 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px] font-semibold mb-1">
                    <span>Body Temp</span>
                    <Activity className="w-3 h-3 text-amber-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedPatient.vitals.temp}</p>
                  <span className="text-[9px] font-bold text-slate-600">Oral probe</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CLINICAL WORKSPACE TABS */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Tab navigation */}
            <div className="flex items-center justify-between border-b border-slate-100 px-4 pt-2">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("rx")}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    activeTab === "rx"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Digital e-Prescription (ABDM)
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                    activeTab === "history"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  Patient History & Allergies
                </button>
              </div>

              {/* Quick Template Presets */}
              {activeTab === "rx" && (
                <div className="flex items-center space-x-1.5 pb-2">
                  <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">1-Click Presets:</span>
                  <button
                    onClick={() => applyPreset("fever")}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    Fever
                  </button>
                  <button
                    onClick={() => applyPreset("hypertension")}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    HTN
                  </button>
                  <button
                    onClick={() => applyPreset("gastric")}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2 py-0.5 rounded cursor-pointer transition"
                  >
                    Gastric
                  </button>
                </div>
              )}
            </div>

            {/* TAB CONTENT: RX GENERATOR */}
            {activeTab === "rx" ? (
              <div className="p-4 space-y-4">
                {/* Medications Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">Prescribed Generic Medications</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        PMBJP Jan Aushadhi Formulary
                      </span>
                    </div>
                    <button
                      onClick={handleAddMedication}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Medicine</span>
                    </button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {medications.map((med, idx) => (
                      <div
                        key={med.id}
                        className="grid grid-cols-12 gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60 items-center text-xs"
                      >
                        <div className="col-span-12 sm:col-span-4">
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">MEDICINE #{idx + 1}</label>
                          <input
                            type="text"
                            value={med.name}
                            onChange={e => handleUpdateMedication(med.id, "name", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 font-medium text-slate-900 text-xs outline-none focus:border-blue-500"
                            placeholder="e.g. Tab. Paracetamol"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-2">
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">DOSAGE</label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={e => handleUpdateMedication(med.id, "dosage", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs outline-none focus:border-blue-500"
                            placeholder="500mg"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">FREQUENCY</label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={e => handleUpdateMedication(med.id, "frequency", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs outline-none focus:border-blue-500"
                            placeholder="1-0-1 (BD)"
                          />
                        </div>

                        <div className="col-span-10 sm:col-span-2">
                          <label className="text-[9px] font-bold text-slate-400 block mb-0.5">DURATION</label>
                          <input
                            type="text"
                            value={med.duration}
                            onChange={e => handleUpdateMedication(med.id, "duration", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs outline-none focus:border-blue-500"
                            placeholder="5 Days"
                          />
                        </div>

                        <div className="col-span-2 sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                          <button
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-slate-400 hover:text-red-600 transition cursor-pointer p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice & Follow-up */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Clinical Advice & Diet (Marathi / Hindi / English)
                    </label>
                    <textarea
                      value={clinicalAdvice}
                      onChange={e => setClinicalAdvice(e.target.value)}
                      rows={2}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-blue-500"
                      placeholder="Enter lifestyle instructions, diet restriction, hydration notes..."
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Follow-up
                    </label>
                    <div className="space-y-1">
                      <select
                        value={followupDays}
                        onChange={e => setFollowupDays(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                      >
                        <option value="3">In 3 Days</option>
                        <option value="7">In 7 Days (1 Week)</option>
                        <option value="14">In 14 Days (2 Weeks)</option>
                        <option value="30">In 30 Days (1 Month)</option>
                        <option value="SOS">SOS / As Needed</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Automated SMS reminder will be sent to patient phone.</p>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Doctor DSC Signature Active: <strong>Dr. Priya Sharma (MMC Reg: 84920)</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.print()}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Rx</span>
                    </button>
                    <button
                      onClick={handleSignAndDispatch}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Sign & Dispatch to Patient ABHA</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB CONTENT: HISTORY & ALLERGIES */
              <div className="p-4 space-y-3 text-xs">
                <div className="bg-red-50/70 border border-red-200/80 p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                    Known Patient Allergies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies.map((all, i) => (
                      <span key={i} className="bg-red-100 text-red-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {all}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Medical Background & Chronic History
                  </span>
                  <p className="text-slate-800 leading-relaxed">{selectedPatient.history}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Past ABDM Health Records Linkage
                  </span>
                  <p className="text-slate-600">
                    Linked to Nashik District Hospital & Sinnar Primary Health Centre via National Health Stack. No drug-drug contraindications recorded.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
