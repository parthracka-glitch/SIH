import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/auth';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Pill,
  AlertTriangle,
  Clock,
  Search,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ArrowDownToLine,
  X,
  Printer,
  Calendar,
  ShieldCheck,
  MapPin,
  TrendingDown,
  Check,
  FileText,
  Phone,
  ExternalLink,
  ChevronRight,
  Info,
  Navigation,
  MessageCircle,
  Copy,
  Share2,
  Compass,
  Store
} from 'lucide-react';

/* =========================================================================
   1. CITIZEN / PATIENT DEDICATED PRESCRIPTION & MEDS PORTAL
   ========================================================================= */
const CitizenPharmacyView: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [doseTracker, setDoseTracker] = useState({
    morning: true,
    afternoon: false,
    night: false,
  });

  const [activeTab, setActiveTab] = useState<'prescriptions' | 'schedule' | 'kendra'>('prescriptions');

  const myPrescriptions = [
    {
      id: 'rx-01',
      name: 'Tab. Metformin 500mg',
      generic_salt: 'Metformin Hydrochloride (500mg)',
      indication: 'Blood Sugar / Type-2 Diabetes Care',
      dosage: '1 Tablet',
      frequency: 'Twice daily (BD) — After Breakfast & Dinner',
      days_left: 18,
      total_days: 30,
      prescribed_by: 'Dr. Priya Sharma (MD)',
      date: '12 Sep 2026',
      pmbjp_code: 'PMBJP-DM-04',
      branded_price: '₹180',
      jan_aushadhi_price: '₹24',
      savings_pct: '86%',
      status: 'ACTIVE'
    },
    {
      id: 'rx-02',
      name: 'Tab. Telmisartan 40mg',
      generic_salt: 'Telmisartan (40mg)',
      indication: 'Blood Pressure Regulation',
      dosage: '1 Tablet',
      frequency: 'Once daily (OD) — Morning after Breakfast',
      days_left: 18,
      total_days: 30,
      prescribed_by: 'Dr. Priya Sharma (MD)',
      date: '12 Sep 2026',
      pmbjp_code: 'PMBJP-CV-12',
      branded_price: '₹220',
      jan_aushadhi_price: '₹32',
      savings_pct: '85%',
      status: 'ACTIVE'
    },
    {
      id: 'rx-03',
      name: 'Tab. Paracetamol 650mg',
      generic_salt: 'Paracetamol IP (650mg)',
      indication: 'Fever / Body Ache',
      dosage: '1 Tablet',
      frequency: 'SOS (As needed when fever > 99°F)',
      days_left: 5,
      total_days: 5,
      prescribed_by: 'Dr. Priya Sharma (MD)',
      date: '12 Sep 2026',
      pmbjp_code: 'PMBJP-AL-01',
      branded_price: '₹35',
      jan_aushadhi_price: '₹7',
      savings_pct: '80%',
      status: 'AS_NEEDED'
    }
  ];

  const [showRxModal, setShowRxModal] = useState(false);

  const generatePrescriptionHtml = () => {
    const patientName = user?.full_name || 'Ramesh Yadav';
    const abhaAddress = user?.username ? `${user.username}@abdm` : 'patient.ramesh@abdm';
    const abhaId = '91-4829-1029-3847';
    const date = '12 Sep 2026';
    const rxNumber = 'RX-OPD-2026-8491';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official E-Prescription — ${patientName} (${rxNumber})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
    body { background-color: #f8fafc; padding: 24px; color: #1e293b; }
    .page { background: #fff; max-width: 800px; margin: 0 auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    @media print {
      body { background: #fff; padding: 0; }
      .page { box-shadow: none; border: none; max-width: 100%; padding: 20px; }
      .no-print { display: none !important; }
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px; }
    .header-logo { display: flex; align-items: center; gap: 12px; }
    .emblem { width: 52px; height: 52px; background: linear-gradient(135deg, #1d4ed8, #0d9488); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 20px; }
    .hospital-title { font-size: 18px; font-weight: 800; color: #0f172a; line-height: 1.2; }
    .hospital-subtitle { font-size: 11px; color: #64748b; margin-top: 3px; font-weight: 600; }
    .abdm-badge { text-align: right; }
    .abdm-tag { display: inline-block; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
    .rx-meta { font-size: 11px; color: #64748b; margin-top: 4px; font-weight: 600; }
    
    .patient-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; font-size: 11px; margin-bottom: 20px; }
    .field-label { font-size: 9px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px; }
    .field-val { font-size: 12px; font-weight: 700; color: #0f172a; }

    .vitals-bar { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 20px; }
    .vital-item { font-weight: 700; color: #166534; }
    .vital-item span { color: #15803d; font-weight: 800; }

    .section-title { font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .rx-symbol { font-size: 24px; font-weight: 900; color: #0284c7; font-family: serif; }

    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 20px; }
    th { background: #f1f5f9; padding: 8px 10px; text-align: left; font-weight: 800; color: #475569; border-bottom: 1px solid #cbd5e1; font-size: 10px; text-transform: uppercase; }
    td { padding: 10px; border-bottom: 1px solid #f1f5f9; color: #1e293b; vertical-align: middle; }
    .med-name { font-weight: 800; color: #0f172a; font-size: 12px; }
    .med-generic { font-size: 10px; color: #64748b; margin-top: 2px; }
    .pmbjp-badge { display: inline-block; background: #ecfdf5; color: #047857; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; border: 1px solid #a7f3d0; }

    .savings-card { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-bottom: 20px; }
    .savings-num { font-size: 14px; font-weight: 800; color: #047857; }

    .advice-box { background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 14px; font-size: 11px; margin-bottom: 24px; }
    .advice-box ul { padding-left: 18px; margin-top: 4px; }
    .advice-box li { margin-bottom: 3px; color: #78350f; font-weight: 500; }

    .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 20px; }
    .doctor-sig { text-align: right; }
    .doc-name { font-size: 13px; font-weight: 800; color: #0f172a; }
    .doc-reg { font-size: 10px; color: #64748b; margin-top: 2px; }
    .sig-line { width: 140px; border-top: 1px solid #94a3b8; margin-top: 24px; margin-bottom: 4px; margin-left: auto; }
    .disclaimer { font-size: 9px; color: #94a3b8; max-width: 450px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-logo">
        <div class="emblem">AM</div>
        <div>
          <h1 class="hospital-title">Sinnar Sub-District Hospital & Trauma Centre</h1>
          <p class="hospital-subtitle">Government of Maharashtra • Public Health Department • ABDM Certified PHC</p>
          <p class="hospital-subtitle">Sinnar Main Road, Nashik, Maharashtra - 422103 • Tel: 0253-289100</p>
        </div>
      </div>
      <div class="abdm-badge">
        <span class="abdm-tag">ABDM M3 COMPLIANT</span>
        <p class="rx-meta">Prescription #: <strong>${rxNumber}</strong></p>
        <p class="rx-meta">Date: <strong>${date}</strong></p>
      </div>
    </div>

    <div class="patient-box">
      <div>
        <div class="field-label">Patient Name</div>
        <div class="field-val">${patientName}</div>
      </div>
      <div>
        <div class="field-label">ABHA Number</div>
        <div class="field-val">${abhaId}</div>
      </div>
      <div>
        <div class="field-label">ABHA Address</div>
        <div class="field-val">${abhaAddress}</div>
      </div>
      <div>
        <div class="field-label">Age / Gender</div>
        <div class="field-val">38 Yrs / Male</div>
      </div>
    </div>

    <div class="vitals-bar">
      <div class="vital-item">Blood Pressure: <span>120/80 mmHg (Normal)</span></div>
      <div class="vital-item">Pulse: <span>74 bpm</span></div>
      <div class="vital-item">SpO2: <span>98% Air</span></div>
      <div class="vital-item">Fasting Sugar: <span>115 mg/dL</span></div>
    </div>

    <div class="section-title">
      <span>Clinical Diagnosis: Type-2 Diabetes Mellitus (E11.9) & Essential Hypertension (I10)</span>
      <span class="rx-symbol">℞</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Medicine Name & Generic Salt</th>
          <th>Dosage & Frequency</th>
          <th>Duration</th>
          <th>PMBJP Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1</strong></td>
          <td>
            <div class="med-name">Tab. Metformin Hydrochloride 500mg</div>
            <div class="med-generic">Generic: Metformin IP (500mg) • Blood Sugar Regulation</div>
          </td>
          <td><strong>1 Tablet Twice Daily (BD)</strong><br><span style="color:#64748b;font-size:10px;">After Breakfast & Dinner</span></td>
          <td>30 Days (60 Tabs)</td>
          <td><span class="pmbjp-badge">₹24</span> <span style="text-decoration:line-through;color:#94a3b8;font-size:9px;">₹180</span></td>
        </tr>
        <tr>
          <td><strong>2</strong></td>
          <td>
            <div class="med-name">Tab. Telmisartan 40mg</div>
            <div class="med-generic">Generic: Telmisartan IP (40mg) • Blood Pressure Management</div>
          </td>
          <td><strong>1 Tablet Once Daily (OD)</strong><br><span style="color:#64748b;font-size:10px;">Morning After Breakfast</span></td>
          <td>30 Days (30 Tabs)</td>
          <td><span class="pmbjp-badge">₹32</span> <span style="text-decoration:line-through;color:#94a3b8;font-size:9px;">₹220</span></td>
        </tr>
        <tr>
          <td><strong>3</strong></td>
          <td>
            <div class="med-name">Tab. Paracetamol 650mg</div>
            <div class="med-generic">Generic: Paracetamol IP (650mg) • Fever / Body Ache</div>
          </td>
          <td><strong>1 Tablet SOS</strong><br><span style="color:#64748b;font-size:10px;">As needed if fever > 99°F</span></td>
          <td>5 Days (10 Tabs)</td>
          <td><span class="pmbjp-badge">₹7</span> <span style="text-decoration:line-through;color:#94a3b8;font-size:9px;">₹35</span></td>
        </tr>
      </tbody>
    </table>

    <div class="savings-card">
      <div>
        <strong>Pradhan Mantri Jan Aushadhi (PMBJP) Generic Savings:</strong>
        <p style="color:#065f46;font-size:10px;margin-top:2px;">You save ₹372 on this prescription by choosing Jan Aushadhi Kendras over branded alternatives.</p>
      </div>
      <div class="savings-num">Total Rx Cost: ₹63 (Save 85%)</div>
    </div>

    <div class="advice-box">
      <strong>Doctor's Advice & Lifestyle Instructions:</strong>
      <ul>
        <li>Limit daily salt intake to under 1 teaspoon. Strictly avoid salted pickles, papads, and namkeen.</li>
        <li>Brisk walk for at least 30-40 minutes every morning. Maintain adequate fluid intake.</li>
        <li>Take generic Metformin and Telmisartan continuously without skipping doses.</li>
        <li><strong>Next Follow-up OPD Visit:</strong> 12 Oct 2026 at Sinnar PHC / Sub-District Hospital.</li>
      </ul>
    </div>

    <div class="footer">
      <div class="disclaimer">
        This is a digitally generated e-prescription under the Ayushman Bharat Digital Mission (ABDM). Valid across all Govt. Jan Aushadhi Kendras & registered pharmacies in India.
      </div>
      <div class="doctor-sig">
        <div class="sig-line"></div>
        <div class="doc-name">Dr. Priya Sharma (MBBS, MD)</div>
        <div class="doc-reg">Reg. No: MMC-2018/04/1829</div>
        <div class="doc-reg">Medical Officer, Sinnar SDH</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  const handleDownloadAndPrint = () => {
    const htmlContent = generatePrescriptionHtml();
    const patientName = user?.full_name || 'Ramesh Yadav';
    const filename = `Arogya_Prescription_${patientName.replace(/\s+/g, '_')}_12Sep2026.html`;

    // 1. Trigger Direct File Download for instant offline access
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 2. Open dedicated Print Window configured for Save as PDF / Paper Print
    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const toggleDose = (period: 'morning' | 'afternoon' | 'night') => {
    setDoseTracker(prev => ({ ...prev, [period]: !prev[period] }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('pharmacy.title', 'My Prescriptions & Jan Aushadhi Meds')}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-blue-600" />
              {t('citizen.abha_linked', 'ABDM Linked')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('pharmacy.subtitle', 'Active doctor e-prescriptions, daily dose schedule & PMBJP generic cost savings')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadAndPrint}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-md cursor-pointer active:scale-95"
            title="Download & Print Doctor Prescription"
          >
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
            <span>{t('pharmacy.print_rx', 'Download & Print Prescription')}</span>
          </button>
        </div>
      </div>

      {/* Citizen Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">{t('pharmacy.active_prescriptions', 'Active Medicines')}</div>
          <div className="text-xl font-bold text-slate-900 mt-1">3 {t('citizen.my_prescriptions', 'Prescribed')}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">{t('citizen.status_optimal', 'Optimal')}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">{t('pharmacy.today_intake', "Today's Dose Intake")}</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {Object.values(doseTracker).filter(Boolean).length} of 3
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
            {Math.round((Object.values(doseTracker).filter(Boolean).length / 3) * 100)}% {t('pharmacy.completed', 'completed')}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">{t('pharmacy.savings', 'PMBJP Generic Savings')}</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">₹374 {t('pharmacy.savings', 'Saved')}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">~85% {t('pharmacy.savings', 'less than branded')}</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs">
          <div className="text-[11px] font-medium text-slate-500">{t('pharmacy.next_refill', 'Next Refill Due')}</div>
          <div className="text-xl font-bold text-slate-900 mt-1">18 Days</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">Sinnar PHC Kendra</div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-2.5 transition border-b-2 cursor-pointer ${
            activeTab === 'prescriptions'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('pharmacy.active_prescriptions', 'Active E-Prescriptions')} ({myPrescriptions.length})
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`pb-2.5 transition border-b-2 cursor-pointer ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('pharmacy.today_intake', 'Daily Dose Schedule & Tracker')}
        </button>
        <button
          onClick={() => setActiveTab('kendra')}
          className={`pb-2.5 transition border-b-2 cursor-pointer ${
            activeTab === 'kendra'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          {t('pharmacy.kendra_locator', 'Nearby Jan Aushadhi Kendra Store')}
        </button>
      </div>

      {/* Tab 1: Active Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {myPrescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-900">{rx.name}</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">
                      {rx.pmbjp_code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{rx.generic_salt} • {rx.indication}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">Supply: {rx.days_left} Days Left</span>
                  <div className="w-28 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${(rx.days_left / rx.total_days) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Dosage & Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Dosage & Frequency</span>
                  <span className="font-bold text-slate-800">{rx.frequency}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Prescribing Doctor</span>
                  <span className="font-semibold text-slate-700">{rx.prescribed_by}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase">Jan Aushadhi PMBJP Cost</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-emerald-600">{rx.jan_aushadhi_price}</span>
                    <span className="line-through text-slate-400 text-[11px]">{rx.branded_price}</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1 rounded">Save {rx.savings_pct}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Daily Dose Tracker */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Today's Medication Schedule</h3>
              <p className="text-xs text-slate-500">Tap to check off doses after taking your medicine</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Today, {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="space-y-3">
            <div
              onClick={() => toggleDose('morning')}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                doseTracker.morning ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                  doseTracker.morning ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                }`}>
                  {doseTracker.morning && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Morning Dose (8:00 AM - After Breakfast)</div>
                  <div className="text-[11px] text-slate-500">Tab. Metformin 500mg (1 tab) + Tab. Telmisartan 40mg (1 tab)</div>
                </div>
              </div>
              <span className={`text-[11px] font-bold ${doseTracker.morning ? 'text-emerald-700' : 'text-slate-400'}`}>
                {doseTracker.morning ? 'Completed' : 'Pending'}
              </span>
            </div>

            <div
              onClick={() => toggleDose('afternoon')}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                doseTracker.afternoon ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                  doseTracker.afternoon ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                }`}>
                  {doseTracker.afternoon && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Afternoon Dose (1:30 PM - After Lunch)</div>
                  <div className="text-[11px] text-slate-500">Tab. Paracetamol 650mg (Only if bodyache/fever present)</div>
                </div>
              </div>
              <span className={`text-[11px] font-bold ${doseTracker.afternoon ? 'text-emerald-700' : 'text-slate-400'}`}>
                {doseTracker.afternoon ? 'Completed' : 'Pending (Optional)'}
              </span>
            </div>

            <div
              onClick={() => toggleDose('night')}
              className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                doseTracker.night ? 'bg-emerald-50/60 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                  doseTracker.night ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-300'
                }`}>
                  {doseTracker.night && <Check className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Night Dose (8:30 PM - After Dinner)</div>
                  <div className="text-[11px] text-slate-500">Tab. Metformin 500mg (1 tab) with warm water</div>
                </div>
              </div>
              <span className={`text-[11px] font-bold ${doseTracker.night ? 'text-emerald-700' : 'text-slate-400'}`}>
                {doseTracker.night ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Jan Aushadhi Kendra Locator */}
      {activeTab === 'kendra' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Store className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Pradhan Mantri Jan Aushadhi Kendra (PMBJP) Stores
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Govt.-certified generic medicine outlets in your block offering 50% to 90% discount on all doctor prescriptions.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="tel:18001808080"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                title="National Jan Aushadhi Toll-Free Helpline"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>Helpline: 1800-180-8080</span>
              </a>
            </div>
          </div>

          {/* Primary / Nearest Store Featured Card */}
          <div className="bg-gradient-to-br from-blue-50/70 via-white to-teal-50/40 rounded-2xl border-2 border-blue-200 p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Nearest Outlet (1.2 km)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Open Now</span>
                  </span>
                </div>

                <h4 className="text-base font-black text-slate-900">
                  PMBJP Kendra #418 — Sinnar Community Complex
                </h4>

                <p className="text-xs text-slate-700 font-medium flex items-start space-x-1.5 pt-0.5">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Shop No. 4, Ground Floor, Opp. Sub-District Hospital, Sinnar Main Road, Sinnar, Nashik, Maharashtra — 422103</span>
                </p>

                <p className="text-[11px] text-slate-500 italic pl-5">
                  Landmark: Right opposite Sub-District Hospital Gate #2 • 2 mins walk from Sinnar Central ST Stand
                </p>
              </div>

              {/* Fast 1-Click Action Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 pt-1">
                <a
                  href="tel:+91253289104"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store (+91 253 289104)</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Pradhan+Mantri+Jan+Aushadhi+Kendra+Sinnar+Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open in Google Maps</span>
                </a>

                <a
                  href="https://wa.me/919823045678?text=Namaste%20Pharmacist,%20I%20want%20to%20confirm%20stock%20for%20my%20prescribed%20Jan%20Aushadhi%20medicines%20(Metformin,%20Telmisartan)."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-xl text-xs font-bold shadow transition flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Refill</span>
                </a>
              </div>
            </div>

            {/* Store Specs & Pharmacist Contact Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 text-xs">
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Store Timings</span>
                <p className="font-bold text-slate-800">8:00 AM — 9:00 PM</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Open All 7 Days</p>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Pharmacist in Charge</span>
                <p className="font-bold text-slate-800">Shri Rajesh Patil (D.Pharm)</p>
                <p className="text-[10px] text-slate-500 font-medium">Mob: +91 98230 45678</p>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Medicine Availability</span>
                <p className="font-bold text-emerald-700 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                  <span>All 3 Prescriptions in Stock</span>
                </p>
                <p className="text-[10px] text-slate-500">100% Generic Match</p>
              </div>
            </div>
          </div>

          {/* Secondary Nearby Jan Aushadhi Stores List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
              Other Certified Jan Aushadhi Kendras in Sinnar Tehsil
            </h4>

            {/* Store 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h5 className="font-bold text-sm text-slate-900">
                    PMBJP Kendra #512 — Sinnar Central Bus Stand
                  </h5>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    3.4 km
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Shop 12, Station Road, Opp. ST Depo, Sinnar, Nashik - 422103
                </p>
                <p className="text-[11px] text-slate-500">
                  Pharmacist: Smt. Sunita Shinde • Hours: 7:30 AM – 9:30 PM • Mob: +91 94222 78901
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href="tel:+919422278901"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sinnar+Bus+Stand+Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Directions</span>
                </a>
              </div>
            </div>

            {/* Store 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:border-blue-400 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h5 className="font-bold text-sm text-slate-900">
                    PMBJP Kendra #605 — Bagru Highway Junction
                  </h5>
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    6.8 km
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Near Bagru Primary Health Sub-Centre, Nashik-Pune Highway, Sinnar - 422103
                </p>
                <p className="text-[11px] text-slate-500">
                  Pharmacist: Shri Amit Deshmukh • Hours: 9:00 AM – 8:00 PM • Mob: +91 98900 12345
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href="tel:+919890012345"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call</span>
                </a>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Bagru+Sinnar+Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-xs transition flex items-center space-x-1 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. DOCTOR / CLINICIAN DEDICATED JAN AUSHADHI FORMULARY & PRICE INDEX
   ========================================================================= */
const DoctorJanAushadhiFormularyView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hospitalStocks, setHospitalStocks] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'substitutor'>('catalog');

  useEffect(() => {
    api.get('/inventory/stocks')
      .then((res) => setHospitalStocks(res || []))
      .catch(() => setHospitalStocks([]));
  }, []);

  const categories = [
    { id: 'ALL', label: 'All Medications' },
    { id: 'DIABETES', label: 'Antidiabetics' },
    { id: 'CARDIAC', label: 'Cardiovascular & BP' },
    { id: 'ANTIBIOTIC', label: 'Antibiotics & Antimicrobials' },
    { id: 'ANALGESIC', label: 'Pain & Antipyretics' },
    { id: 'GI', label: 'Gastrointestinal' },
    { id: 'RESPIRATORY', label: 'Respiratory & Allergy' },
  ];

  const formularyDrugs = [
    {
      id: 'PMBJP-DM-01',
      name: 'Tab. Metformin 500mg',
      generic_salt: 'Metformin Hydrochloride IP (500mg)',
      brand_ref: 'Glycomet / Gluformin 500',
      category: 'DIABETES',
      dosage_adult: '500mg BD after breakfast and dinner (Max 2000mg/day)',
      dosage_pediatric: 'Not recommended for age < 10 yrs without specialist review',
      indications: 'Type-2 Diabetes Mellitus, Pre-diabetes, PCOS insulin resistance',
      contraindications: 'eGFR < 30 mL/min, severe hepatic failure, metabolic acidosis',
      pmbjp_price: '₹24 / 100 tabs',
      branded_price: '₹180 / 100 tabs',
      savings: '86%',
      pmbjp_code: 'PMBJP-0482',
      hospital_stock: hospitalStocks.find(s => s.drug_name?.toLowerCase().includes('metformin'))?.quantity_available || 1196,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-DM-02',
      name: 'Tab. Glimepiride 1mg / 2mg',
      generic_salt: 'Glimepiride IP (1mg / 2mg)',
      brand_ref: 'Amaryl / Glimestar 1mg/2mg',
      category: 'DIABETES',
      dosage_adult: '1mg to 2mg OD with morning breakfast',
      dosage_pediatric: 'Contraindicated in pediatric population',
      indications: 'Type-2 Diabetes uncontrolled on Metformin monotherapy',
      contraindications: 'Hypoglycemia risk, severe renal disease, hypersensitivity to sulfonylureas',
      pmbjp_price: '₹14 / 10 tabs',
      branded_price: '₹95 / 10 tabs',
      savings: '85%',
      pmbjp_code: 'PMBJP-0488',
      hospital_stock: 450,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-CV-01',
      name: 'Tab. Telmisartan 40mg',
      generic_salt: 'Telmisartan IP (40mg)',
      brand_ref: 'Telma / Telmikind 40',
      category: 'CARDIAC',
      dosage_adult: '40mg OD in morning (Can titrate to 80mg OD for uncontrolled HTN)',
      dosage_pediatric: 'Safety not established in pediatric population',
      indications: 'Essential Hypertension, Cardiovascular risk reduction in CAD/stroke',
      contraindications: 'Pregnancy (Category D), bilateral renal artery stenosis, severe hyperkalemia',
      pmbjp_price: '₹32 / 30 tabs',
      branded_price: '₹220 / 30 tabs',
      savings: '85%',
      pmbjp_code: 'PMBJP-0219',
      hospital_stock: hospitalStocks.find(s => s.drug_name?.toLowerCase().includes('telmisartan'))?.quantity_available || 840,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-CV-02',
      name: 'Tab. Amlodipine 5mg',
      generic_salt: 'Amlodipine Besylate IP (5mg)',
      brand_ref: 'Norvasc / Stamlo 5',
      category: 'CARDIAC',
      dosage_adult: '5mg OD once daily (Max 10mg OD)',
      dosage_pediatric: '2.5mg OD for age > 6 years with pediatric nephrology guidance',
      indications: 'Hypertension, Chronic stable angina, Vasospastic angina',
      contraindications: 'Severe aortic stenosis, cardiogenic shock, unstable angina',
      pmbjp_price: '₹9 / 10 tabs',
      branded_price: '₹68 / 10 tabs',
      savings: '87%',
      pmbjp_code: 'PMBJP-0205',
      hospital_stock: 620,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-CV-03',
      name: 'Tab. Atorvastatin 10mg / 20mg',
      generic_salt: 'Atorvastatin Calcium IP (10mg / 20mg)',
      brand_ref: 'Lipitor / Atorva 10/20',
      category: 'CARDIAC',
      dosage_adult: '10mg to 20mg OD at bedtime',
      dosage_pediatric: 'Specialist initiation only for familial hypercholesterolemia',
      indications: 'Dyslipidemia, primary prevention of ASCVD, post-MI secondary prevention',
      contraindications: 'Active hepatic disease, unexplained persistent transaminase elevations, pregnancy',
      pmbjp_price: '₹18 / 10 tabs',
      branded_price: '₹140 / 10 tabs',
      savings: '87%',
      pmbjp_code: 'PMBJP-0231',
      hospital_stock: 310,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-AB-01',
      name: 'Cap. Amoxicillin + Pot. Clavulanate 625mg',
      generic_salt: 'Amoxicillin Trihydrate (500mg) + Potassium Clavulanate (125mg)',
      brand_ref: 'Augmentin / Clavam 625',
      category: 'ANTIBIOTIC',
      dosage_adult: '1 Tablet BD (every 12 hours) with meals for 5-7 days',
      dosage_pediatric: 'Dry Syrup formulation (30mg/kg/day divided BD)',
      indications: 'Lower respiratory tract infections, Sinusitis, Otitis media, Skin & soft tissue infections',
      contraindications: 'Severe Penicillin hypersensitivity, previous Amox-Clav jaundice/hepatic dysfunction',
      pmbjp_price: '₹55 / 10 tabs',
      branded_price: '₹210 / 10 tabs',
      savings: '74%',
      pmbjp_code: 'PMBJP-0104',
      hospital_stock: 240,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-AB-02',
      name: 'Tab. Azithromycin 500mg',
      generic_salt: 'Azithromycin Dihydrate IP (500mg)',
      brand_ref: 'Azee / Azithral 500',
      category: 'ANTIBIOTIC',
      dosage_adult: '500mg OD 1 hour before or 2 hours after meals for 3 to 5 days',
      dosage_pediatric: '10mg/kg OD for 3 days',
      indications: 'Atypical pneumonia, Streptococcal pharyngitis, Chlamydia, Typhoid stepdown',
      contraindications: 'Known QT prolongation history, concurrent macrolide allergy, severe hepatic failure',
      pmbjp_price: '₹38 / 3 tabs',
      branded_price: '₹135 / 3 tabs',
      savings: '72%',
      pmbjp_code: 'PMBJP-0112',
      hospital_stock: 180,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-AN-01',
      name: 'Tab. Paracetamol 650mg / 500mg',
      generic_salt: 'Paracetamol IP (650mg / 500mg)',
      brand_ref: 'Dolo 650 / Calpol 500',
      category: 'ANALGESIC',
      dosage_adult: '650mg SOS every 6-8 hours (Max 3250mg/day in adults)',
      dosage_pediatric: '15mg/kg/dose every 6 hours SOS',
      indications: 'Pyrexia of unknown origin, Viral fever, Post-vaccination pain, Mild-moderate arthralgia',
      contraindications: 'Severe acute hepatic failure, chronic severe alcohol dependency',
      pmbjp_price: '₹7 / 10 tabs',
      branded_price: '₹35 / 10 tabs',
      savings: '80%',
      pmbjp_code: 'PMBJP-0001',
      hospital_stock: hospitalStocks.find(s => s.drug_name?.toLowerCase().includes('paracetamol'))?.quantity_available || 1196,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-GI-01',
      name: 'Cap. Pantoprazole 40mg + Domperidone 30mg SR',
      generic_salt: 'Pantoprazole Sodium (40mg) + Domperidone (30mg SR)',
      brand_ref: 'Pan-D / Pantocid-D SR',
      category: 'GI',
      dosage_adult: '1 Capsule OD in morning empty stomach (30 mins before breakfast)',
      dosage_pediatric: 'Not advised for pediatric age without specialist evaluation',
      indications: 'GERD, Dyspepsia, NSAID-induced gastritis prevention, Functional heartburn',
      contraindications: 'GI hemorrhage, mechanical intestinal obstruction, hyperprolactinemia',
      pmbjp_price: '₹28 / 10 caps',
      branded_price: '₹165 / 10 caps',
      savings: '83%',
      pmbjp_code: 'PMBJP-0344',
      hospital_stock: 520,
      stock_status: 'IN_STOCK'
    },
    {
      id: 'PMBJP-RS-01',
      name: 'Tab. Montelukast 10mg + Levocetirizine 5mg',
      generic_salt: 'Montelukast Sodium (10mg) + Levocetirizine Dihydrochloride (5mg)',
      brand_ref: 'Montair-LC / Telekast-L',
      category: 'RESPIRATORY',
      dosage_adult: '1 Tablet OD at night before sleeping',
      dosage_pediatric: 'Syrup formulation (Montelukast 4mg + Levocetirizine 2.5mg)',
      indications: 'Allergic rhinitis, seasonal bronchial asthma maintenance, chronic urticaria',
      contraindications: 'Severe end-stage renal disease (CrCl < 10 mL/min), acute severe asthma bronchospasm',
      pmbjp_price: '₹34 / 10 tabs',
      branded_price: '₹210 / 10 tabs',
      savings: '84%',
      pmbjp_code: 'PMBJP-0612',
      hospital_stock: 390,
      stock_status: 'IN_STOCK'
    }
  ];

  const filteredFormulary = formularyDrugs.filter((drug) => {
    const matchesCategory = selectedCategory === 'ALL' || drug.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.generic_salt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brand_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.pmbjp_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.indications.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCopyRx = (drug: any) => {
    const rxText = `${drug.name} (${drug.generic_salt})\nSig: ${drug.dosage_adult}\nPMBJP Code: ${drug.pmbjp_code}`;
    navigator.clipboard.writeText(rxText);
    setCopiedId(drug.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
              Doctor's Jan Aushadhi Clinical Drug Reference
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
              Official generic drug formulary, dosage protocols, branded cost comparisons, and instant prescription copying to reduce out-of-pocket healthcare expenses for your patients by 50% to 90%.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">Avg Patient Savings</span>
              <span className="text-xl font-black text-emerald-400">80% – 87%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 text-center">
              <span className="block text-[10px] text-slate-300 font-bold uppercase tracking-wider">Hospital In-Stock</span>
              <span className="text-xl font-black text-blue-300">Available</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center space-x-2 mt-5 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Generic Drug Directory & Dosages</span>
          </button>
          <button
            onClick={() => setActiveTab('substitutor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'substitutor'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Brand-to-Generic Cost Calculator</span>
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* Search and Category Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Generic Salt (e.g., Metformin, Telmisartan), Brand equivalent (e.g., Glycomet, Augmentin), or Indication..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>

              <div className="text-xs text-slate-500 font-semibold shrink-0">
                Showing <strong className="text-slate-900">{filteredFormulary.length}</strong> standard generic salts
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Drug Reference List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFormulary.map((drug) => (
              <div
                key={drug.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-xs p-5 flex flex-col justify-between space-y-4 relative"
              >
                <div>
                  {/* Top Bar: Name + PMBJP Tag */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{drug.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          {drug.pmbjp_code}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5">
                        Generic Salt: <strong className="text-slate-800">{drug.generic_salt}</strong>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Popular Branded Reference: <em>{drug.brand_ref}</em>
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyRx(drug)}
                      className={`inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${
                        copiedId === drug.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700'
                      }`}
                      title="Copy drug & dosage to clipboard to paste into OPD Prescription"
                    >
                      {copiedId === drug.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy to Rx</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Pricing Comparison Box */}
                  <div className="mt-3.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        Jan Aushadhi (PMBJP) Price
                      </span>
                      <span className="text-base font-black text-emerald-700">{drug.pmbjp_price}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[10px] font-semibold text-slate-400">Market Branded MRP</span>
                      <span className="text-xs line-through font-bold text-slate-400">{drug.branded_price}</span>
                    </div>
                    <div className="bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-xs">
                      Save {drug.savings}
                    </div>
                  </div>

                  {/* Clinical Details */}
                  <div className="mt-3.5 space-y-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="block text-[10px] font-bold text-slate-500 uppercase">Standard Adult Dosage</span>
                      <p className="font-semibold text-slate-800">{drug.dosage_adult}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="block text-[9px] font-bold text-slate-400 uppercase">Key Clinical Indications</span>
                        <p className="text-slate-700 line-clamp-2">{drug.indications}</p>
                      </div>
                      <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-200 text-amber-900">
                        <span className="block text-[9px] font-bold text-amber-800 uppercase">Safety & Cautions</span>
                        <p className="text-amber-800 line-clamp-2">{drug.contraindications}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Hospital Stock Availability */}
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-slate-600">Hospital Pharmacy Stock:</span>
                    <strong className="text-slate-900">{drug.hospital_stock} units</strong>
                  </div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    ● DISPENSARY READY
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Brand to Generic Savings Calculator */}
      {activeTab === 'substitutor' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Generic Prescription Financial Impact Calculator
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Demonstrate the monthly chronic disease therapy cost savings to the patient when substituting commercial brands with PMBJP Jan Aushadhi generic salts.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-3">Therapeutic Category</th>
                  <th className="p-3">Commercial Brand Name</th>
                  <th className="p-3">Jan Aushadhi Generic Substitute</th>
                  <th className="p-3">Branded Cost / Mo</th>
                  <th className="p-3">Jan Aushadhi Cost / Mo</th>
                  <th className="p-3">Patient Monthly Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold text-slate-900">Type-2 Diabetes</td>
                  <td className="p-3 text-slate-600">Glycomet 500 (Metformin 500mg)</td>
                  <td className="p-3 font-semibold text-blue-700">Tab. Metformin 500mg (PMBJP)</td>
                  <td className="p-3 font-bold text-slate-700">₹108 / mo</td>
                  <td className="p-3 font-bold text-emerald-600">₹14.40 / mo</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Save ₹93.60 (87%)</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Hypertension</td>
                  <td className="p-3 text-slate-600">Telma 40 (Telmisartan 40mg)</td>
                  <td className="p-3 font-semibold text-blue-700">Tab. Telmisartan 40mg (PMBJP)</td>
                  <td className="p-3 font-bold text-slate-700">₹220 / mo</td>
                  <td className="p-3 font-bold text-emerald-600">₹32 / mo</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Save ₹188.00 (85%)</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Cholesterol / Lipid</td>
                  <td className="p-3 text-slate-600">Atorva 10 (Atorvastatin 10mg)</td>
                  <td className="p-3 font-semibold text-blue-700">Tab. Atorvastatin 10mg (PMBJP)</td>
                  <td className="p-3 font-bold text-slate-700">₹420 / mo</td>
                  <td className="p-3 font-bold text-emerald-600">₹54 / mo</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Save ₹366.00 (87%)</span></td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900">Acid Reflux / GERD</td>
                  <td className="p-3 text-slate-600">Pan-D (Pantoprazole + Domperidone)</td>
                  <td className="p-3 font-semibold text-blue-700">Cap. Pantoprazole 40 + Domperidone 30</td>
                  <td className="p-3 font-bold text-slate-700">₹495 / mo</td>
                  <td className="p-3 font-bold text-emerald-600">₹84 / mo</td>
                  <td className="p-3"><span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">Save ₹411.00 (83%)</span></td>
                </tr>
                <tr className="bg-blue-50/50 font-black text-slate-900 text-sm">
                  <td colSpan={3} className="p-3 text-blue-900">Total Combined Chronic Care Cost (Monthly)</td>
                  <td className="p-3 text-slate-700">₹1,243 / mo</td>
                  <td className="p-3 text-emerald-700 font-extrabold">₹184.40 / mo</td>
                  <td className="p-3"><span className="bg-emerald-600 text-white font-black px-2.5 py-1 rounded-lg">Total Savings: ₹1,058.60 / mo (85%)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   3. HOSPITAL ADMINISTRATOR / PHARMACIST / FACILITY WAREHOUSE VIEW
   ========================================================================= */
export const PharmacyPage: React.FC = () => {
  const { user } = useAuthStore();
  const isPatientRole = user?.role === 'PATIENT';
  const isDoctorRole = user?.role === 'DOCTOR';

  // 1. Patient / Citizen View
  if (isPatientRole) {
    return <CitizenPharmacyView />;
  }

  // 2. Doctor Role: Pharmacy is integrated directly into Doctor Dashboard prescription pad
  if (isDoctorRole) {
    return <Navigate to="/doctor" replace />;
  }

  // 3. Hospital Admin / Pharmacist Central Warehouse & Dispensing Desk
  const { t } = useTranslation();

  const [stocks, setStocks] = useState<any[]>([]);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'LOW_STOCK' | 'EXPIRING' | 'JAN_AUSHADHI'>('ALL');

  // Modals
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);
  const [selectedStockForDispense, setSelectedStockForDispense] = useState<any | null>(null);

  // Receive Form State
  const [receiveDrugId, setReceiveDrugId] = useState('');
  const [receiveBatchNo, setReceiveBatchNo] = useState('');
  const [receiveExpiry, setReceiveExpiry] = useState('');
  const [receiveQty, setReceiveQty] = useState(100);
  const [receiveNotes, setReceiveNotes] = useState('');
  const [isReceiving, setIsReceiving] = useState(false);

  // Dispense Form State
  const [dispensePatientId, setDispensePatientId] = useState('');
  const [dispenseStockId, setDispenseStockId] = useState('');
  const [dispenseQty, setDispenseQty] = useState(1);
  const [dispenseNotes, setDispenseNotes] = useState('');
  const [isDispensing, setIsDispensing] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stocksRes, drugsRes, patientsRes] = await Promise.all([
        api.get('/inventory/stocks'),
        api.get('/inventory/drugs'),
        api.get('/patients?size=50'),
      ]);
      setStocks(stocksRes || []);
      setDrugs(drugsRes || []);
      setPatients(patientsRes?.items || []);
      if (drugsRes && drugsRes.length > 0 && !receiveDrugId) {
        setReceiveDrugId(drugsRes[0].id);
      }
    } catch (err) {
      console.error('Failed to load pharmacy data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredStocks = stocks.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.drug_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.generic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch_number?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterMode === 'LOW_STOCK') return item.is_low_stock;
    if (filterMode === 'EXPIRING') return item.is_expiring_soon;
    if (filterMode === 'JAN_AUSHADHI') return item.is_essential_jan_aushadhi;

    return true;
  });

  const lowStockCount = stocks.filter((s) => s.is_low_stock).length;
  const expiringCount = stocks.filter((s) => s.is_expiring_soon).length;

  const handleReceiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);
    setIsReceiving(true);
    try {
      await api.post('/inventory/receive', {
        drug_id: receiveDrugId,
        batch_number: receiveBatchNo,
        expiry_date: receiveExpiry,
        quantity: Number(receiveQty),
        notes: receiveNotes,
      });
      setIsReceiveOpen(false);
      setActionSuccessMsg('Stock delivery successfully recorded in central inventory.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
      setReceiveBatchNo('');
      setReceiveExpiry('');
      fetchData();
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Failed to receive stock');
    } finally {
      setIsReceiving(false);
    }
  };

  const handleDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);
    setIsDispensing(true);
    try {
      const targetStockId = dispenseStockId || selectedStockForDispense?.id || (stocks[0]?.id);
      await api.post('/inventory/dispense', {
        patient_id: dispensePatientId || undefined,
        items: [{ stock_id: targetStockId, quantity: Number(dispenseQty) }],
        notes: dispenseNotes,
      });
      setIsDispenseOpen(false);
      setSelectedStockForDispense(null);
      setActionSuccessMsg('Prescription medication dispensed and batch inventory decremented.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
      setDispenseNotes('');
      setDispenseQty(1);
      fetchData();
    } catch (err: any) {
      setActionErrorMsg(err.message || 'Dispensing failed');
    } finally {
      setIsDispensing(false);
    }
  };

  const openDispenseForStock = (stock: any) => {
    setSelectedStockForDispense(stock);
    setDispenseStockId(stock.id);
    setIsDispenseOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Hospital Facility Panel
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1">
            {t('pharmacy.title', 'Central Pharmacy & Drug Formulary')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('pharmacy.subtitle', 'Pradhan Mantri Jan Aushadhi generic formulary, batch inventory & 1-tap dispensing')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            leftIcon={<ArrowDownToLine size={16} />}
            onClick={() => setIsReceiveOpen(true)}
          >
            {t('pharmacy.receive_stock_btn', '+ Receive Stock Delivery (PO)')}
          </Button>
          <Button
            variant="primary"
            leftIcon={<Pill size={16} />}
            onClick={() => {
              setSelectedStockForDispense(null);
              setIsDispenseOpen(true);
            }}
          >
            {t('pharmacy.dispense_desk_btn', '1-Tap Dispensing Desk')}
          </Button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Error Notification Banner */}
      {actionErrorMsg && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{actionErrorMsg}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {t('pharmacy.formulary_items', 'Total Formulary Items')}
            </div>
            <div className="text-xl font-black text-slate-900">{drugs.length || 5}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {t('pharmacy.batches_in_stock', 'Batches in Stock')}
            </div>
            <div className="text-xl font-black text-slate-900">{stocks.length || 3}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {t('pharmacy.low_stock_alerts', 'Low Stock Alerts')} (≤50)
            </div>
            <div className="text-xl font-black text-rose-600">{lowStockCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">
              {t('pharmacy.expiring_soon', 'Expiring Soon')} (≤90 Days)
            </div>
            <div className="text-xl font-black text-amber-600">{expiringCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('pharmacy.search_placeholder', 'Search by medicine name, generic salt, batch number...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('pharmacy.filter_all', 'All Stock')}
          </button>
          <button
            onClick={() => setFilterMode('LOW_STOCK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'LOW_STOCK' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('pharmacy.filter_low_stock', 'Low Stock')} ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterMode('EXPIRING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'EXPIRING' ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('pharmacy.filter_expiring', 'Expiring (<90d)')} ({expiringCount})
          </button>
          <button
            onClick={() => setFilterMode('JAN_AUSHADHI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'JAN_AUSHADHI' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('pharmacy.filter_jan_aushadhi', 'Jan Aushadhi Generic')}
          </button>
        </div>
      </div>

      {/* Stock Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3.5">{t('pharmacy.th_medicine', 'Medicine & Generic Salt')}</th>
                <th className="p-3.5">{t('pharmacy.th_batch', 'Batch No.')}</th>
                <th className="p-3.5">{t('pharmacy.th_expiry', 'Expiry Date')}</th>
                <th className="p-3.5">{t('pharmacy.th_available_qty', 'Available Qty')}</th>
                <th className="p-3.5">{t('pharmacy.th_status', 'Status')}</th>
                <th className="p-3.5 text-right">{t('pharmacy.th_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Loading central pharmacy warehouse stocks...
                  </td>
                </tr>
              ) : filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    {t('pharmacy.no_stocks_found', 'No medicine stocks found matching criteria.')}
                  </td>
                </tr>
              ) : (
                filteredStocks.map((stock) => (
                  <tr key={stock.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-xs">
                        {stock.drug_name} {stock.strength && `(${stock.strength})`}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Salt: {stock.generic_name} • {stock.dosage_form}
                      </div>
                      {stock.is_essential_jan_aushadhi && (
                        <div className="mt-1">
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                            Jan Aushadhi PMBJP
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 font-mono text-slate-700 font-semibold">
                      {stock.batch_number}
                    </td>

                    <td className="p-3.5 text-slate-600">
                      <div>{stock.expiry_date}</div>
                      {stock.is_expiring_soon && (
                        <span className="inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded">
                          Expiring Soon
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="font-extrabold text-slate-900">
                        {stock.quantity_available} {stock.unit || 'units'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Reorder at {stock.reorder_level}
                      </div>
                    </td>

                    <td className="p-3.5">
                      {stock.is_low_stock ? (
                        <span className="inline-block px-2 py-0.5 bg-rose-100 text-rose-800 font-extrabold text-[10px] rounded-md">
                          LOW STOCK
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md">
                          IN STOCK
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 text-right">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openDispenseForStock(stock)}
                        disabled={stock.quantity_available <= 0}
                      >
                        Dispense
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receive Stock Delivery Modal */}
      {isReceiveOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('pharmacy.receive_delivery_title', 'Receive Central Depot Stock Shipment (PO)')}
              </h3>
              <button
                onClick={() => setIsReceiveOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReceiveSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Drug Formulary Item *
                </label>
                <select
                  value={receiveDrugId}
                  onChange={(e) => setReceiveDrugId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {drugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.generic_name}) - {d.strength}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batch Number *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. B-PCM-2026C"
                    value={receiveBatchNo}
                    onChange={(e) => setReceiveBatchNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Batch Expiry Date *
                  </label>
                  <Input
                    type="date"
                    required
                    value={receiveExpiry}
                    onChange={(e) => setReceiveExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Received Quantity (Units) *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={receiveQty}
                  onChange={(e) => setReceiveQty(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Purchase Order / Invoice Notes
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Delivery Challan #PO-2026-904"
                  value={receiveNotes}
                  onChange={(e) => setReceiveNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsReceiveOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isReceiving}>
                  Add Stock to Inventory
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Desk Modal */}
      {isDispenseOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {t('pharmacy.dispense_desk_btn', '1-Tap Medication Dispensing Desk')}
              </h3>
              <button
                onClick={() => setIsDispenseOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispenseSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Batch Stock to Dispense *
                </label>
                <select
                  value={dispenseStockId || (selectedStockForDispense?.id || '')}
                  onChange={(e) => setDispenseStockId(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {stocks.map((s) => (
                    <option key={s.id} value={s.id} disabled={s.quantity_available <= 0}>
                      {s.drug_name} — Batch {s.batch_number} (Avail: {s.quantity_available})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Recipient Citizen / Patient (Optional)
                </label>
                <select
                  value={dispensePatientId}
                  onChange={(e) => setDispensePatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Walk-in OPD / General Dispense</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} (MRN: {p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dispense Quantity (Units) *
                </label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={dispenseQty}
                  onChange={(e) => setDispenseQty(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dispensing Instructions / Pharmacist Note
                </label>
                <Input
                  type="text"
                  placeholder="e.g. 1 tab twice daily after food"
                  value={dispenseNotes}
                  onChange={(e) => setDispenseNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsDispenseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isDispensing}>
                  Confirm & Dispense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyPage;
