import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  QrCode,
  Mic,
  Phone,
  Search,
  Plus,
  Heart,
  Siren,
  MapPin,
  Check,
  X,
  Stethoscope,
  Baby,
  ShieldCheck,
  Activity,
  Calendar,
  Pill,
  Syringe,
  Package,
  FileText,
  AlertCircle,
  Zap,
  Globe,
} from "lucide-react";
import { changeLanguage } from "../lib/i18n";
import { QRScanner } from "../components/QRScanner";
import { VoiceIntakeModal } from "../components/voice/VoiceIntakeModal";
import { SosEmergencyModal } from "../components/SosEmergencyModal";
import {
  EmergencyPhcBookingModal,
  EmergencyPatientInfo,
} from "../components/EmergencyPhcBookingModal";

/* ───────────────────────────── Types ───────────────────────────── */

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: "F" | "M";
  house: string;
  phone: string;
  abhaId?: string;
  category: "HIGH_RISK" | "ANC" | "NCD" | "INFANT" | "ROUTINE";
  condition: string;
  status: string;
  dueToday: boolean;
  completedToday?: boolean;

  // Tab 1: Vitals & Health Check
  vitals: {
    bp?: string;
    spo2?: string;
    sugar?: string;
    hb?: string;
    temp?: string;
    weight?: string;
  };

  // Tab 2: Maternal / ANC
  maternal?: {
    isPregnant?: boolean;
    trimester?: "1st Trimester" | "2nd Trimester" | "3rd Trimester" | "Postnatal (PNC)";
    weeks?: number;
    edd?: string;
    highRiskFlags?: string[];
    tdVaccineGiven?: boolean;
    ifaTabletsIssued?: number;
  };

  // Tab 3: Child Immunization
  immunization?: {
    isChild?: boolean;
    childDob?: string;
    vaccinesGiven?: string[];
    vaccinesDue?: string[];
    nutritionStatus?: "Normal" | "Moderate (MAM)" | "Severe (SAM)";
  };

  // Tab 4: NCD & Chronic Care
  ncd?: {
    hasHypertension?: boolean;
    hasDiabetes?: boolean;
    medicationAdherence?: "Regular" | "Irregular" | "Stopped";
    monthlyMedsDelivered?: boolean;
    lifestyleCounseling?: boolean;
  };

  // Tab 5: Supplies, Services & Referral
  services?: {
    suppliesGiven?: string[];
    referralStatus?: "None" | "PHC Doctor Referral" | "108 Emergency Ambulance";
    nextVisitDate?: string;
    remarks?: string;
  };
}

/* ──────────────────────── Sample Initial Data ──────────────────────── */

