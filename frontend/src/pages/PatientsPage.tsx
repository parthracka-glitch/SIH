import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import {
  Search,
  Plus,
  UserCheck,
  AlertCircle,
  Phone,
  Heart,
  Activity,
  FileText,
  Video,
  Eye,
  Calendar,
  ShieldCheck,
  Download,
  Printer,
  ChevronRight,
  Filter,
  User,
  MapPin,
  Clock,
  Sparkles,
  Pill,
  CheckCircle2,
  X
} from 'lucide-react';

interface PatientRecord {
  id: string;
  mrn: string;
  abha_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  date_of_birth: string;
  age: number;
  phone: string;
  village: string;
  facility: string;
  blood_group: string;
  risk_level: 'HIGH' | 'MODERATE' | 'LOW' | 'CRITICAL';
  status: 'ACTIVE' | 'INACTIVE';
  chronic_conditions: string[];
  allergies: string[];
  last_visit: string;
  last_vitals: {
    bp: string;
    hr: number;
    spo2: number;
    sugar: number;
    temp: string;
  };
  asha_worker: string;
  past_consultations: {
    date: string;
    doctor: string;
    diagnosis: string;
    prescriptions: string[];
    notes: string;
  }[];
}

const DEMO_PATIENT_RECORDS: PatientRecord[] = [
  {
    id: 'pat-001',
    mrn: 'MRN-2026-000001',
    abha_id: '91-4432-8901-7721',
    full_name: 'Ramesh Yadav',
    first_name: 'Ramesh',
    last_name: 'Yadav',
    gender: 'MALE',
    date_of_birth: '1985-03-15',
    age: 41,
    phone: '9876543210',
    village: 'Sinnar Village',
    facility: 'Sinnar Primary Health Centre',
    blood_group: 'O+',
    risk_level: 'MODERATE',
    status: 'ACTIVE',
    chronic_conditions: ['Type-2 Diabetes', 'Mild Hypertension'],
    allergies: ['None known'],
    last_visit: '12 Sep 2026',
    last_vitals: {
      bp: '128/82',
      hr: 76,
      spo2: 98,
      sugar: 140,
      temp: '98.4°F'
    },
    asha_worker: 'Sunita Shinde (ASHA #104)',
    past_consultations: [
      {
        date: '12 Sep 2026',
        doctor: 'Dr. Priya Sharma (MD, General Medicine)',
        diagnosis: 'Type-2 Diabetes Followup — Glycemic control stable',
        prescriptions: ['Tab. Metformin PR 500mg (1-0-1)', 'Tab. Telmisartan 40mg (0-0-1)'],
        notes: 'Advised daily 30-min brisk walk. HbA1c to be repeated in 3 months.'
      },
      {
        date: '18 Jul 2026',
        doctor: 'Dr. Ramesh Patil (MBBS)',
        diagnosis: 'Routine Non-Communicable Disease (NCD) Screening',
        prescriptions: ['Tab. Metformin 500mg (1-0-0)'],
        notes: 'Blood sugar fasting tested at 155 mg/dL. Commenced metformin therapy.'
      }
    ]
  },
  {
    id: 'pat-002',
    mrn: 'MRN-2026-000002',
    abha_id: '91-8821-4902-3112',
    full_name: 'Kavita Gurjar',
    first_name: 'Kavita',
    last_name: 'Gurjar',
    gender: 'FEMALE',
    date_of_birth: '1995-06-12',
    age: 31,
    phone: '9811223344',
    village: 'Bagru Ward 4',
    facility: 'Bagru Health Sub-Centre',
    blood_group: 'B+',
    risk_level: 'HIGH',
    status: 'ACTIVE',
    chronic_conditions: ['Antenatal Care (ANC Tri-3)', 'Mild Anemia'],
    allergies: ['Sulfa drugs'],
    last_visit: '20 Sep 2026',
    last_vitals: {
      bp: '110/72',
      hr: 88,
      spo2: 99,
      sugar: 96,
      temp: '98.6°F'
    },
    asha_worker: 'Kavita Rao (ASHA #108)',
    past_consultations: [
      {
        date: '20 Sep 2026',
        doctor: 'Dr. Anjali Deshmukh (OBGYN)',
        diagnosis: 'High Risk Pregnancy Routine ANC Followup (Week 32)',
        prescriptions: ['Tab. IFA (Iron + Folic Acid) OD', 'Tab. Calcium 500mg BD'],
        notes: 'Fetal heart rate normal at 142 bpm. Hemoglobin is 10.4 g/dL. Scheduled institutional delivery.'
      }
    ]
  },
  {
    id: 'pat-003',
    mrn: 'MRN-2026-000003',
    abha_id: '91-7721-0043-9811',
    full_name: 'Gopal Singh Rao',
    first_name: 'Gopal',
    last_name: 'Singh Rao',
    gender: 'MALE',
    date_of_birth: '1955-11-05',
    age: 71,
    phone: '9876543212',
    village: 'Bassi Khurd',
    facility: 'Bassi Rural Dispensary',
    blood_group: 'A+',
    risk_level: 'CRITICAL',
    status: 'ACTIVE',
    chronic_conditions: ['COPD / Chronic Dyspnea', 'Uncontrolled Diabetes'],
    allergies: ['Penicillin', 'Dust'],
    last_visit: '15 Sep 2026',
    last_vitals: {
      bp: '148/94',
      hr: 92,
      spo2: 94,
      sugar: 188,
      temp: '99.1°F'
    },
    asha_worker: 'Meera Bai (ASHA #112)',
    past_consultations: [
      {
        date: '15 Sep 2026',
        doctor: 'Dr. Priya Sharma (MD, Physician)',
        diagnosis: 'Acute Exacerbation of COPD with High Fasting Sugar',
        prescriptions: ['Inhaler Budesonide + Formoterol 200mcg', 'Tab. Metformin PR 500mg BD', 'Syp. Terbutaline Expectorant'],
        notes: 'Referred for Spirometry at District Hospital. Oxygen saturation monitored via ASHA.'
      }
    ]
  },
  {
    id: 'pat-004',
    mrn: 'MRN-2026-000004',
    abha_id: '91-6629-1144-8833',
    full_name: 'Sita Devi Sharma',
    first_name: 'Sita Devi',
    last_name: 'Sharma',
    gender: 'FEMALE',
    date_of_birth: '1992-07-22',
    age: 34,
    phone: '9876543211',
    village: 'Chaksu Tehsil',
    facility: 'Chaksu Health Sub-Centre',
    blood_group: 'B+',
    risk_level: 'LOW',
    status: 'ACTIVE',
    chronic_conditions: ['Post-natal Routine Checkup'],
    allergies: ['None'],
    last_visit: '08 Sep 2026',
    last_vitals: {
      bp: '114/74',
      hr: 72,
      spo2: 99,
      sugar: 92,
      temp: '98.2°F'
    },
    asha_worker: 'Anita Kumari (ASHA #115)',
    past_consultations: [
      {
        date: '08 Sep 2026',
        doctor: 'Dr. Ramesh Patil (MBBS)',
        diagnosis: 'Post-partum 6-week wellbeing & immunization counseling',
        prescriptions: ['Cap. Calcium Carbonate 500mg OD', 'Syp. Multivitamin 10ml OD'],
        notes: 'Infant immunization schedule up to date. Exclusive breastfeeding advised.'
      }
    ]
  },
  {
    id: 'pat-005',
    mrn: 'MRN-2026-000005',
    abha_id: '91-3310-8472-1102',
    full_name: 'Savita Kailash More',
    first_name: 'Savita',
    last_name: 'More',
    gender: 'FEMALE',
    date_of_birth: '1990-04-18',
    age: 36,
    phone: '9876543213',
    village: 'Sinnar Village',
    facility: 'Sinnar PHC',
    blood_group: 'AB+',
    risk_level: 'HIGH',
    status: 'ACTIVE',
    chronic_conditions: ['Severe Seasonal Pyrexia / Malaria Suspect'],
    allergies: ['Ciprofloxacin'],
    last_visit: '22 Sep 2026',
    last_vitals: {
      bp: '118/76',
      hr: 102,
      spo2: 97,
      sugar: 110,
      temp: '102.2°F'
    },
    asha_worker: 'Sunita Shinde (ASHA #104)',
    past_consultations: [
      {
        date: '22 Sep 2026',
        doctor: 'Dr. Priya Sharma (MD)',
        diagnosis: 'Acute febrile illness with rigors — blood smear negative for MP',
        prescriptions: ['Tab. Paracetamol IP 650mg (1-1-1)', 'ORS Sachet (1L daily)'],
        notes: 'Cold sponging advised. Advised re-evaluation if fever continues past 48h.'
      }
    ]
  },
  {
    id: 'pat-006',
    mrn: 'MRN-2026-000006',
    abha_id: '91-1209-5561-3990',
    full_name: 'Arjun Meena',
    first_name: 'Arjun',
    last_name: 'Meena',
    gender: 'MALE',
    date_of_birth: '2010-09-18',
    age: 16,
    phone: '9876543214',
    village: 'Bagru Ward 2',
    facility: 'Bagru Sub-Centre',
    blood_group: 'O-',
    risk_level: 'LOW',
    status: 'ACTIVE',
    chronic_conditions: ['Adolescent Health & Routine Checkup'],
    allergies: ['None'],
    last_visit: '01 Sep 2026',
    last_vitals: {
      bp: '108/68',
      hr: 70,
      spo2: 99,
      sugar: 88,
      temp: '98.0°F'
    },
    asha_worker: 'Kavita Rao (ASHA #108)',
    past_consultations: [
      {
        date: '01 Sep 2026',
        doctor: 'Dr. Ramesh Patil (MBBS)',
        diagnosis: 'School health screening & WIFS supplementation',
        prescriptions: ['Tab. Albendazole 400mg (Single dose)', 'Tab. WIFS Iron weekly'],
        notes: 'Deworming completed. Nutritional status normal.'
      }
    ]
  }
];

