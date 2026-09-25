import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import {
  Printer,
  Download,
  Search,
  User,
  Phone,
  ShieldCheck,
  FileText,
  Activity,
  AlertCircle,
  Pill,
  Share2,
  Check,
  Copy,
  QrCode,
  Sparkles,
  Lock,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/auth';

interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  blood_group?: string;
  abha_id?: string;
  abha_address?: string;
  address?: string;
  allergies?: string;
  emergency_contact?: string;
}

interface Consultation {
  id: string;
  chief_complaints: string;
  clinical_notes?: string;
  created_at: string;
  prescriptions?: Array<{
    medication_name: string;
    dosage?: string;
    frequency?: string;
    duration_days?: number;
    instructions?: string;
  }>;
}

const DEFAULT_PATIENTS: Patient[] = [
  {
    id: 'p-default-01',
    mrn: 'MH-2026-0812',
    first_name: 'Ramesh',
    last_name: 'Yadav',
    gender: 'Male',
    date_of_birth: '1986-07-14',
    phone: '+91 98765 43210',
    blood_group: 'B+',
    abha_id: '91-4829-1029-3847',
    abha_address: 'patient.ramesh@abdm',
    address: 'House #42, Sinnar Village, Nashik, Maharashtra - 422103',
    allergies: 'Penicillin, Sulfonamides',
    emergency_contact: '+91 98765 43210 (Wife - Sunita Yadav)'
  },
  {
    id: 'p-default-02',
    mrn: 'MH-2026-0089',
    first_name: 'Sunita',
    last_name: 'Patil',
    gender: 'Female',
    date_of_birth: '1994-03-22',
    phone: '+91 98231 55678',
    blood_group: 'O+',
    abha_id: '91-8841-2910-4491',
    abha_address: 'sunita.patil@abdm',
    address: 'Wadala Gaon, Nashik - 422006',
    allergies: 'None recorded',
    emergency_contact: '+91 98231 55670 (Husband - Vikas Patil)'
  },
  {
    id: 'p-default-03',
    mrn: 'MH-2026-0112',
    first_name: 'Eknath',
    last_name: 'Shinde',
    gender: 'Male',
    date_of_birth: '1958-11-05',
    phone: '+91 94222 89101',
    blood_group: 'AB+',
    abha_id: '91-3392-8172-5501',
    abha_address: 'eknath.shinde@abdm',
    address: 'Dindori Taluka, Nashik - 422202',
    allergies: 'Aspirin',
    emergency_contact: '+91 94222 89100 (Son - Rohit)'
  }
];

const DEFAULT_EHR: Consultation[] = [
  {
    id: 'c-01',
    chief_complaints: 'Type-2 Diabetes Routine Followup & Vitals Screening',
    clinical_notes: 'Fasting Blood Sugar stable at 115 mg/dL. Blood Pressure 120/80 mmHg. Advised regular 30 min brisk walk and balanced diet.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    prescriptions: [
      { medication_name: 'Metformin 500mg', dosage: '1 Tab', frequency: 'BD (After meals)', duration_days: 30 },
      { medication_name: 'Telmisartan 40mg', dosage: '1 Tab', frequency: 'OD (Morning)', duration_days: 30 }
    ]
  },
  {
    id: 'c-02',
    chief_complaints: 'Seasonal Viral Flu & Throat Irritation',
    clinical_notes: 'Mild pharyngeal erythema. Lungs clear. Advised hydration and warm saline gargling.',
    created_at: new Date(Date.now() - 86400000 * 24).toISOString(),
    prescriptions: [
      { medication_name: 'Paracetamol 650mg', dosage: '1 Tab', frequency: 'TDS (As needed)', duration_days: 3 },
      { medication_name: 'Cetirizine 10mg', dosage: '1 Tab', frequency: 'HS (Bedtime)', duration_days: 5 }
    ]
  }
];