const INITIAL_PATIENTS: PatientData[] = [
  {
    id: "P-401",
    name: "Kavita Ramesh Shinde",
    age: 26,
    gender: "F",
    house: "H-42",
    phone: "+91 98234 11204",
    abhaId: "91-4829-1029-4412",
    category: "HIGH_RISK",
    condition: "Pregnancy Induced Hypertension",
    status: "Follow-up BP Check Due",
    dueToday: true,
    vitals: { bp: "150/95", spo2: "98%", temp: "98.4", hb: "10.2", weight: "58" },
    maternal: {
      isPregnant: true,
      trimester: "3rd Trimester",
      weeks: 34,
      edd: "2026-11-15",
      highRiskFlags: ["Gestational Hypertension", "Edema in feet"],
      tdVaccineGiven: true,
      ifaTabletsIssued: 60,
    },
    services: {
      suppliesGiven: ["IFA Iron Tablets", "Calcium Supplement", "Nutrition Counseling"],
      referralStatus: "PHC Doctor Referral",
      nextVisitDate: "2026-09-28",
      remarks: "High BP noted. Advised strict salt restriction and PHC checkup on Monday.",
    },
  },
  {
    id: "P-402",
    name: "Sita Devi",
    age: 34,
    gender: "F",
    house: "H-04",
    phone: "+91 94210 99812",
    abhaId: "91-1204-9843-1184",
    category: "HIGH_RISK",
    condition: "Severe Anemia (Hb 6.8 g/dL)",
    status: "PHC Referral / 108 Standby",
    dueToday: true,
    vitals: { bp: "118/76", spo2: "97%", temp: "98.2", hb: "6.8", weight: "49" },
    maternal: {
      isPregnant: true,
      trimester: "2nd Trimester",
      weeks: 24,
      edd: "2027-01-10",
      highRiskFlags: ["Severe Anemia (Hb < 7 g/dL)", "Dizziness"],
      tdVaccineGiven: true,
      ifaTabletsIssued: 100,
    },
    services: {
      suppliesGiven: ["IFA Double Dose", "Dietary Counseling"],
      referralStatus: "108 Emergency Ambulance",
      nextVisitDate: "2026-09-25",
      remarks: "Severe pallor observed. Family informed for iron sucrose infusion at Sub-district hospital.",
    },
  },
  {
    id: "P-403",
    name: "Pooja Santosh Jadhav",
    age: 22,
    gender: "F",
    house: "H-88",
    phone: "+91 91580 44219",
    category: "ANC",
    condition: "ANC 3rd Trimester (Week 32)",
    status: "Routine ANC & IFA Distribution",
    dueToday: true,
    vitals: { bp: "122/80", spo2: "99%", temp: "98.6", hb: "11.5", weight: "54" },
    maternal: {
      isPregnant: true,
      trimester: "3rd Trimester",
      weeks: 32,
      edd: "2026-11-28",
      highRiskFlags: [],
      tdVaccineGiven: true,
      ifaTabletsIssued: 30,
    },
    services: {
      suppliesGiven: ["IFA Iron Tablets", "Calcium Supplement", "Nutrition Counseling"],
      referralStatus: "None",
      nextVisitDate: "2026-10-05",
      remarks: "Fetal movements regular. Weight gain healthy.",
    },
  },
  {
    id: "P-404",
    name: "Sunita Anil Gaikwad",
    age: 28,
    gender: "F",
    house: "H-12",
    phone: "+91 98221 55670",
    category: "ANC",
    condition: "ANC 2nd Trimester (Week 22)",
    status: "Td Booster Completed",
    dueToday: false,
    completedToday: true,
    vitals: { bp: "115/75", spo2: "98%", temp: "98.4", hb: "12.0", weight: "52" },
    maternal: {
      isPregnant: true,
      trimester: "2nd Trimester",
      weeks: 22,
      edd: "2027-01-28",
      highRiskFlags: [],
      tdVaccineGiven: true,
      ifaTabletsIssued: 30,
    },
    services: {
      suppliesGiven: ["IFA Iron Tablets", "Calcium Supplement"],
      referralStatus: "None",
      nextVisitDate: "2026-10-12",
      remarks: "Td dose 2 completed.",
    },
  },
  {
    id: "P-405",
    name: "Babanrao Tukaram Patil",
    age: 67,
    gender: "M",
    house: "H-19",
    phone: "+91 97633 88120",
    category: "NCD",
    condition: "Type-2 Diabetes & Hypertension",
    status: "Monthly Meds Delivered",
    dueToday: false,
    completedToday: true,
    vitals: { bp: "142/88", sugar: "210", spo2: "97%", temp: "98.4", weight: "66" },
    ncd: {
      hasHypertension: true,
      hasDiabetes: true,
      medicationAdherence: "Regular",
      monthlyMedsDelivered: true,
      lifestyleCounseling: true,
    },
    services: {
      suppliesGiven: ["BP Check", "Diabetes Counseling"],
      referralStatus: "None",
      nextVisitDate: "2026-10-20",
      remarks: "Metformin & Amlodipine 30 days supplied from PHC quota.",
    },
  },
  {
    id: "P-406",
    name: "Rameshwar Rao",
    age: 59,
    gender: "M",
    house: "H-31",
    phone: "+91 94220 12890",
    category: "NCD",
    condition: "Uncontrolled Hypertension",
    status: "Salt restriction counseling needed",
    dueToday: true,
    vitals: { bp: "155/98", sugar: "135", spo2: "98%", temp: "98.6", weight: "72" },
    ncd: {
      hasHypertension: true,
      hasDiabetes: false,
      medicationAdherence: "Irregular",
      monthlyMedsDelivered: false,
      lifestyleCounseling: true,
    },
    services: {
      suppliesGiven: ["BP Check", "Diet Counseling"],
      referralStatus: "PHC Doctor Referral",
      nextVisitDate: "2026-09-29",
      remarks: "Skipping morning BP dose. Strongly re-counseled.",
    },
  },
  {
    id: "P-407",
    name: "Aarav (Baby of Meena)",
    age: 1,
    gender: "M",
    house: "H-65",
    phone: "+91 98810 43901",
    category: "INFANT",
    condition: "Pentavalent-3 & Rota Vaccine Due",
    status: "Session at Sub-Center Friday",
    dueToday: true,
    vitals: { spo2: "99%", temp: "98.2", weight: "8.5" },
    immunization: {
      isChild: true,
      childDob: "2025-10-12",
      vaccinesGiven: ["BCG", "OPV 0", "OPV 1,2", "Penta 1,2"],
      vaccinesDue: ["Pentavalent-3", "Rotavirus-3", "fIPV-2"],
      nutritionStatus: "Normal",
    },
    services: {
      suppliesGiven: ["Nutrition Counseling", "Vaccine Due Slip Issued"],
      referralStatus: "None",
      nextVisitDate: "2026-09-26",
      remarks: "Mother notified for Friday immunization session at Anganwadi.",
    },
  },
  {
    id: "P-408",
    name: "Radhabai Chander",
    age: 72,
    gender: "F",
    house: "H-09",
    phone: "+91 99750 33412",
    category: "ROUTINE",
    condition: "Geriatric Mobility & Vitals Check",
    status: "Monthly Checkup Done",
    dueToday: false,
    completedToday: true,
    vitals: { bp: "128/82", spo2: "97%", temp: "98.4", weight: "50" },
    services: {
      suppliesGiven: ["BP Check", "General Health Advice"],
      referralStatus: "None",
      nextVisitDate: "2026-10-24",
      remarks: "General condition stable.",
    },
  },
];

/* ──────────────────────── Helper UI Components ──────────────────────── */