export const PatientsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [villageFilter, setVillageFilter] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Patient Form State
  const [formName, setFormName] = useState('');
  const [formGender, setFormGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [formAge, setFormAge] = useState('35');
  const [formPhone, setFormPhone] = useState('');
  const [formVillage, setFormVillage] = useState('Sinnar Village');
  const [formBloodGroup, setFormBloodGroup] = useState('O+');
  const [formCondition, setFormCondition] = useState('Hypertension / Diabetes');

  const [records, setRecords] = useState<PatientRecord[]>(DEMO_PATIENT_RECORDS);

  // Filter records
  const filteredRecords = records.filter(pat => {
    const matchesSearch =
      pat.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.abha_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pat.phone.includes(searchQuery) ||
      pat.village.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || pat.risk_level === riskFilter;
    const matchesVillage = villageFilter === 'ALL' || pat.village.includes(villageFilter);

    return matchesSearch && matchesRisk && matchesVillage;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newRecord: PatientRecord = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      mrn: `MRN-2026-${String(records.length + 1).padStart(6, '0')}`,
      abha_id: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: formName,
      first_name: formName.split(' ')[0],
      last_name: formName.split(' ')[1] || '',
      gender: formGender,
      date_of_birth: '1990-01-01',
      age: parseInt(formAge) || 35,
      phone: formPhone || '9876543200',
      village: formVillage,
      facility: `${formVillage} Primary Health Station`,
      blood_group: formBloodGroup,
      risk_level: 'MODERATE',
      status: 'ACTIVE',
      chronic_conditions: [formCondition],
      allergies: ['None recorded'],
      last_visit: 'Today',
      last_vitals: {
        bp: '120/80',
        hr: 75,
        spo2: 98,
        sugar: 105,
        temp: '98.4°F'
      },
      asha_worker: 'Sunita Shinde (ASHA #104)',
      past_consultations: [
        {
          date: 'Today',
          doctor: 'Dr. Priya Sharma (MD)',
          diagnosis: 'Initial Clinical Registration & ABHA Linkage',
          prescriptions: ['Routine Multivitamin'],
          notes: 'Enrolled under National Health Mission rural registry.'
        }
      ]
    };

    setRecords([newRecord, ...records]);
    setIsRegisterOpen(false);
    setFormName('');
    setFormPhone('');
    alert(`✓ Patient ${newRecord.full_name} successfully enrolled with ABHA ID: ${newRecord.abha_id}`);
  };

  return (
    <div className="space-y-5 pb-12 font-sans">
      {/* 1. TOP HEADER & METRICS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              ABDM Patient Health Records
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              National Health Stack
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized Electronic Health Records (EHR), longitudinal clinical history, and ABHA digital dossiers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Enroll New Patient</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Registered Citizens</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{records.length} Records</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Chronic NCD Tracked</p>
            <p className="text-lg font-bold text-amber-600 mt-0.5">
              {records.filter(r => r.chronic_conditions.length > 0).length} Patients
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">High Risk / Critical</p>
            <p className="text-lg font-bold text-red-600 mt-0.5">
              {records.filter(r => r.risk_level === 'HIGH' || r.risk_level === 'CRITICAL').length} Cases
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Generic PMBJP Coverage</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">96.4% ABDM</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by Patient Name, ABHA ID, MRN, Mobile, or Village..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Risk Filter */}
          <div className="md:col-span-3">
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Clinical Triage Tiers</option>
              <option value="CRITICAL">Critical / Urgent</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate</option>
              <option value="LOW">Low Risk / Routine</option>
            </select>
          </div>

          {/* Village Filter */}
          <div className="md:col-span-3">
            <select
              value={villageFilter}
              onChange={e => setVillageFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="ALL">All Villages & Sub-Centres</option>
              <option value="Sinnar">Sinnar Village</option>
              <option value="Bagru">Bagru Ward</option>
              <option value="Bassi">Bassi Khurd</option>
              <option value="Chaksu">Chaksu Tehsil</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. PATIENTS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-3.5">MRN / ABHA ID</th>
                <th className="py-3 px-3.5">PATIENT DETAILS</th>
                <th className="py-3 px-3.5">VILLAGE / FACILITY</th>
                <th className="py-3 px-3.5">PRIMARY DIAGNOSIS / NCD</th>
                <th className="py-3 px-3.5">LAST VITALS</th>
                <th className="py-3 px-3.5">TRIAGE</th>
                <th className="py-3 px-3.5 text-right">CLINICAL ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No matching patient records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(pat => (
                  <tr
                    key={pat.id}
                    className="hover:bg-blue-50/40 transition group cursor-pointer"
                    onClick={() => setSelectedPatient(pat)}
                  >
                    {/* MRN & ABHA */}
                    <td className="py-3 px-3.5 font-mono text-[11px] whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{pat.mrn}</span>
                      <span className="text-[10px] text-slate-400">{pat.abha_id}</span>
                    </td>

                    {/* Name & Demographics */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-semibold text-xs text-slate-900 group-hover:text-blue-600 transition flex items-center space-x-1.5">
                        <span>{pat.full_name}</span>
                        <span className="text-[10px] font-normal text-slate-400">({pat.blood_group})</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {pat.age} yrs • {pat.gender} • {pat.phone}
                      </span>
                    </td>

                    {/* Village & Center */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="text-slate-800 font-medium block">{pat.village}</span>
                      <span className="text-[10px] text-slate-400">{pat.facility}</span>
                    </td>

                    {/* Chronic / Diagnosis */}
                    <td className="py-3 px-3.5">
                      <div className="flex flex-wrap gap-1">
                        {pat.chronic_conditions.map((cond, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Last Vitals */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-[11px]">
                      <span className="font-medium text-slate-800 block">BP {pat.last_vitals.bp}</span>
                      <span className="text-[10px] text-slate-400">
                        SpO2 {pat.last_vitals.spo2}% • Sugar {pat.last_vitals.sugar}
                      </span>
                    </td>

                    {/* Risk Level */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          pat.risk_level === 'CRITICAL'
                            ? 'bg-red-100 text-red-700 animate-pulse'
                            : pat.risk_level === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : pat.risk_level === 'MODERATE'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {pat.risk_level}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedPatient(pat);
                        }}
                        className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200/80 transition inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View EHR</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. COMPREHENSIVE PATIENT EHR DOSSIER MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white rounded-t-2xl flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">{selectedPatient.full_name}</h2>
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-400/30">
                      {selectedPatient.risk_level} TRIAGE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-mono">
                    ABHA: {selectedPatient.abha_id} • {selectedPatient.mrn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 text-xs">
              {/* Demographics & Vitals Snapshot */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Age / Gender</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.age} yrs • {selectedPatient.gender}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.blood_group}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Village Origin</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.village}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Phone</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{selectedPatient.phone}</p>
                </div>
              </div>

              {/* Live Vitals Telemetry */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Latest Clinical Vitals (Logged by {selectedPatient.asha_worker})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">BP</span>
                    <strong className="text-slate-900 font-bold">{selectedPatient.last_vitals.bp} mmHg</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <strong className="text-slate-900 font-bold">{selectedPatient.last_vitals.hr} bpm</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <strong className="text-slate-900 font-bold">{selectedPatient.last_vitals.spo2}%</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                    <span className="text-[10px] text-slate-400 block">Blood Sugar</span>
                    <strong className="text-slate-900 font-bold">{selectedPatient.last_vitals.sugar} mg/dL</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <strong className="text-slate-900 font-bold">{selectedPatient.last_vitals.temp}</strong>
                  </div>
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Chronic Conditions & Diagnoses
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.chronic_conditions.map((cond, i) => (
                      <span key={i} className="bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {cond}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50/70 p-3 rounded-xl border border-red-200/70">
                  <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-1">
                    Known Drug Allergies & Adverse Reactions
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedPatient.allergies.map((all, i) => (
                      <span key={i} className="bg-red-100 text-red-900 text-[10px] font-semibold px-2 py-0.5 rounded">
                        {all}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Longitudinal Consultation History */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Past ABDM Clinical Consultations & Prescriptions
                </span>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {selectedPatient.past_consultations.map((c, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{c.doctor}</span>
                        <span className="text-[10px] text-slate-400">{c.date}</span>
                      </div>
                      <p className="text-slate-800 font-medium text-[11px]">{c.diagnosis}</p>
                      <div className="bg-white p-2 rounded-lg border border-slate-200/60 text-[10px] space-y-0.5">
                        <strong className="text-slate-700">Generic Prescriptions:</strong>
                        <ul className="list-disc pl-3 text-slate-600">
                          {c.prescriptions.map((p, pIdx) => (
                            <li key={pIdx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-[10px] text-slate-500 italic">Notes: {c.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print ABDM Health Summary</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      navigate('/teleconsult');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Start Teleconsult</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedPatient(null);
                      navigate('/doctor');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Open in OPD Console</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ENROLL PATIENT MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Enroll Citizen in ABDM EHR</span>
              </h3>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Citizen Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh Yadav"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={e => setFormGender(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Age</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={e => setFormAge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Blood Group</label>
                  <select
                    value={formBloodGroup}
                    onChange={e => setFormBloodGroup(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Village / PHC Spoke</label>
                <select
                  value={formVillage}
                  onChange={e => setFormVillage(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="Sinnar Village">Sinnar Village</option>
                  <option value="Bagru Ward">Bagru Ward</option>
                  <option value="Bassi Khurd">Bassi Khurd</option>
                  <option value="Chaksu Tehsil">Chaksu Tehsil</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Primary Health Condition</label>
                <input
                  type="text"
                  value={formCondition}
                  onChange={e => setFormCondition(e.target.value)}
                  placeholder="e.g. Type-2 Diabetes / Hypertension"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Enroll Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsPage;