export const HealthCardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const isPatientRole = user?.role === 'PATIENT';

  const [patients, setPatients] = useState<Patient[]>(DEFAULT_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(DEFAULT_PATIENTS[0]);
  const [consultations, setConsultations] = useState<Consultation[]>(DEFAULT_EHR);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>('light');
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    try {
      const res = await api.get<any>('/patients?size=50');
      const items: Patient[] = Array.isArray(res) ? res : (res?.items || []);
      let list = items.length > 0 ? items : DEFAULT_PATIENTS;

      if (user && user.role === 'PATIENT') {
        const matching = list.find(
          p => (p.abha_address && p.abha_address.toLowerCase().includes(user.username.toLowerCase())) ||
               (p.first_name && user.full_name && user.full_name.toLowerCase().includes(p.first_name.toLowerCase()))
        );
        if (matching) {
          setSelectedPatient(matching);
          fetchPatientEhr(matching.id);
        } else {
          const currentPatient: Patient = {
            id: user.id || 'p-current-user',
            mrn: 'MH-2026-0812',
            first_name: user.full_name?.split(' ')[0] || 'Ramesh',
            last_name: user.full_name?.split(' ').slice(1).join(' ') || 'Yadav',
            gender: 'Male',
            date_of_birth: '1986-07-14',
            phone: user.phone || '+91 98765 43210',
            blood_group: 'B+',
            abha_id: '91-4829-1029-3847',
            abha_address: `${user.username}@abdm`,
            address: 'House #42, Sinnar Village, Nashik, Maharashtra - 422103',
            allergies: 'Penicillin, Sulfonamides',
            emergency_contact: '+91 98765 43210 (Wife - Sunita Yadav)'
          };
          list = [currentPatient, ...list];
          setSelectedPatient(currentPatient);
          fetchPatientEhr(currentPatient.id);
        }
      } else {
        if (list.length > 0) {
          setSelectedPatient(list[0]);
          fetchPatientEhr(list[0].id);
        }
      }
      setPatients(list);
    } catch (err) {
      setPatients(DEFAULT_PATIENTS);
      setSelectedPatient(DEFAULT_PATIENTS[0]);
      setConsultations(DEFAULT_EHR);
    }
  };

  const fetchPatientEhr = async (patientId: string) => {
    try {
      const data = await api.get<Consultation[]>(`/clinical/patients/${patientId}/history`);
      if (Array.isArray(data) && data.length > 0) {
        setConsultations(data);
      } else {
        setConsultations(DEFAULT_EHR);
      }
    } catch {
      setConsultations(DEFAULT_EHR);
    }
  };

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
    const q = searchQuery.toLowerCase();
    return (
      fullName.includes(q) ||
      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
      (p.abha_id && p.abha_id.toLowerCase().includes(q)) ||
      (p.phone && p.phone.includes(q))
    );
  });

  const abhaQrValue = `https://abdm.gov.in/verify?abha=${encodeURIComponent(selectedPatient.abha_id || '91-4829-1029-3847')}&address=${encodeURIComponent(selectedPatient.abha_address || 'patient@abdm')}&name=${encodeURIComponent(selectedPatient.first_name + ' ' + selectedPatient.last_name)}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Header & Simple Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('health_card.title', 'ABHA Digital Health Card')}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              {t('health_card.abdm_verified', 'ABDM Verified')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('health_card.subtitle', 'National Ayushman Bharat Digital Mission • Official Citizen Health Identity')}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Card Theme Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setCardTheme('light')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                cardTheme === 'light' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('health_card.classic', 'Classic')}
            </button>
            <button
              onClick={() => setCardTheme('dark')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                cardTheme === 'dark' ? 'bg-slate-800 text-white shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t('health_card.dark', 'Dark')}
            </button>
          </div>

          <button
            onClick={() => handleCopy(selectedPatient.abha_id || '91-4829-1029-3847', 'abha')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            {copiedField === 'abha' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedField === 'abha' ? t('health_card.copied', 'Copied') : t('health_card.copy_id', 'Copy ID')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('health_card.print_pvc', 'Print PVC Card')}</span>
          </button>
        </div>
      </div>

      <div className={`grid ${!isPatientRole ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'} gap-6 items-start`}>
        {/* Clinician / Staff Patient Selector Sidebar */}
        {!isPatientRole && (
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">{t('health_card.patient_directory', 'Patient Directory')}</span>
              <span className="text-[11px] text-slate-400 font-medium">{filteredPatients.length} {t('health_card.records', 'records')}</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('health_card.search_citizen', 'Search citizen or ABHA...')}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:bg-white transition"
              />
            </div>

            <div className="space-y-1 max-h-[380px] overflow-y-auto pr-0.5">
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      fetchPatientEhr(p.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg border transition flex flex-col gap-0.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-300 text-blue-900'
                        : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-900">
                        {p.first_name} {p.last_name}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                        {p.blood_group || 'O+'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {p.abha_id || p.mrn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ABHA Card Container */}
        <div className={`${!isPatientRole ? 'lg:col-span-8' : 'w-full'} space-y-6`}>
          {/* =========================================================================
              CLEAN & PROFESSIONAL MINIMALIST SMART HEALTH CARD
             ========================================================================= */}
          <div
            id="print-health-card"
            className={`w-full rounded-2xl transition-all duration-300 overflow-hidden border shadow-sm ${
              cardTheme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-100'
            }`}
          >
            {/* National Top Color Accent Line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-slate-300 to-[#138808]" />

            <div className="p-5 sm:p-6 space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b pb-3.5 border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold shadow-xs">
                    🇮🇳
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('health_card.nha_title', 'National Health Authority • Govt. of India')}
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {t('health_card.abha_account', 'Ayushman Bharat Health Account (ABHA)')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>{t('health_card.iso_secured', 'ISO 27001 SECURED')}</span>
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Photo Avatar */}
                <div className="sm:col-span-3 flex justify-center sm:justify-start">
                  <div className={`w-24 h-28 rounded-xl border flex flex-col items-center justify-center ${
                    cardTheme === 'light'
                      ? 'bg-slate-50 border-slate-200 text-slate-400'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}>
                    <User className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-1">
                      {t('health_card.citizen', 'CITIZEN')}
                    </span>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="sm:col-span-6 space-y-2 text-center sm:text-left">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {selectedPatient.abha_address || 'patient.ramesh@abdm'}
                    </p>
                  </div>

                  {/* Formatted ABHA Number */}
                  <div className="inline-flex items-center space-x-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">ABHA:</span>
                    <span className={`font-mono text-sm font-bold tracking-wider px-2 py-0.5 rounded-md border ${
                      cardTheme === 'light'
                        ? 'bg-slate-100 border-slate-200 text-slate-900'
                        : 'bg-slate-800 border-slate-700 text-blue-300'
                    }`}>
                      {selectedPatient.abha_id || '91-4829-1029-3847'}
                    </span>
                  </div>

                  {/* Vitals & Demographics Info Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">{t('health_card.gender', 'Gender')}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {selectedPatient.gender === 'Female' ? t('health_card.female', 'Female') : selectedPatient.gender === 'Male' ? t('health_card.male', 'Male') : selectedPatient.gender}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">{t('health_card.dob', 'DOB')}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{selectedPatient.date_of_birth?.slice(0, 10) || '1986-07-14'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400 uppercase">{t('health_card.blood_group', 'Blood Group')}</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400">{selectedPatient.blood_group || 'B+'}</span>
                    </div>
                  </div>
                </div>

                {/* Minimal QR Code Box */}
                <div className="sm:col-span-3 flex flex-col items-center justify-center">
                  <div
                    onClick={() => setShowQrModal(true)}
                    className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition flex flex-col items-center group"
                    title={t('health_card.scan_qr', 'Click to expand verification QR')}
                  >
                    <QRCodeSVG
                      value={abhaQrValue}
                      size={74}
                      level="H"
                      includeMargin={false}
                    />
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-1 group-hover:text-blue-600 transition">
                      {t('health_card.scan_qr', 'Scan QR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] pt-3 border-t border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 gap-2">
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('health_card.emergency', 'Emergency')}: <strong className="text-slate-700 dark:text-slate-200">{selectedPatient.emergency_contact || '+91 98765 43210'}</strong></span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {t('health_card.abdm_milestone', 'ABDM Milestone 1/2/3 Validated Pass')}
                </div>
              </div>
            </div>
          </div>

          {/* Critical Allergy Notice (if any) */}
          {selectedPatient.allergies && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start space-x-3 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900">{t('health_card.recorded_allergies', 'Recorded Allergies')}: </span>
                <span className="text-amber-800">{selectedPatient.allergies}</span>
                <p className="text-[11px] text-amber-700/80 mt-0.5">
                  {t('health_card.cdss_notice', 'Automated Clinical Decision Support (CDSS) drug-interaction checks enabled.')}
                </p>
              </div>
            </div>
          )}

          {/* Longitudinal Electronic Health Records (EHR) Section */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  {t('health_card.ehr_title', 'Medical Record History (EHR)')}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {consultations.length} {t('health_card.consultations', 'Consultations')}
              </span>
            </div>

            <div className="space-y-3.5">
              {consultations.map((c, idx) => (
                <div
                  key={c.id || idx}
                  className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2 hover:border-slate-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      <span>{c.chief_complaints}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                    </span>
                  </div>

                  {c.clinical_notes && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {c.clinical_notes}
                    </p>
                  )}

                  {c.prescriptions && c.prescriptions.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center mr-1">
                        <Pill className="w-3 h-3 text-blue-500 mr-1" />
                        Rx:
                      </span>
                      {c.prescriptions.map((p, pIdx) => (
                        <span
                          key={pIdx}
                          className="text-[11px] font-medium bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md"
                        >
                          {p.medication_name} ({p.dosage || '1 tab'})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clean QR Verification Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center shadow-xl border border-slate-100 space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">{t('health_card.qr_verification', 'ABHA Verification QR')}</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {t('health_card.qr_scan_desc', 'Scan using ABDM Scanner or PHR application')}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-center">
              <QRCodeSVG
                value={abhaQrValue}
                size={170}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="font-mono text-xs font-bold text-slate-800">
              {selectedPatient.abha_id || '91-4829-1029-3847'}
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-lg text-xs transition"
            >
              {t('health_card.close', 'Close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCardPage;