const CategoryBadge: React.FC<{ category: PatientData["category"] }> = ({ category }) => {
  const { t } = useTranslation();
  const config: Record<string, { bg: string; text: string; label: string }> = {
    HIGH_RISK: { bg: "bg-red-50 border-red-200", text: "text-red-700", label: t("asha_dashboard.filter_high_risk", "High Risk") },
    ANC: { bg: "bg-violet-50 border-violet-200", text: "text-violet-700", label: t("asha_dashboard.filter_anc", "Maternal ANC") },
    NCD: { bg: "bg-amber-50 border-amber-200", text: "text-amber-700", label: t("asha_dashboard.filter_ncd", "NCD Chronic") },
    INFANT: { bg: "bg-sky-50 border-sky-200", text: "text-sky-700", label: t("asha_dashboard.filter_child", "Child Health") },
    ROUTINE: { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", label: t("asha_dashboard.filter_all", "Routine") },
  };
  const c = config[category] || config.ROUTINE;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
};

const VitalChip: React.FC<{ label: string; value: string; alert?: boolean }> = ({ label, value, alert }) => (
  <span
    className={`inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
      alert ? "bg-red-50 text-red-700 font-bold border border-red-200" : "bg-slate-100 text-slate-700"
    }`}
  >
    <span className="text-[10px] opacity-60 uppercase">{label}</span>
    {value}
  </span>
);

/* Translate demo patient medical conditions */
const translateCondition = (cond: string, t: any) => {
  if (cond.includes("Severe Anemia") || cond.includes("High Risk Pregnancy")) {
    return t("asha_dashboard.cond_anemia", cond);
  }
  if (cond.includes("Hypertension")) {
    return t("asha_dashboard.cond_hypertension", cond);
  }
  if (cond.includes("Pentavalent") || cond.includes("Vaccine Due")) {
    return t("asha_dashboard.cond_infant", cond);
  }
  if (cond.includes("Geriatric") || cond.includes("Mobility")) {
    return t("asha_dashboard.cond_geriatric", cond);
  }
  return cond;
};

/* Translate demo patient medical status messages */
const translateStatus = (stat: string, t: any) => {
  if (stat.includes("Referral Sent to PHC")) {
    return t("asha_dashboard.status_anemia", stat);
  }
  if (stat.includes("Salt restriction")) {
    return t("asha_dashboard.status_hypertension", stat);
  }
  if (stat.includes("Sub-Center") || stat.includes("Friday")) {
    return t("asha_dashboard.status_infant", stat);
  }
  if (stat.includes("Monthly Checkup Done")) {
    return t("asha_dashboard.status_geriatric", stat);
  }
  return stat;
};

/* ────────────────────────── Main Component ─────────────────────────── */

export const AshaDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncCount, setPendingSyncCount] = useState(3);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filter tabs
  const [activeFilter, setActiveFilter] = useState<"ALL" | "HIGH_RISK" | "ANC" | "INFANT" | "NCD" | "DUE">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & Active Record
  const [showScanner, setShowScanner] = useState(false);
  const [showVoiceIntake, setShowVoiceIntake] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [modalActiveTab, setModalActiveTab] = useState<"VITALS" | "MATERNAL" | "CHILD" | "NCD" | "SUPPLIES">("VITALS");

  // Emergency PHC Fast-Track Booking
  const [emergencyPatient, setEmergencyPatient] = useState<EmergencyPatientInfo | null>(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Current Patient being edited / created
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);

  // Form State for editing patient tabs
  const [formData, setFormData] = useState<Partial<PatientData>>({
    name: "",
    house: "",
    age: 25,
    gender: "F",
    phone: "",
    category: "ROUTINE",
    vitals: { bp: "120/80", sugar: "100", spo2: "98", hb: "12.0", temp: "98.4", weight: "55" },
    maternal: { isPregnant: false, trimester: "2nd Trimester", weeks: 20, edd: "", highRiskFlags: [], tdVaccineGiven: false, ifaTabletsIssued: 30 },
    immunization: { isChild: false, childDob: "", vaccinesGiven: [], vaccinesDue: [], nutritionStatus: "Normal" },
    ncd: { hasHypertension: false, hasDiabetes: false, medicationAdherence: "Regular", monthlyMedsDelivered: false, lifestyleCounseling: false },
    services: { suppliesGiven: [], referralStatus: "None", nextVisitDate: "", remarks: "" },
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [patients, setPatients] = useState<PatientData[]>(INITIAL_PATIENTS);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncNow = () => {
    if (pendingSyncCount === 0) {
      showToast("All records are up to date.");
      return;
    }
    setIsSyncing(true);
    setTimeout(() => {
      setPendingSyncCount(0);
      setIsSyncing(false);
      showToast("All field records synced to National Health Cloud.");
    }, 1200);
  };

  const handleOpenEmergencyModal = (patient: any) => {
    setEmergencyPatient({
      id: patient.id,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      house: patient.house,
      phone: patient.phone,
      condition: patient.condition,
      highRiskReason: patient.maternal?.highRiskFlags?.join(", ") || patient.condition || "High Risk Patient",
      vitalsSummary: `BP: ${patient.vitals?.bp || "N/A"} • SpO2: ${patient.vitals?.spo2 || "N/A"} • Sugar: ${patient.vitals?.sugar || "N/A"}`,
    });
    setShowEmergencyModal(true);
  };

  // Open the structured modal for a patient
  const handleOpenModal = (patient?: PatientData, initialTab: "VITALS" | "MATERNAL" | "CHILD" | "NCD" | "SUPPLIES" = "VITALS") => {
    if (patient) {
      setCurrentPatient(patient);
      setFormData(JSON.parse(JSON.stringify(patient)));
      // Auto pick best tab if patient is ANC or Infant
      if (patient.category === "ANC") setModalActiveTab("MATERNAL");
      else if (patient.category === "INFANT") setModalActiveTab("CHILD");
      else if (patient.category === "NCD") setModalActiveTab("NCD");
      else setModalActiveTab(initialTab);
    } else {
      setCurrentPatient(null);
      setFormData({
        id: `P-${Date.now().toString().slice(-3)}`,
        name: "",
        house: "",
        age: 26,
        gender: "F",
        phone: "+91 ",
        category: "ROUTINE",
        condition: "Field Health Checkup",
        status: "Recorded by ASHA",
        dueToday: false,
        vitals: { bp: "120/80", sugar: "100", spo2: "98", hb: "11.5", temp: "98.4", weight: "52" },
        maternal: { isPregnant: false, trimester: "2nd Trimester", weeks: 20, edd: "", highRiskFlags: [], tdVaccineGiven: false, ifaTabletsIssued: 30 },
        immunization: { isChild: false, childDob: "", vaccinesGiven: [], vaccinesDue: [], nutritionStatus: "Normal" },
        ncd: { hasHypertension: false, hasDiabetes: false, medicationAdherence: "Regular", monthlyMedsDelivered: false, lifestyleCounseling: false },
        services: { suppliesGiven: ["Nutrition Counseling"], referralStatus: "None", nextVisitDate: "", remarks: "" },
      });
      setModalActiveTab("VITALS");
    }
    setShowRecordModal(true);
  };

  // Save the complete patient record
  const handleSaveRecord = () => {
    if (!formData.name?.trim()) {
      alert("Please enter patient name.");
      return;
    }

    // Determine category based on tabs data if not explicitly set
    let cat = formData.category || "ROUTINE";
    if (formData.maternal?.isPregnant) {
      cat = formData.maternal.highRiskFlags?.length ? "HIGH_RISK" : "ANC";
    } else if (formData.immunization?.isChild) {
      cat = "INFANT";
    } else if (formData.ncd?.hasHypertension || formData.ncd?.hasDiabetes) {
      cat = "NCD";
    }

    const updatedRecord: PatientData = {
      ...((formData as PatientData) || {}),
      category: cat,
      completedToday: true,
      dueToday: false,
      status: "Visit & Records Updated Today",
    };

    if (currentPatient) {
      setPatients((prev) => prev.map((p) => (p.id === currentPatient.id ? updatedRecord : p)));
    } else {
      setPatients((prev) => [updatedRecord, ...prev]);
    }

    setPendingSyncCount((prev) => prev + 1);
    setShowRecordModal(false);
    showToast(`Saved complete health records for ${updatedRecord.name}.`);
  };

  const handleQrScanned = (code: string) => {
    setShowScanner(false);
    showToast(`ABHA QR Scanned: ${code.slice(0, 18)}… Patient linked.`);
  };

  const handleApplyVoiceIntake = (intakeData: any) => {
    setShowVoiceIntake(false);
    showToast(`Voice intake recorded.`);
    handleOpenModal();
    if (intakeData.vitalsHint?.bp) {
      setFormData((prev) => ({
        ...prev,
        vitals: { ...prev.vitals, bp: intakeData.vitalsHint.bp },
        services: { ...prev.services, remarks: intakeData.chiefComplaints || "" },
      }));
    }
  };

  /* ── Filtered list ── */
  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q || p.name.toLowerCase().includes(q) || p.house.toLowerCase().includes(q) || p.phone.includes(searchQuery);
    if (!matchesSearch) return false;
    if (activeFilter === "HIGH_RISK") return p.category === "HIGH_RISK";
    if (activeFilter === "ANC") return p.category === "ANC" || p.maternal?.isPregnant;
    if (activeFilter === "INFANT") return p.category === "INFANT" || p.immunization?.isChild;
    if (activeFilter === "NCD") return p.category === "NCD" || p.ncd?.hasHypertension || p.ncd?.hasDiabetes;
    if (activeFilter === "DUE") return p.dueToday;
    return true;
  });

  const highRiskCount = patients.filter((p) => p.category === "HIGH_RISK").length;
  const ancCount = patients.filter((p) => p.category === "ANC" || p.maternal?.isPregnant).length;
  const infantCount = patients.filter((p) => p.category === "INFANT" || p.immunization?.isChild).length;
  const ncdCount = patients.filter((p) => p.category === "NCD" || p.ncd?.hasHypertension || p.ncd?.hasDiabetes).length;
  const dueCount = patients.filter((p) => p.dueToday).length;

  const isHighBp = (bp?: string) => {
    if (!bp) return false;
    const sys = parseInt(bp.split("/")[0]);
    return sys >= 140;
  };

  /* ── Quick Tab Selector in Modal ── */
  const modalTabs = [
    { id: "VITALS", label: t("asha_dashboard.tab_vitals", "General & Vitals"), icon: Stethoscope },
    { id: "MATERNAL", label: t("asha_dashboard.tab_maternal", "Maternal & ANC"), icon: Baby },
    { id: "CHILD", label: t("asha_dashboard.tab_child", "Child Vaccine"), icon: Syringe },
    { id: "NCD", label: t("asha_dashboard.tab_ncd", "NCD & Chronic"), icon: Heart },
    { id: "SUPPLIES", label: t("asha_dashboard.tab_supplies", "Supplies & Referral"), icon: Package },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-16">
      {/* ─── Toast ─── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white pl-4 pr-3 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs font-semibold max-w-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ━━━━━━━ 1. MINIMAL HEADER BAR ━━━━━━━ */}
      <section className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
              RB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base">
                  {t('asha_dashboard.worker_title', 'Rekha Bai (ASHA)')}
                </h1>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {t('asha_dashboard.ward_badge', 'Ward 4 Sinnar')}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                >
                  <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span className={isOnline ? "text-emerald-700" : "text-amber-700"}>
                    {isOnline ? t('asha_dashboard.online_sync', 'Online Sync Active') : t('asha_dashboard.offline_mode', 'Offline Local Mode')}
                  </span>
                </button>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{pendingSyncCount} {t('asha_dashboard.sync_pending', 'changes to sync')}</span>
              </div>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end">
            {/* Direct Language Switcher Pill inside ASHA Station */}
            <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 mr-1 hidden sm:inline" />
              {(['en', 'hi', 'mr'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => changeLanguage(lang)}
                  className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    (i18n.language === lang || (!i18n.language && lang === 'en'))
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowScanner(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 transition cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              <span>{t('asha_dashboard.scan_abha', 'Scan ABHA')}</span>
            </button>
            <button
              onClick={() => setShowVoiceIntake(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-2 rounded-lg border border-violet-200 transition cursor-pointer"
            >
              <Mic className="w-4 h-4 text-violet-600" />
              <span>{t('asha_dashboard.voice', 'Voice')}</span>
            </button>
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition cursor-pointer ${
                pendingSyncCount > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? t('asha_dashboard.syncing', 'Syncing…') : pendingSyncCount > 0 ? `${t('asha_dashboard.sync_now', 'Sync')} (${pendingSyncCount})` : t('asha_dashboard.synced', 'Synced')}</span>
            </button>
            <button
              onClick={() => setShowSosModal(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Siren className="w-4 h-4" />
              <span>{t('asha_dashboard.sos_108', '108 SOS')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ━━━━━━━ 2. CLEAN STATS OVERVIEW ━━━━━━━ */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { label: t('asha_dashboard.stat_households', 'Assigned Households'), count: patients.length, filter: "ALL" as const, color: "text-slate-900", icon: Users },
          { label: t('asha_dashboard.stat_high_risk', 'High Risk Cases'), count: highRiskCount, filter: "HIGH_RISK" as const, color: "text-red-600", icon: AlertTriangle },
          { label: t('asha_dashboard.stat_maternal', 'Maternal & ANC'), count: ancCount, filter: "ANC" as const, color: "text-violet-600", icon: Baby },
          { label: t('asha_dashboard.stat_due_today', 'Visits Due Today'), count: dueCount, filter: "DUE" as const, color: "text-blue-600", icon: Calendar },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeFilter === item.filter;
          return (
            <button
              key={item.label}
              onClick={() => setActiveFilter(item.filter)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                isActive
                  ? "border-blue-500 bg-blue-50/40 ring-1 ring-blue-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div>
                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${item.color}`}>{item.count}</p>
              </div>
              <Icon className={`w-5 h-5 opacity-40 ${item.color}`} />
            </button>
          );
        })}
      </section>

      {/* ━━━━━━━ 3. SEARCH & CATEGORY TABS ━━━━━━━ */}
      <section className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('asha_dashboard.search_placeholder', 'Search by resident name, house #, or phone...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-400 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition shadow-xs cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('asha_dashboard.record_checkup', '+ Add Patient')}</span>
          </button>
        </div>

        {/* Tab Filters for ASHA Patient Segments */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {[
            { id: "ALL", label: `${t('asha_dashboard.filter_all', 'All Patients')} (${patients.length})` },
            { id: "HIGH_RISK", label: `🚨 ${t('asha_dashboard.filter_high_risk', 'High Risk')} (${highRiskCount})` },
            { id: "ANC", label: `🤰 ${t('asha_dashboard.filter_anc', 'Maternal ANC')} (${ancCount})` },
            { id: "INFANT", label: `👶 ${t('asha_dashboard.filter_child', 'Child Vaccine')} (${infantCount})` },
            { id: "NCD", label: `💊 ${t('asha_dashboard.filter_ncd', 'NCD & BP/Sugar')} (${ncdCount})` },
            { id: "DUE", label: `🕒 ${t('asha_dashboard.filter_due', 'Due Today')} (${dueCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* ━━━━━━━ 4. PATIENT LIST WITH EXPANDABLE DATA ━━━━━━━ */}
      <section className="space-y-2.5">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">{t('asha_dashboard.no_records', 'No patient records found')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{t('asha_dashboard.no_records_sub', 'Try searching with another keyword or reset the filter.')}</p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isHigh = patient.category === "HIGH_RISK";
            const isAnc = patient.category === "ANC" || patient.maternal?.isPregnant;
            const isChild = patient.category === "INFANT" || patient.immunization?.isChild;

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-xl border p-3.5 sm:p-4 transition hover:shadow-xs ${
                  isHigh ? "border-red-200" : isAnc ? "border-violet-200" : "border-slate-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Left: Patient Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900">{patient.name}</h3>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {patient.age}y · {patient.gender === "F" ? t('asha_dashboard.female', 'Female') : t('asha_dashboard.male', 'Male')}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5 text-slate-400" />
                        {patient.house}
                      </span>
                      <CategoryBadge category={patient.category} />
                      {patient.completedToday && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> {t('asha_dashboard.checked_today', 'Checked Today')}
                        </span>
                      )}
                    </div>

                    {/* Condition Summary */}
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-800">{translateCondition(patient.condition, t)}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">{translateStatus(patient.status, t)}</span>
                    </div>

                    {/* Vital Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {patient.vitals?.bp && (
                        <VitalChip label="BP" value={patient.vitals.bp} alert={isHighBp(patient.vitals.bp)} />
                      )}
                      {patient.vitals?.sugar && <VitalChip label="Sugar" value={`${patient.vitals.sugar} mg/dL`} />}
                      {patient.vitals?.hb && <VitalChip label="Hb" value={`${patient.vitals.hb} g/dL`} alert={parseFloat(patient.vitals.hb) < 10} />}
                      {patient.vitals?.spo2 && <VitalChip label="SpO2" value={`${patient.vitals.spo2}%`} />}

                      {/* Maternal tag summary */}
                      {isAnc && patient.maternal?.weeks && (
                        <span className="text-[11px] font-semibold bg-violet-50 text-violet-800 px-2 py-0.5 rounded border border-violet-200">
                          {t('asha_dashboard.week', 'Week')} {patient.maternal.weeks} ({patient.maternal.trimester})
                        </span>
                      )}

                      {/* Vaccine tag summary */}
                      {isChild && patient.immunization?.vaccinesDue?.[0] && (
                        <span className="text-[11px] font-semibold bg-sky-50 text-sky-800 px-2 py-0.5 rounded border border-sky-200">
                          {t('asha_dashboard.due', 'Due')}: {patient.immunization.vaccinesDue[0]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Phone + SOS + Open Record Tabs */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <a
                      href={`tel:${patient.phone}`}
                      className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                      title={t('asha_dashboard.call_patient', 'Call Patient')}
                    >
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </a>

                    {isHigh && (
                      <>
                        <button
                          onClick={() => handleOpenEmergencyModal(patient)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
                          title="Instant Emergency PHC Appointment"
                        >
                          <Zap className="w-3.5 h-3.5 fill-white" />
                          <span className="hidden sm:inline">{t('asha_dashboard.book_phc_btn', 'Book Emergency PHC')}</span>
                          <span className="sm:hidden">PHC</span>
                        </button>
                        <button
                          onClick={() => setShowSosModal(true)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition cursor-pointer"
                          title="108 Emergency Referral"
                        >
                          <Siren className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Button to open full structured record modal */}
                    <button
                      onClick={() => handleOpenModal(patient)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      <span>{t('asha_dashboard.record_view_tabs', 'Record & View Tabs')}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ━━━━━━━ 5. STRUCTURED PATIENT DATA MODAL WITH ALL ASHA TABS ━━━━━━━ */}
      {showRecordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-6 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900 text-base">
                  {currentPatient
                    ? t('asha_dashboard.modal_title_edit', 'Patient Record: {{name}}', { name: formData.name })
                    : t('asha_dashboard.modal_title_new', 'New Patient Health Record')}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {t('asha_dashboard.modal_subtitle', 'Complete offline-ready health entry for ASHA field worker')}
                </p>
              </div>
              <button
                onClick={() => setShowRecordModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Identification Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="col-span-2 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t('asha_dashboard.patient_full_name', 'Patient Full Name')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kavita Shinde"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t('asha_dashboard.house_number', 'House Number')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. H-42"
                  value={formData.house || ""}
                  onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">
                  {t('asha_dashboard.age_gender', 'Age & Gender')}
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    value={formData.age || 25}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
                    className="w-14 p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                  <select
                    value={formData.gender || "F"}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as "F" | "M" })}
                    className="p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                  >
                    <option value="F">{t('asha_dashboard.female', 'Female')}</option>
                    <option value="M">{t('asha_dashboard.male', 'Male')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TAB SELECTOR HEADER FOR COMPLETE PATIENT DATA */}
            <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
              {modalTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = modalActiveTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg font-bold transition cursor-pointer border-b-2 whitespace-nowrap ${
                      isActive
                        ? "border-blue-600 text-blue-700 bg-blue-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ──────── TAB 1: VITALS & HEALTH CHECK ──────── */}
            {modalActiveTab === "VITALS" && (
              <div className="space-y-3.5 pt-1">
                {/* Blood Pressure Presets + Custom Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{t('asha_dashboard.blood_pressure', 'Blood Pressure')}: {formData.vitals?.bp || "120/80"} mmHg</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: t('asha_dashboard.bp_normal', 'Normal (120/80)'), val: "120/80" },
                      { label: t('asha_dashboard.bp_borderline', 'Borderline (135/88)'), val: "135/88" },
                      { label: t('asha_dashboard.bp_high', 'High (150/95)'), val: "150/95" },
                    ].map((bp) => (
                      <button
                        key={bp.val}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, vitals: { ...formData.vitals, bp: bp.val } })
                        }
                        className={`p-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                          formData.vitals?.bp === bp.val
                            ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {bp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vitals Grid: Sugar, SpO2, Hb, Weight */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.blood_sugar', 'Blood Sugar (mg/dL)')}
                    </label>
                    <input
                      type="number"
                      value={formData.vitals?.sugar || "100"}
                      onChange={(e) =>
                        setFormData({ ...formData, vitals: { ...formData.vitals, sugar: e.target.value } })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.spo2_oxygen', 'SpO2 Oxygen (%)')}
                    </label>
                    <input
                      type="number"
                      value={formData.vitals?.spo2 || "98"}
                      onChange={(e) =>
                        setFormData({ ...formData, vitals: { ...formData.vitals, spo2: e.target.value } })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.hemoglobin', 'Hemoglobin Hb (g/dL)')}
                    </label>
                    <input
                      type="text"
                      value={formData.vitals?.hb || "11.5"}
                      onChange={(e) =>
                        setFormData({ ...formData, vitals: { ...formData.vitals, hb: e.target.value } })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.weight_kg', 'Weight (kg)')}
                    </label>
                    <input
                      type="number"
                      value={formData.vitals?.weight || "52"}
                      onChange={(e) =>
                        setFormData({ ...formData, vitals: { ...formData.vitals, weight: e.target.value } })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {t('asha_dashboard.primary_symptoms', 'Primary Symptoms / Condition')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mild headache, routine pregnancy follow-up"
                    value={formData.condition || ""}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* ──────── TAB 2: MATERNAL & ANC (MOTHERS) ──────── */}
            {modalActiveTab === "MATERNAL" && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between bg-violet-50 p-2.5 rounded-lg border border-violet-200">
                  <span className="text-xs font-bold text-violet-900">
                    {t('asha_dashboard.mark_pregnant', 'Mark as Pregnant Mother (ANC Case)')}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.maternal?.isPregnant || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maternal: { ...formData.maternal, isPregnant: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-violet-600 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.current_trimester', 'Current Trimester')}
                    </label>
                    <select
                      value={formData.maternal?.trimester || "2nd Trimester"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maternal: { ...formData.maternal, trimester: e.target.value as any },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="1st Trimester">{t('asha_dashboard.trimester_1', '1st Trimester (1-12 Weeks)')}</option>
                      <option value="2nd Trimester">{t('asha_dashboard.trimester_2', '2nd Trimester (13-27 Weeks)')}</option>
                      <option value="3rd Trimester">{t('asha_dashboard.trimester_3', '3rd Trimester (28-40 Weeks)')}</option>
                      <option value="Postnatal (PNC)">{t('asha_dashboard.trimester_pnc', 'Postnatal (PNC)')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.gestational_age', 'Gestational Age (Weeks)')}
                    </label>
                    <input
                      type="number"
                      value={formData.maternal?.weeks || 20}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maternal: { ...formData.maternal, weeks: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {t('asha_dashboard.edd', 'Expected Delivery Date (EDD)')}
                  </label>
                  <input
                    type="date"
                    value={formData.maternal?.edd || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maternal: { ...formData.maternal, edd: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>

                {/* High Risk Flags Checklist for ASHA */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    {t('asha_dashboard.high_risk_markers', 'High Risk Pregnancy Markers (Any present?):')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "Severe Anemia (Hb < 7)",
                      "High Blood Pressure (> 140/90)",
                      "Swelling in feet / Pre-eclampsia",
                      "Twin / Multiple Pregnancy",
                      "Previous C-Section / Complication",
                      "Gestational Diabetes",
                    ].map((flag) => {
                      const isChecked = formData.maternal?.highRiskFlags?.includes(flag) || false;
                      return (
                        <label
                          key={flag}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium cursor-pointer ${
                            isChecked
                              ? "bg-red-50 border-red-300 text-red-800 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const curr = formData.maternal?.highRiskFlags || [];
                              const updated = e.target.checked
                                ? [...curr, flag]
                                : curr.filter((f) => f !== flag);
                              setFormData({
                                ...formData,
                                maternal: { ...formData.maternal, highRiskFlags: updated },
                              });
                            }}
                            className="rounded text-red-600"
                          />
                          <span>{flag}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 3: CHILD IMMUNIZATION ──────── */}
            {modalActiveTab === "CHILD" && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between bg-sky-50 p-2.5 rounded-lg border border-sky-200">
                  <span className="text-xs font-bold text-sky-900">
                    {t('asha_dashboard.mark_child', 'Mark as Infant / Child Record')}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.immunization?.isChild || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        immunization: { ...formData.immunization, isChild: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.child_dob', 'Child Date of Birth')}
                    </label>
                    <input
                      type="date"
                      value={formData.immunization?.childDob || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          immunization: { ...formData.immunization, childDob: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.nutrition_status', 'Nutrition Status')}
                    </label>
                    <select
                      value={formData.immunization?.nutritionStatus || "Normal"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          immunization: { ...formData.immunization, nutritionStatus: e.target.value as any },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="Normal">{t('asha_dashboard.nutrition_normal', 'Normal Weight / Healthy')}</option>
                      <option value="Moderate (MAM)">{t('asha_dashboard.nutrition_mam', 'Moderate Underweight (MAM)')}</option>
                      <option value="Severe (SAM)">{t('asha_dashboard.nutrition_sam', 'Severely Malnourished (SAM)')}</option>
                    </select>
                  </div>
                </div>

                {/* Vaccines Checklist */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    {t('asha_dashboard.vaccines_due_admin', 'Vaccines Administered / Due Today:')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "BCG (At Birth)",
                      "OPV 0, 1, 2, 3",
                      "Pentavalent-1 (6 Weeks)",
                      "Pentavalent-2 (10 Weeks)",
                      "Pentavalent-3 (14 Weeks)",
                      "Rotavirus Vaccine",
                      "Measles-Rubella (MR-1)",
                      "Vitamin A First Dose",
                    ].map((vax) => {
                      const isGiven = formData.immunization?.vaccinesGiven?.includes(vax) || false;
                      return (
                        <label
                          key={vax}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                            isGiven
                              ? "bg-teal-50 border-teal-300 text-teal-800 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isGiven}
                            onChange={(e) => {
                              const curr = formData.immunization?.vaccinesGiven || [];
                              const updated = e.target.checked
                                ? [...curr, vax]
                                : curr.filter((v) => v !== vax);
                              setFormData({
                                ...formData,
                                immunization: { ...formData.immunization, vaccinesGiven: updated },
                              });
                            }}
                            className="rounded text-teal-600"
                          />
                          <span>{vax}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 4: NCD & CHRONIC CARE ──────── */}
            {modalActiveTab === "NCD" && (
              <div className="space-y-3.5 pt-1">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ncd?.hasHypertension || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ncd: { ...formData.ncd, hasHypertension: e.target.checked },
                        })
                      }
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {t('asha_dashboard.hypertension', 'Hypertension (High BP)')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ncd?.hasDiabetes || false}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ncd: { ...formData.ncd, hasDiabetes: e.target.checked },
                        })
                      }
                      className="rounded text-blue-600"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {t('asha_dashboard.diabetes', 'Type-2 Diabetes')}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.med_adherence', 'Medication Adherence')}
                    </label>
                    <select
                      value={formData.ncd?.medicationAdherence || "Regular"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ncd: { ...formData.ncd, medicationAdherence: e.target.value as any },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="Regular">{t('asha_dashboard.med_regular', 'Taking Daily (Regular)')}</option>
                      <option value="Irregular">{t('asha_dashboard.med_irregular', 'Irregular / Forgets Often')}</option>
                      <option value="Stopped">{t('asha_dashboard.med_stopped', 'Stopped Taking Meds')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.monthly_meds', 'Monthly Meds Given?')}
                    </label>
                    <select
                      value={formData.ncd?.monthlyMedsDelivered ? "Yes" : "No"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ncd: { ...formData.ncd, monthlyMedsDelivered: e.target.value === "Yes" },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="Yes">{t('asha_dashboard.meds_yes', 'Yes — 30 Day Supply Given')}</option>
                      <option value="No">{t('asha_dashboard.meds_no', 'No — Refill Needed from PHC')}</option>
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>{t('asha_dashboard.lifestyle_counseling', 'Lifestyle Counseling Conducted (Low salt, daily walk, diet)')}</span>
                  <input
                    type="checkbox"
                    checked={formData.ncd?.lifestyleCounseling || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ncd: { ...formData.ncd, lifestyleCounseling: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-amber-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* ──────── TAB 5: SUPPLIES, SERVICES & REFERRAL ──────── */}
            {modalActiveTab === "SUPPLIES" && (
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                    {t('asha_dashboard.supplies_delivered', 'Free Supplies Delivered to Household:')}
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      "IFA Iron Tablets",
                      "Calcium Tablets",
                      "ORS Packets",
                      "Zinc Tablets",
                      "Nutrition Counseling",
                      "Contraceptive (Chhaya/Condoms)",
                      "BP / Sugar Check",
                      "Sanitary Napkins",
                    ].map((supply) => {
                      const isSupplied = formData.services?.suppliesGiven?.includes(supply) || false;
                      return (
                        <label
                          key={supply}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                            isSupplied
                              ? "bg-teal-50 border-teal-300 text-teal-800 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSupplied}
                            onChange={(e) => {
                              const curr = formData.services?.suppliesGiven || [];
                              const updated = e.target.checked
                                ? [...curr, supply]
                                : curr.filter((s) => s !== supply);
                              setFormData({
                                ...formData,
                                services: { ...formData.services, suppliesGiven: updated },
                              });
                            }}
                            className="rounded text-teal-600"
                          />
                          <span>{supply}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.referral_action', 'Referral Action')}
                    </label>
                    <select
                      value={formData.services?.referralStatus || "None"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          services: { ...formData.services, referralStatus: e.target.value as any },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                    >
                      <option value="None">{t('asha_dashboard.ref_none', 'None (Routine Care)')}</option>
                      <option value="PHC Doctor Referral">{t('asha_dashboard.ref_phc', 'PHC Doctor / Teleconsult')}</option>
                      <option value="108 Emergency Ambulance">{t('asha_dashboard.ref_108', '108 Emergency Ambulance')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">
                      {t('asha_dashboard.next_followup', 'Next Follow-Up Date')}
                    </label>
                    <input
                      type="date"
                      value={formData.services?.nextVisitDate || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          services: { ...formData.services, nextVisitDate: e.target.value },
                        })
                      }
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">
                    {t('asha_dashboard.asha_remarks', 'ASHA Field Remarks / Notes')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Advised rest, family briefed about PHC checkup"
                    value={formData.services?.remarks || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        services: { ...formData.services, remarks: e.target.value },
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Modal Bottom Save Action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                {t('asha_dashboard.offline_encrypted_save', 'Offline encrypted save to IndexedDB')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {t('asha_dashboard.cancel', 'Cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleSaveRecord}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('asha_dashboard.save_record', 'Save Patient Record')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* External Modals */}
      {showScanner && <QRScanner onScan={handleQrScanned} onClose={() => setShowScanner(false)} />}
      {showVoiceIntake && (
        <VoiceIntakeModal
          isOpen={showVoiceIntake}
          onClose={() => setShowVoiceIntake(false)}
          onApplyIntake={handleApplyVoiceIntake}
        />
      )}
      {showSosModal && <SosEmergencyModal isOpen={showSosModal} onClose={() => setShowSosModal(false)} />}

      {/* Emergency PHC Instant Booking Modal */}
      <EmergencyPhcBookingModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        patient={emergencyPatient}
        onSuccess={(pass) => {
          showToast(`✓ Fast-Track Token #${pass.tokenNumber} confirmed at ${pass.facility}`);
        }}
      />
    </div>
  );
};

export default AshaDashboard;
