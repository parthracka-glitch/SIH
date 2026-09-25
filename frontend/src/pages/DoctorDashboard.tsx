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
  ArrowUpRight,
  FlaskConical,
  Pill,
  ChevronDown,
  ChevronUp,
  Check
} from "lucide-react";
import { PatientLabReportsModal } from "../components/PatientLabReportsModal";
import { getPatientLabReports, PatientLabReport } from "../data/patientLabReports";

interface PharmacyFormularyDrug {
  id: string;
  name: string;
  genericName: string;
  category: "ALL" | "FEVER" | "CARDIAC" | "DIABETES" | "ANTIBIOTIC" | "GI" | "ALLERGY";
  categoryLabel: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  janAushadhiPrice: string;
  brandedPrice: string;
  savings: string;
  stock: number;
}

const PHC_PHARMACY_DRUGS: PharmacyFormularyDrug[] = [
  {
    id: "ph-1",
    name: "Tab. Paracetamol 650mg",
    genericName: "Paracetamol IP 650mg",
    category: "FEVER",
    categoryLabel: "Fever & Pain",
    dosage: "650mg",
    frequency: "1-1-1 (TID)",
    duration: "5 Days",
    instructions: "After meals with water. Max 4 doses/day",
    janAushadhiPrice: "₹5.50",
    brandedPrice: "₹35.00",
    savings: "84%",
    stock: 1420
  },
  {
    id: "ph-2",
    name: "Tab. Metformin 500mg PR",
    genericName: "Metformin Hydrochloride PR 500mg",
    category: "DIABETES",
    categoryLabel: "Diabetes",
    dosage: "500mg",
    frequency: "1-0-1 (BD)",
    duration: "30 Days",
    instructions: "Take with or immediately after meals",
    janAushadhiPrice: "₹9.00",
    brandedPrice: "₹95.00",
    savings: "90%",
    stock: 1196
  },
  {
    id: "ph-3",
    name: "Tab. Glimepiride 1mg",
    genericName: "Glimepiride IP 1mg",
    category: "DIABETES",
    categoryLabel: "Diabetes",
    dosage: "1mg",
    frequency: "1-0-0 (Morning)",
    duration: "30 Days",
    instructions: "Take with morning breakfast",
    janAushadhiPrice: "₹14.00",
    brandedPrice: "₹85.00",
    savings: "84%",
    stock: 450
  },
  {
    id: "ph-4",
    name: "Tab. Amlodipine 5mg",
    genericName: "Amlodipine Besylate IP 5mg",
    category: "CARDIAC",
    categoryLabel: "Cardio & BP",
    dosage: "5mg",
    frequency: "1-0-0 (Morning)",
    duration: "30 Days",
    instructions: "After breakfast. Monitor BP weekly",
    janAushadhiPrice: "₹4.50",
    brandedPrice: "₹68.00",
    savings: "93%",
    stock: 620
  },
  {
    id: "ph-5",
    name: "Tab. Telmisartan 40mg",
    genericName: "Telmisartan IP 40mg",
    category: "CARDIAC",
    categoryLabel: "Cardio & BP",
    dosage: "40mg",
    frequency: "0-0-1 (Bedtime)",
    duration: "30 Days",
    instructions: "At night before sleeping",
    janAushadhiPrice: "₹12.00",
    brandedPrice: "₹110.00",
    savings: "89%",
    stock: 840
  },
  {
    id: "ph-6",
    name: "Tab. Ecosprin 75mg",
    genericName: "Aspirin Gastro-resistant 75mg",
    category: "CARDIAC",
    categoryLabel: "Cardio & BP",
    dosage: "75mg",
    frequency: "0-1-0 (Afternoon)",
    duration: "30 Days",
    instructions: "Always after lunch. Do not take on empty stomach",
    janAushadhiPrice: "₹5.20",
    brandedPrice: "₹38.00",
    savings: "86%",
    stock: 740
  },
  {
    id: "ph-7",
    name: "Tab. Pantoprazole 40mg",
    genericName: "Pantoprazole Sodium IP 40mg",
    category: "GI",
    categoryLabel: "Gastric & Acidity",
    dosage: "40mg",
    frequency: "1-0-0 (Morning)",
    duration: "14 Days",
    instructions: "30 mins before breakfast on empty stomach",
    janAushadhiPrice: "₹8.50",
    brandedPrice: "₹75.00",
    savings: "88%",
    stock: 780
  },
  {
    id: "ph-8",
    name: "Syp. Antacid Gel 200ml",
    genericName: "Magaldrate + Simethicone Oral Susp.",
    category: "GI",
    categoryLabel: "Gastric & Acidity",
    dosage: "10ml",
    frequency: "1-0-1 (After meals)",
    duration: "7 Days",
    instructions: "Shake bottle well before use",
    janAushadhiPrice: "₹24.00",
    brandedPrice: "₹115.00",
    savings: "79%",
    stock: 310
  },
  {
    id: "ph-9",
    name: "Oral Rehydration Salts (WHO)",
    genericName: "Electrolyte ORS Sachet 21.8g",
    category: "GI",
    categoryLabel: "Gastric & Acidity",
    dosage: "1 Sachet",
    frequency: "Daily in 1L Water",
    duration: "3 Days",
    instructions: "Dissolve entire pack in 1L clean drinking water",
    janAushadhiPrice: "₹4.00",
    brandedPrice: "₹22.00",
    savings: "82%",
    stock: 850
  },
  {
    id: "ph-10",
    name: "Cap. Amoxicillin 500mg",
    genericName: "Amoxicillin Trihydrate IP 500mg",
    category: "ANTIBIOTIC",
    categoryLabel: "Antibiotics",
    dosage: "500mg",
    frequency: "1-0-1 (BD)",
    duration: "5 Days",
    instructions: "Complete entire 5-day course. Do not stop midway",
    janAushadhiPrice: "₹16.00",
    brandedPrice: "₹110.00",
    savings: "85%",
    stock: 480
  },
  {
    id: "ph-11",
    name: "Tab. Azithromycin 500mg",
    genericName: "Azithromycin Dihydrate IP 500mg",
    category: "ANTIBIOTIC",
    categoryLabel: "Antibiotics",
    dosage: "500mg",
    frequency: "1-0-0 (OD)",
    duration: "3 Days",
    instructions: "Take 1 hour before or 2 hours after food",
    janAushadhiPrice: "₹28.00",
    brandedPrice: "₹140.00",
    savings: "80%",
    stock: 360
  },
  {
    id: "ph-12",
    name: "Tab. Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride IP 10mg",
    category: "ALLERGY",
    categoryLabel: "Allergy & Derm",
    dosage: "10mg",
    frequency: "0-0-1 (Bedtime)",
    duration: "5 Days",
    instructions: "May cause drowsiness. Take at night",
    janAushadhiPrice: "₹3.80",
    brandedPrice: "₹38.00",
    savings: "90%",
    stock: 920
  }
];

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
  const [activeTab, setActiveTab] = useState<"rx" | "history" | "labs">("rx");
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  const currentPatientLabs = getPatientLabReports({
    id: selectedPatient.id,
    abhaId: selectedPatient.abhaId,
    name: selectedPatient.name
  });

  // Medication list for current prescription
  const [medications, setMedications] = useState<MedicationItem[]>(INITIAL_QUEUE[0].defaultMedications);
  const [clinicalAdvice, setClinicalAdvice] = useState(
    "1. Avoid oily & high-salt foods.\n2. Hydrate well with minimum 2.5L water/day.\n3. Return immediately to PHC if chest discomfort increases."
  );
  const [followupDays, setFollowupDays] = useState("7");
  const [isSigned, setIsSigned] = useState(false);

  // Pharmacy Formulary State for Prescription Pad
  const [pharmacySearch, setPharmacySearch] = useState("");
  const [pharmacyCategory, setPharmacyCategory] = useState<string>("ALL");
  const [showPharmacyDrawer, setShowPharmacyDrawer] = useState(true);
  const [addedDrugToast, setAddedDrugToast] = useState<string | null>(null);

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

  // Add directly from hospital pharmacy stock with 1-click
  const handleAddFromPharmacy = (drug: PharmacyFormularyDrug) => {
    const newMed: MedicationItem = {
      id: `rx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: drug.name,
      genericName: drug.genericName,
      dosage: drug.dosage,
      frequency: drug.frequency,
      duration: drug.duration,
      instructions: drug.instructions,
      janAushadhiPrice: drug.janAushadhiPrice
    };
    setMedications(prev => [...prev, newMed]);
    setAddedDrugToast(`✓ Added ${drug.name} to prescription (${drug.janAushadhiPrice})`);
    setTimeout(() => setAddedDrugToast(null), 3000);
  };

  // Filtered pharmacy drugs
  const filteredPharmacyDrugs = PHC_PHARMACY_DRUGS.filter(d => {
    const matchesCat = pharmacyCategory === "ALL" || d.category === pharmacyCategory;
    const matchesQuery =
      !pharmacySearch ||
      d.name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
      d.genericName.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
      d.categoryLabel.toLowerCase().includes(pharmacySearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

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
                    <div className="flex items-center space-x-1.5">
                      <span className="inline-flex items-center space-x-0.5 text-[9px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/50 font-medium">
                        <FlaskConical className="w-2.5 h-2.5" />
                        <span>Labs</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{pat.time}</span>
                      </span>
                    </div>
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
                  onClick={() => setActiveTab("labs")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer border ${
                    activeTab === "labs"
                      ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                      : "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Lab Reports ({currentPatientLabs.length})</span>
                </button>

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
                <button
                  onClick={() => setActiveTab("labs")}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center space-x-1.5 ${
                    activeTab === "labs"
                      ? "border-teal-600 text-teal-600"
                      : "border-transparent text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Lab Reports & Diagnostics</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === "labs" ? "bg-teal-100 text-teal-800" : "bg-slate-100 text-slate-600"
                  }`}>
                    {currentPatientLabs.length}
                  </span>
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
                {/* 1. SIMPLE INTEGRATED PHARMACY & IN-STOCK JAN AUSHADHI FORMULARY */}
                <div className="bg-gradient-to-r from-teal-50/70 via-blue-50/50 to-slate-50 border border-teal-200/80 rounded-xl p-3.5 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <Pill className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-xs text-slate-900">
                            PHC Dispensary & Jan Aushadhi Formulary
                          </h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            ● In-Stock ({filteredPharmacyDrugs.length})
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Click any generic medicine below to drop into prescription with standard dosage & Jan Aushadhi cost
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPharmacyDrawer(!showPharmacyDrawer)}
                      className="text-[11px] font-semibold text-teal-700 bg-white hover:bg-teal-50 border border-teal-300 px-2.5 py-1 rounded-lg transition flex items-center space-x-1 cursor-pointer shadow-2xs"
                    >
                      <span>{showPharmacyDrawer ? "Hide Pharmacy" : "Browse Pharmacy Stock"}</span>
                      {showPharmacyDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {showPharmacyDrawer && (
                    <div className="space-y-2.5 pt-1">
                      {/* Search & Category Filter Pills */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                        <div className="relative flex-1 max-w-xs">
                          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={pharmacySearch}
                            onChange={(e) => setPharmacySearch(e.target.value)}
                            placeholder="Search salt or drug (e.g. Metformin, Amlodipine)..."
                            className="w-full pl-7.5 pr-2 py-1 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-teal-500 transition"
                          />
                        </div>

                        <div className="flex items-center space-x-1 overflow-x-auto pb-0.5">
                          {[
                            { id: "ALL", label: "All" },
                            { id: "FEVER", label: "Fever/Pain" },
                            { id: "DIABETES", label: "Diabetes" },
                            { id: "CARDIAC", label: "Cardio/BP" },
                            { id: "GI", label: "Gastric" },
                            { id: "ANTIBIOTIC", label: "Antibiotics" },
                            { id: "ALLERGY", label: "Allergy" }
                          ].map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setPharmacyCategory(cat.id)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-md transition shrink-0 cursor-pointer ${
                                pharmacyCategory === cat.id
                                  ? "bg-slate-900 text-white"
                                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Toast Feedback */}
                      {addedDrugToast && (
                        <div className="bg-emerald-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                          <span>{addedDrugToast}</span>
                        </div>
                      )}

                      {/* Compact Drug Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                        {filteredPharmacyDrugs.map((drug) => {
                          const isAlreadyAdded = medications.some(m => m.name.toLowerCase().includes(drug.name.toLowerCase().split(' ')[1] || 'xyz'));
                          return (
                            <div
                              key={drug.id}
                              className="bg-white p-2.5 rounded-lg border border-slate-200/90 hover:border-teal-400 transition flex flex-col justify-between space-y-1.5 shadow-2xs"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-bold text-xs text-slate-900 truncate">
                                    {drug.name}
                                  </span>
                                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/50 shrink-0">
                                    ● {drug.stock} in stock
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-500 line-clamp-1">{drug.genericName}</p>
                                <div className="flex items-center justify-between text-[10px] mt-1 text-slate-500">
                                  <span>{drug.dosage} • {drug.frequency}</span>
                                  <span className="text-teal-700 font-bold font-mono">{drug.janAushadhiPrice}</span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleAddFromPharmacy(drug)}
                                className={`w-full py-1 px-2 rounded text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                                  isAlreadyAdded
                                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                                    : "bg-teal-600 hover:bg-teal-700 text-white shadow-2xs"
                                }`}
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isAlreadyAdded ? "+ Add Another" : "+ Add to Rx"}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Medications Table */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-800">Prescribed Generic Medications ({medications.length})</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold border border-emerald-200/60">
                        PMBJP Jan Aushadhi Formulary
                      </span>
                    </div>
                    <button
                      onClick={handleAddMedication}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Custom Medicine</span>
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
            ) : activeTab === "history" ? (
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
            ) : (
              /* TAB CONTENT: LAB REPORTS & DIAGNOSTICS */
              <div className="p-4 space-y-4 text-xs">
                {/* Header & Quick Action */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                      <FlaskConical className="w-4 h-4 text-teal-600" />
                      <span>Diagnostic Lab Reports for {selectedPatient.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      National Essential Diagnostics List (EDL) & ABDM Verified Pathology
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsLabModalOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Order New Lab Test</span>
                    </button>

                    <button
                      onClick={() => setIsLabModalOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Full Dossier</span>
                    </button>
                  </div>
                </div>

                {/* List of Reports */}
                <div className="space-y-3">
                  {currentPatientLabs.map((rep) => (
                    <div
                      key={rep.id}
                      className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 space-y-3 hover:bg-white transition"
                    >
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {rep.testName}
                            </span>
                            <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                              {rep.reportNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {rep.facility} • Specimen: <strong>{rep.sampleType}</strong> • Verified: {rep.verifiedAt}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              rep.overallStatus === "CRITICAL"
                                ? "bg-red-100 text-red-700 animate-pulse"
                                : rep.overallStatus === "ABNORMAL"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {rep.overallStatus}
                          </span>

                          <button
                            onClick={() => setIsLabModalOpen(true)}
                            className="text-teal-700 hover:text-teal-800 font-semibold text-[11px] hover:underline cursor-pointer"
                          >
                            Inspect &rarr;
                          </button>
                        </div>
                      </div>

                      {/* Parameters Preview Table */}
                      <div className="bg-white rounded-lg border border-slate-200/80 overflow-hidden">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-100/70 text-[9px] uppercase font-bold text-slate-500 border-b border-slate-200">
                              <th className="py-1.5 px-2.5">Parameter</th>
                              <th className="py-1.5 px-2.5">Result</th>
                              <th className="py-1.5 px-2.5">Ref Interval</th>
                              <th className="py-1.5 px-2.5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {rep.parameters.map((param, pIdx) => (
                              <tr key={pIdx}>
                                <td className="py-1.5 px-2.5 font-medium text-slate-800">{param.name}</td>
                                <td className="py-1.5 px-2.5 font-bold font-mono">
                                  <span className={param.status !== 'NORMAL' ? 'text-amber-800' : 'text-slate-900'}>
                                    {param.value} {param.unit}
                                  </span>
                                </td>
                                <td className="py-1.5 px-2.5 text-slate-400">{param.referenceRange}</td>
                                <td className="py-1.5 px-2.5 text-right">
                                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                                    param.status === 'NORMAL' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
                                  }`}>
                                    {param.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {rep.clinicalNotes && (
                        <p className="text-[10px] text-slate-600 bg-white/60 p-2 rounded border border-slate-200/50 italic">
                          Remark: {rep.clinicalNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reusable Patient Lab Reports Modal */}
      <PatientLabReportsModal
        isOpen={isLabModalOpen}
        onClose={() => setIsLabModalOpen(false)}
        patient={selectedPatient}
        allowOrderTests={true}
      />
    </div>
  );
};

export default DoctorDashboard;
