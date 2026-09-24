import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/auth';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Link } from 'react-router-dom';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Activity,
  Heart,
  Thermometer,
  Droplet,
  FileText,
  PlusCircle,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck,
  Stethoscope,
  Wifi,
  Sparkles,
  ChevronRight,
  Trash2,
  RefreshCw,
  Phone,
  Pill,
  MessageSquare,
  ArrowDownToLine,
  Store,
  MapPin,
  Calendar,
  ArrowRight,
  Download,
  Printer
} from 'lucide-react';
import { CdssAlertsBadge } from '../components/cdss/CdssAlertsBadge';
import { VoiceIntakeModal } from '../components/voice/VoiceIntakeModal';

/* =========================================================================
   1. CITIZEN / PATIENT DEDICATED TELECONSULTATION PORTAL
   ========================================================================= */
const CitizenTeleconsultView: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const citizenName = user?.full_name || 'Ramesh Yadav';

  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [postCallSummary, setPostCallSummary] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isInCall]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsInCall(false);
    setPostCallSummary(true);
  };

  const pastTeleconsults = [
    {
      id: 'tc-01',
      date: '12 Sep 2026',
      doctor: 'Dr. Priya Sharma (MD, General Physician)',
      specialty: 'Diabetes & Hypertension Management',
      duration: '08:42 mins',
      diagnosis: 'Type-2 Diabetes followup — blood sugar in good control',
      prescription: 'Tab. Metformin 500mg BD, Tab. Telmisartan 40mg OD'
    },
    {
      id: 'tc-02',
      date: '15 Aug 2026',
      doctor: 'Dr. Ramesh Patil (MBBS)',
      specialty: 'Primary Health Care',
      duration: '06:15 mins',
      diagnosis: 'Seasonal allergic rhinitis & mild headache',
      prescription: 'Tab. Cetirizine 10mg HS for 5 days'
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('teleconsult.title', 'Video Doctor Teleconsultation')}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              WebRTC Encrypted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('teleconsult.subtitle', 'Connect face-to-face with government medical officers from District Hospital & Hub')}
          </p>
        </div>

        {!isInCall && (
          <button
            onClick={() => {
              setPostCallSummary(false);
              setIsInCall(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md shadow-blue-500/20 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>{t('teleconsult.start_call', 'Start Live Video Call')}</span>
          </button>
        )}
      </div>

      {/* Active Live Video Consultation Screen */}
      {isInCall ? (
        <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          {/* Top Call Info Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold">Dr. Priya Sharma (On-Duty MO)</span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold ml-1">{formatTimer(callDuration)}</span>
            </div>

            <div className="flex items-center space-x-2 pointer-events-auto">
              <button
                onClick={() => setIsLowBandwidth(!isLowBandwidth)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                  isLowBandwidth ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-900/80 text-slate-300 border-white/10'
                }`}
              >
                {isLowBandwidth ? '2G Bandwidth Saver (Active)' : 'HD Video Mode'}
              </button>
            </div>
          </div>

          {/* Video Feed Area */}
          <div className="relative aspect-video max-h-[480px] w-full bg-slate-900 flex items-center justify-center overflow-hidden">
            {/* Doctor Simulated Stream */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-blue-600/20 border-2 border-blue-400/40 flex items-center justify-center text-blue-300 shadow-inner">
                <Stethoscope className="w-12 h-12" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-white">Dr. Priya Sharma (MD, Physician)</h3>
                <p className="text-xs text-blue-300">District Hospital Hub Nashik • Teleconsult Active</p>
                <div className="flex items-center justify-center space-x-1 mt-2">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>

            {/* Self Picture-in-Picture Box */}
            <div className="absolute bottom-4 right-4 w-36 h-28 bg-slate-800 rounded-2xl border-2 border-white/20 overflow-hidden shadow-lg flex flex-col items-center justify-center text-white">
              {isVideoOff ? (
                <div className="text-center">
                  <User className="w-8 h-8 text-slate-400 mx-auto" />
                  <span className="text-[9px] text-slate-400 block mt-1">Video Off</span>
                </div>
              ) : (
                <div className="text-center">
                  <User className="w-8 h-8 text-blue-400 mx-auto" />
                  <span className="text-[9px] font-bold text-slate-200 block mt-1">{citizenName} (You)</span>
                </div>
              )}
            </div>
          </div>

          {/* In-Call Controls Bar */}
          <div className="p-4 bg-slate-900/95 border-t border-slate-800 flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsMicMuted(!isMicMuted)}
              className={`p-3 rounded-full transition cursor-pointer ${
                isMicMuted ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`p-3 rounded-full transition cursor-pointer ${
                isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>

            <button
              onClick={handleEndCall}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-2 transition shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Consultation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Doctor Available Station Banner */
        <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white border border-blue-900/40 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">{t('teleconsult.doctor_online', 'Doctor is Online')}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">Dr. Priya Sharma (MD, General Medicine)</h3>
                <p className="text-xs text-blue-200">District Hospital Tele-OPD Hub • Average wait: &lt; 2 minutes</p>
              </div>
            </div>

            <button
              onClick={() => {
                setPostCallSummary(false);
                setIsInCall(true);
              }}
              className="bg-white hover:bg-blue-50 text-blue-900 font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition cursor-pointer"
            >
              {t('teleconsult.connect_now', 'Connect Now')}
            </button>
          </div>
        </div>
      )}

      {/* Post-Call Doctor Consultation Dossier & Digital Prescription Result */}
      {(postCallSummary || !isInCall) && (
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-6 shadow-md space-y-5 animate-in fade-in slide-in-from-bottom-3">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-black text-slate-900">
                    Latest Teleconsultation Summary & Digital Prescription
                  </h3>
                  <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-300 px-2 py-0.5 rounded-full uppercase">
                    ABDM EHR Synced
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultation completed with on-duty government medical officer • Official Rx issued
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                Ref: #TC-MED-8491
              </span>
            </div>
          </div>

          {/* 1. Doctor & Vitals Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Attending Medical Officer
              </span>
              <h4 className="text-sm font-extrabold text-slate-900">
                Dr. Priya Sharma (MBBS, MD)
              </h4>
              <p className="text-xs text-slate-600">
                General Medicine • Reg. No: MMC-2018/04/1829
              </p>
              <p className="text-[11px] text-blue-600 font-semibold">
                Sinnar Sub-District Hospital Tele-OPD Hub
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recorded Vitals (During Consultation)
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Blood Pressure</span>
                  <span className="font-bold text-slate-800">120/80 mmHg</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Oxygen (SpO2)</span>
                  <span className="font-bold text-emerald-600">98% Normal</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                  <span className="font-bold text-slate-800">74 bpm</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Clinical Diagnosis Box */}
          <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-1">
            <span className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">
              Doctor's Clinical Diagnosis & Assessment
            </span>
            <p className="text-xs font-bold text-blue-950">
              Type-2 Diabetes Mellitus (ICD-10: E11.9) & Primary Essential Hypertension (I10) — Stable control.
            </p>
          </div>

          {/* 3. Prescribed Medications Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <Pill className="w-3.5 h-3.5 text-blue-600" />
                <span>Prescribed Medications (Jan Aushadhi Generic Formulary)</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Available at Sinnar PMBJP Kendra (1.2 km)
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
              <div className="p-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
                <span className="w-1/2">Medicine & Generic Formulation</span>
                <span className="w-1/4">Dosage & Frequency</span>
                <span className="w-1/4 text-right">Duration & Jan Aushadhi Price</span>
              </div>

              <div className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                <div className="w-1/2 space-y-0.5">
                  <div className="font-bold text-slate-900">Tab. Metformin Hydrochloride 500mg</div>
                  <div className="text-[11px] text-slate-500">PMBJP Code: PMBJP-DM-04 • Sugar Control</div>
                </div>
                <div className="w-1/4 text-slate-700 font-medium">
                  1 Tab Twice Daily (BD)<br /><span className="text-[10px] text-slate-400">After Breakfast & Dinner</span>
                </div>
                <div className="w-1/4 text-right">
                  <div className="font-bold text-emerald-600">₹24 <span className="line-through text-slate-300 text-[10px]">₹180</span></div>
                  <div className="text-[10px] text-slate-400">30 Days (60 Tabs)</div>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                <div className="w-1/2 space-y-0.5">
                  <div className="font-bold text-slate-900">Tab. Telmisartan 40mg</div>
                  <div className="text-[11px] text-slate-500">PMBJP Code: PMBJP-CV-12 • Blood Pressure</div>
                </div>
                <div className="w-1/4 text-slate-700 font-medium">
                  1 Tab Once Daily (OD)<br /><span className="text-[10px] text-slate-400">Morning after food</span>
                </div>
                <div className="w-1/4 text-right">
                  <div className="font-bold text-emerald-600">₹32 <span className="line-through text-slate-300 text-[10px]">₹220</span></div>
                  <div className="text-[10px] text-slate-400">30 Days (30 Tabs)</div>
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                <div className="w-1/2 space-y-0.5">
                  <div className="font-bold text-slate-900">Tab. Paracetamol 650mg</div>
                  <div className="text-[11px] text-slate-500">PMBJP Code: PMBJP-AL-01 • SOS Fever/Pain</div>
                </div>
                <div className="w-1/4 text-slate-700 font-medium">
                  1 Tab SOS (As needed)<br /><span className="text-[10px] text-slate-400">When fever &gt; 99°F</span>
                </div>
                <div className="w-1/4 text-right">
                  <div className="font-bold text-emerald-600">₹7 <span className="line-through text-slate-300 text-[10px]">₹35</span></div>
                  <div className="text-[10px] text-slate-400">5 Days (10 Tabs)</div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Doctor's Lifestyle & Dietary Advice */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs space-y-1.5">
            <span className="font-extrabold text-amber-900 uppercase tracking-wider block">
              Doctor's Dietary & Follow-up Instructions
            </span>
            <ul className="list-disc pl-4 space-y-1 text-amber-950 text-[11px]">
              <li>Walk for 30–40 minutes every morning. Maintain regular meal timings.</li>
              <li>Limit daily salt intake to under 1 teaspoon; avoid pickles, papad, and fried street foods.</li>
              <li>Continue Jan Aushadhi generic tablets regularly without skipping.</li>
              <li><strong>Next Scheduled OPD Checkup:</strong> 12 Oct 2026 at Sinnar PHC / Sub-District Hospital.</li>
            </ul>
          </div>

          {/* 5. 1-Click Citizen Action Hub */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link
              to="/pharmacy"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow flex items-center space-x-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Collect Meds at Jan Aushadhi Store &rarr;</span>
            </Link>

            <Link
              to="/appointments"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow flex items-center space-x-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Follow-up Appointment</span>
            </Link>

            <Link
              to="/health-card"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>View ABHA Health Card</span>
            </Link>
          </div>
        </div>
      )}

      {/* Past Video Consultation History */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Video className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Past Tele-Consultation History</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {pastTeleconsults.length} Sessions Logged • Tap to View
          </span>
        </div>

        <div className="space-y-3">
          {pastTeleconsults.map((tc) => (
            <div
              key={tc.id}
              onClick={() => {
                setPostCallSummary(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-blue-50/40 hover:border-blue-300 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {tc.doctor}
                  </span>
                  <span className="text-[11px] text-slate-500 block">{tc.specialty}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 font-medium block">{tc.date}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">{tc.duration}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800">Assessment:</strong> {tc.diagnosis}
                </div>
                <span className="text-[10px] font-bold text-blue-600 underline">
                  Open Summary &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
/* =========================================================================
   2. CLINICIAN / DOCTOR / STAFF TELECONSULTATION STATION
   ========================================================================= */
interface MedicationItem {
  id?: string;
  medicine_name: string;
  generic_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  janAushadhiPrice?: string;
}

interface TeleconsultQueueSession {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  abha_id: string;
  origin_facility: string;
  asha_worker: string;
  specialty: string;
  severity: "EMERGENCY" | "HIGH" | "MODERATE" | "ROUTINE";
  waiting_time: string;
  chief_complaint: string;
  vitals_snapshot: {
    blood_pressure_sys: number;
    blood_pressure_dia: number;
    pulse_rate: number;
    spo2: number;
    temperature: number;
    blood_sugar_fbs: number;
  };
  allergies?: string[];
  history?: string;
}

const DEFAULT_DOCTOR_QUEUE: TeleconsultQueueSession[] = [
  {
    id: "TC-SESSION-001",
    patient_id: "pat-101",
    patient_name: "Kavita Gurjar",
    patient_age: 42,
    patient_gender: "Female",
    abha_id: "91-8821-4902-3112",
    origin_facility: "Ayushman Arogya Mandir, Sinnar",
    asha_worker: "Sunita Shinde (ASHA #104)",
    specialty: "General Medicine / Cardiology",
    severity: "HIGH",
    waiting_time: "3 mins ago",
    chief_complaint: "Persistent dizziness, palpitations & shortness of breath upon mild exertion",
    vitals_snapshot: {
      blood_pressure_sys: 148,
      blood_pressure_dia: 92,
      pulse_rate: 98,
      spo2: 95,
      temperature: 98.6,
      blood_sugar_fbs: 140
    },
    allergies: ["Sulfa drugs"],
    history: "Borderline hypertension, recurrent vertigo episodes"
  },
  {
    id: "TC-SESSION-002",
    patient_id: "pat-102",
    patient_name: "Ramesh Yadav",
    patient_age: 52,
    patient_gender: "Male",
    abha_id: "91-4432-8901-7721",
    origin_facility: "Bagru Health Sub-Centre",
    asha_worker: "Kavita Rao (ASHA #108)",
    specialty: "General Medicine",
    severity: "MODERATE",
    waiting_time: "7 mins ago",
    chief_complaint: "Type-2 Diabetes routine tele-review, fasting blood sugar 165 mg/dL",
    vitals_snapshot: {
      blood_pressure_sys: 128,
      blood_pressure_dia: 82,
      pulse_rate: 76,
      spo2: 98,
      temperature: 98.4,
      blood_sugar_fbs: 165
    },
    allergies: ["None reported"],
    history: "Known Type-2 Diabetic for 4 years on Metformin"
  },
  {
    id: "TC-SESSION-003",
    patient_id: "pat-103",
    patient_name: "Gopal Singh",
    patient_age: 68,
    patient_gender: "Male",
    abha_id: "91-7721-0043-9811",
    origin_facility: "Bassi Rural Dispensary Hub",
    asha_worker: "Meera Bai (ASHA #112)",
    specialty: "Endocrinology & Diabetology",
    severity: "EMERGENCY",
    waiting_time: "11 mins ago",
    chief_complaint: "Uncontrolled fasting blood sugar (188 mg/dL) with bilateral peripheral tingling in feet",
    vitals_snapshot: {
      blood_pressure_sys: 155,
      blood_pressure_dia: 95,
      pulse_rate: 84,
      spo2: 96,
      temperature: 98.2,
      blood_sugar_fbs: 188
    },
    allergies: ["Penicillin"],
    history: "Long-standing T2D, peripheral neuropathy suspect"
  }
];

export const TeleconsultPage: React.FC = () => {
  const { user } = useAuthStore();
  const isPatientRole = user?.role === 'PATIENT';

  if (isPatientRole) {
    return <CitizenTeleconsultView />;
  }

  const { t } = useTranslation();

  const [sessions, setSessions] = useState<TeleconsultQueueSession[]>(DEFAULT_DOCTOR_QUEUE);
  const [activeSession, setActiveSession] = useState<TeleconsultQueueSession | null>(null);
  const [activeTab, setActiveTab] = useState<"queue" | "history">("queue");

  // Video Call Controls State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isLowBandwidth, setIsLowBandwidth] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // In-Call Prescription & Consultation Form
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [lifestyleAdvice, setLifestyleAdvice] = useState('');
  const [followupDays, setFollowupDays] = useState('7');
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('1 tab');
  const [newMedFreq, setNewMedFreq] = useState('1-0-1 (BD)');
  const [newMedDuration, setNewMedDuration] = useState('5 Days');
  const [newMedInstructions, setNewMedInstructions] = useState('After meals');
  const [isCompletingCall, setIsCompletingCall] = useState(false);

  // Request Teleconsult Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqAbha, setReqAbha] = useState('');
  const [reqFacility, setReqFacility] = useState('Ayushman Arogya Mandir, Sinnar');
  const [reqSpecialty, setReqSpecialty] = useState('General Medicine');
  const [reqSeverity, setReqSeverity] = useState<"EMERGENCY" | "HIGH" | "MODERATE" | "ROUTINE">("MODERATE");
  const [reqComplaint, setReqComplaint] = useState('');

  // Call timer
  useEffect(() => {
    let interval: any = null;
    if (activeSession) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const handleJoinCall = (session: TeleconsultQueueSession) => {
    setActiveSession(session);
    setDiagnosis(
      session.severity === 'EMERGENCY'
        ? 'Uncontrolled Type-2 Diabetes with Early Peripheral Neuropathy'
        : session.specialty.includes('Cardiology')
        ? 'Hypertensive Crisis / Pre-hypertension under Evaluation'
        : 'Routine Followup & Glycemic Review'
    );
    setClinicalNotes(`Patient connected from ${session.origin_facility} via ASHA ${session.asha_worker}.\nChief Complaint: ${session.chief_complaint}\nVitals Snapshot: BP ${session.vitals_snapshot.blood_pressure_sys}/${session.vitals_snapshot.blood_pressure_dia} mmHg, SpO2 ${session.vitals_snapshot.spo2}%, FBS ${session.vitals_snapshot.blood_sugar_fbs} mg/dL.`);
    setLifestyleAdvice('1. Low sodium, high fiber diet.\n2. 30 mins brisk morning walk.\n3. Collect generic medicines from nearby Jan Aushadhi Kendra.');
    
    // Set default generic meds for the session
    if (session.chief_complaint.includes('sugar') || session.chief_complaint.includes('Diabetes')) {
      setMedications([
        {
          id: '1',
          medicine_name: 'Tab. Metformin PR (Jan Aushadhi)',
          generic_name: 'Metformin Hydrochloride 500mg',
          dosage: '500mg',
          frequency: '1-0-1 (After meals)',
          duration: '30 Days',
          instructions: 'Take immediately after food',
          janAushadhiPrice: '₹9.00'
        },
        {
          id: '2',
          medicine_name: 'Cap. Methylcobalamin + Alpha Lipoic Acid',
          generic_name: 'Neurotropic Multivitamin',
          dosage: '1 Cap',
          frequency: '0-0-1 (Night)',
          duration: '30 Days',
          instructions: 'At bedtime for tingling relief',
          janAushadhiPrice: '₹22.00'
        }
      ]);
    } else {
      setMedications([
        {
          id: '1',
          medicine_name: 'Tab. Amlodipine (Jan Aushadhi)',
          generic_name: 'Amlodipine Besylate 5mg',
          dosage: '5mg',
          frequency: '1-0-0 (Morning)',
          duration: '30 Days',
          instructions: 'After breakfast with water',
          janAushadhiPrice: '₹4.50'
        },
        {
          id: '2',
          medicine_name: 'Tab. Telmisartan (Jan Aushadhi)',
          generic_name: 'Telmisartan IP 40mg',
          dosage: '40mg',
          frequency: '0-0-1 (Night)',
          duration: '30 Days',
          instructions: 'At bedtime',
          janAushadhiPrice: '₹12.00'
        }
      ]);
    }
  };

  const handleAddMedication = () => {
    if (!newMedName.trim()) return;
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        medicine_name: newMedName,
        generic_name: newMedName,
        dosage: newMedDosage,
        frequency: newMedFreq,
        duration: newMedDuration,
        instructions: newMedInstructions,
        janAushadhiPrice: '₹6.50'
      }
    ]);
    setNewMedName('');
  };

  const handleRemoveMedication = (id?: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleCompleteConsultation = () => {
    if (!diagnosis.trim()) {
      alert('Please provide a clinical diagnosis before signing.');
      return;
    }
    setIsCompletingCall(true);
    setTimeout(() => {
      alert(
        `✓ Consultation Complete & Digitally Signed!\n\nPatient: ${activeSession?.patient_name} (${activeSession?.abha_id})\nDiagnosis: ${diagnosis}\nMedications Dispatched: ${medications.length} Generic Items\n\nPrescription has been pushed to Patient Health Locker & PMBJP Kendra.`
      );
      if (activeSession) {
        setSessions(sessions.filter(s => s.id !== activeSession.id));
      }
      setIsCompletingCall(false);
      setActiveSession(null);
    }, 1000);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim()) return;
    const newSession: TeleconsultQueueSession = {
      id: `TC-${Date.now().toString().slice(-4)}`,
      patient_id: `pat-${Date.now()}`,
      patient_name: reqName,
      patient_age: 45,
      patient_gender: 'Male',
      abha_id: reqAbha || '91-0000-1111-2222',
      origin_facility: reqFacility,
      asha_worker: 'Sunita Shinde (ASHA)',
      specialty: reqSpecialty,
      severity: reqSeverity,
      waiting_time: 'Just now',
      chief_complaint: reqComplaint || 'Teleconsultation Requested',
      vitals_snapshot: {
        blood_pressure_sys: 120,
        blood_pressure_dia: 80,
        pulse_rate: 74,
        spo2: 98,
        temperature: 98.4,
        blood_sugar_fbs: 105
      }
    };
    setSessions([newSession, ...sessions]);
    setIsCreateModalOpen(false);
    setReqName('');
    setReqComplaint('');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Doctor Tele-OPD Hub
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
              WebRTC Secure Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time audio/video consultations between District Hospital and Ayushman Arogya Mandirs (AAM)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSessions([...DEFAULT_DOCTOR_QUEUE])}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Refresh Queue</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Request Teleconsult</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Waiting Call Queue</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{sessions.length} Patients</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Critical / High Triage</p>
            <p className="text-lg font-bold text-red-600 mt-0.5">
              {sessions.filter(s => s.severity === 'EMERGENCY' || s.severity === 'HIGH').length} Urgent
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Spoke AAM Centres</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">4 Active Hubs</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Network Latency</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">&lt; 38 ms (Low)</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wifi className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. ACTIVE VIDEO CALL ROOM OR WAITING QUEUE */}
      {activeSession ? (
        /* IN-CALL DOCTOR CONSOLE (Split Screen) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* LEFT 7 COLS: WEBRTC VIDEO & VITALS MONITOR */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden relative">
              {/* Call Top Header */}
              <div className="p-3 bg-slate-900/90 border-b border-white/10 flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold">{activeSession.patient_name} ({activeSession.patient_age}y/{activeSession.patient_gender})</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold ml-1">
                    {formatTimer(callDuration)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLowBandwidth(!isLowBandwidth)}
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                      isLowBandwidth ? 'bg-amber-500 text-white border-amber-400' : 'bg-slate-800 text-slate-300 border-white/10'
                    }`}
                  >
                    {isLowBandwidth ? '2G Bandwidth Mode' : 'HD Video Mode'}
                  </button>
                </div>
              </div>

              {/* Video Stream Stage */}
              <div className="relative aspect-video max-h-[380px] w-full bg-slate-900 flex items-center justify-center">
                {/* Patient Stream Representation */}
                <div className="flex flex-col items-center space-y-2 text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-400/50 flex items-center justify-center text-blue-300 shadow-inner">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{activeSession.patient_name}</h3>
                    <p className="text-[11px] text-blue-200">{activeSession.origin_facility}</p>
                    <p className="text-[10px] text-slate-400">ASHA: {activeSession.asha_worker}</p>
                  </div>
                  <div className="flex items-center justify-center space-x-1 pt-1">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                  </div>
                </div>

                {/* Doctor Picture-in-Picture Box */}
                <div className="absolute bottom-3 right-3 w-32 h-24 bg-slate-800 rounded-xl border border-white/20 overflow-hidden shadow-lg flex flex-col items-center justify-center text-white">
                  {isVideoOff ? (
                    <span className="text-[9px] text-slate-400">Doctor Cam Off</span>
                  ) : (
                    <div className="text-center">
                      <Stethoscope className="w-6 h-6 text-emerald-400 mx-auto" />
                      <span className="text-[9px] font-bold text-slate-200 block mt-0.5">Dr. Priya (You)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Call Controls Bar */}
              <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsMicMuted(!isMicMuted)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                      isMicMuted ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isMicMuted ? 'Unmute' : 'Mute'}</span>
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer ${
                      isVideoOff ? 'bg-red-500 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isVideoOff ? 'Start Cam' : 'Stop Cam'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setActiveSession(null)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Leave Consultation</span>
                </button>
              </div>
            </div>

            {/* Patient Live Vitals Strip */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Spoke Vitals (ASHA Station)</span>
                <span className="text-[10px] text-blue-600 font-semibold">ABHA: {activeSession.abha_id}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">BP</span>
                  <strong className="text-slate-900 font-bold">{activeSession.vitals_snapshot.blood_pressure_sys}/{activeSession.vitals_snapshot.blood_pressure_dia} mmHg</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Pulse Rate</span>
                  <strong className="text-slate-900 font-bold">{activeSession.vitals_snapshot.pulse_rate} bpm</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">SpO2</span>
                  <strong className="text-slate-900 font-bold">{activeSession.vitals_snapshot.spo2}%</strong>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg">
                  <span className="text-[10px] text-slate-400 block">Blood Sugar</span>
                  <strong className="text-slate-900 font-bold">{activeSession.vitals_snapshot.blood_sugar_fbs} mg/dL</strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: DIGITAL RX & CLINICAL DOCUMENTATION */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">E-Prescription & ABDM Notes</h3>
                <p className="text-[10px] text-slate-400">Dr. Priya Sharma • MMC Reg: 84920</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded">
                Jan Aushadhi Active
              </span>
            </div>

            {/* Diagnosis & Notes */}
            <div className="space-y-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium outline-none focus:border-blue-500"
                  placeholder="e.g. Type-2 Diabetes Followup"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Doctor's Clinical Notes</label>
                <textarea
                  value={clinicalNotes}
                  onChange={e => setClinicalNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                  placeholder="Enter clinical examination notes..."
                />
              </div>
            </div>

            {/* Prescribed Medications */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Prescribed Generic Medicines</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{medications.length} Added</span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {medications.map(med => (
                  <div key={med.id} className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">{med.medicine_name}</span>
                      <span className="text-[10px] text-slate-500">{med.dosage} • {med.frequency} • {med.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-emerald-600">{med.janAushadhiPrice || '₹5.00'}</span>
                      <button
                        onClick={() => handleRemoveMedication(med.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Med Line */}
              <div className="grid grid-cols-12 gap-1.5 pt-1">
                <input
                  type="text"
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  placeholder="Add medicine (e.g. Tab. Paracetamol)"
                  className="col-span-8 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="col-span-4 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold py-1 flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Add Med</span>
                </button>
              </div>
            </div>

            {/* Advice & Follow-up */}
            <div className="space-y-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Diet & Lifestyle Advice</label>
                <textarea
                  value={lifestyleAdvice}
                  onChange={e => setLifestyleAdvice(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 text-[11px]">Follow-up:</span>
                <select
                  value={followupDays}
                  onChange={e => setFollowupDays(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-medium text-slate-800"
                >
                  <option value="3">In 3 Days</option>
                  <option value="7">In 7 Days (1 Week)</option>
                  <option value="14">In 14 Days (2 Weeks)</option>
                  <option value="30">In 30 Days (1 Month)</option>
                </select>
              </div>
            </div>

            {/* Sign & Complete */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleCompleteConsultation}
                disabled={isCompletingCall}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isCompletingCall ? 'Signing with DSC...' : 'Sign & Transmit to Patient Wallet'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* WAITING QUEUE INTERFACE */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>Waiting Teleconsultation Queue</span>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {sessions.length} Patients
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map(sess => (
              <div
                key={sess.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:border-blue-300 hover:shadow-sm transition flex flex-col justify-between space-y-3"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-slate-900">{sess.patient_name}</span>
                    <span
                      className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        sess.severity === 'EMERGENCY'
                          ? 'bg-red-100 text-red-700 animate-pulse'
                          : sess.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {sess.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {sess.patient_age} yrs • {sess.patient_gender} • ABHA: <span className="font-mono text-slate-700">{sess.abha_id}</span>
                  </p>

                  <div className="text-[10px] text-slate-400 mt-1 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400 inline" />
                    <span>{sess.origin_facility}</span>
                  </div>
                </div>

                {/* Complaint */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Chief Complaint
                  </span>
                  <p className="text-slate-800 text-[11px] leading-snug line-clamp-2">{sess.chief_complaint}</p>
                </div>

                {/* Vitals Snapshot */}
                <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50/50 p-1.5 rounded-lg text-[10px]">
                  <div>
                    <span className="text-slate-400 block text-[9px]">BP</span>
                    <strong className="text-slate-800 font-bold">{sess.vitals_snapshot.blood_pressure_sys}/{sess.vitals_snapshot.blood_pressure_dia}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">SpO2</span>
                    <strong className="text-slate-800 font-bold">{sess.vitals_snapshot.spo2}%</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px]">Sugar</span>
                    <strong className="text-slate-800 font-bold">{sess.vitals_snapshot.blood_sugar_fbs}</strong>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{sess.waiting_time}</span>
                  </span>

                  <button
                    onClick={() => handleJoinCall(sess)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REQUEST TELECONSULT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-blue-600" />
                <span>Request Teleconsultation Slot</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={reqName}
                  onChange={e => setReqName(e.target.value)}
                  placeholder="e.g. Ramesh Yadav"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">ABHA Health ID (Optional)</label>
                <input
                  type="text"
                  value={reqAbha}
                  onChange={e => setReqAbha(e.target.value)}
                  placeholder="91-XXXX-XXXX-XXXX"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Specialty</label>
                  <select
                    value={reqSpecialty}
                    onChange={e => setReqSpecialty(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Triage Severity</label>
                  <select
                    value={reqSeverity}
                    onChange={e => setReqSeverity(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="ROUTINE">Routine</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="HIGH">High</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Chief Complaint</label>
                <textarea
                  rows={2}
                  value={reqComplaint}
                  onChange={e => setReqComplaint(e.target.value)}
                  placeholder="Describe patient symptoms..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Create Teleconsult
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleconsultPage;
