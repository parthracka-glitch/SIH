import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/auth';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Calendar,
  Clock,
  QrCode,
  User,
  Building,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Stethoscope,
  Printer,
  Search,
  Filter,
  Users,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  Check,
  Pill,
  FileText,
  X,
  ArrowDownToLine,
  Store,
  Download
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

interface OpdToken {
  id: string;
  token_number: string;
  patient_id: string;
  patient_name: string;
  patient_mrn: string;
  patient_abha: string;
  facility_name: string;
  department: string;
  room_number: string;
  doctor_name: string;
  position_in_queue: number;
  estimated_wait_mins: number;
  priority: 'ROUTINE' | 'SENIOR_CITIZEN' | 'MATERNAL_HIGH_RISK' | 'EMERGENCY_TRIAGE';
  status: 'WAITING' | 'SERVING' | 'COMPLETED' | 'CANCELLED';
  slot_time: string;
  created_at: string;
}

interface PastConsultationDetail {
  id: string;
  token_number: string;
  date: string;
  department: string;
  doctor: string;
  doctor_reg: string;
  facility: string;
  status: string;
  diagnosis: string;
  vitals: {
    bp: string;
    pulse: string;
    spo2: string;
    sugar: string;
  };
  medications: Array<{
    name: string;
    dosage: string;
    freq: string;
    duration: string;
    pmbjp: string;
    cost: string;
  }>;
  advice: string[];
  next_followup: string;
}

/* =========================================================================
   1. CITIZEN / PATIENT DEDICATED APPOINTMENT & OPD PASS PORTAL
   ========================================================================= */
const CitizenAppointmentsView: React.FC = () => {
  const { user } = useAuthStore();
  const citizenName = user?.full_name || 'Ramesh Yadav';
  const citizenAbha = user?.username ? `${user.username}@abdm` : 'patient.ramesh@abdm';

  const [activeToken, setActiveToken] = useState<OpdToken>({
    id: 'tok-citizen-01',
    token_number: 'TK-MED-108',
    patient_id: user?.id || 'p-citizen',
    patient_name: citizenName,
    patient_mrn: 'MH-2026-0812',
    patient_abha: '91-4829-1029-3847',
    facility_name: 'District Hospital, Nashik (Central OPD)',
    department: 'General Medicine',
    room_number: 'Room 104',
    doctor_name: 'Dr. Priya Sharma (MD)',
    position_in_queue: 2,
    estimated_wait_mins: 8,
    priority: 'ROUTINE',
    status: 'WAITING',
    slot_time: 'Today, 10:30 AM',
    created_at: new Date().toISOString(),
  });

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('District Hospital, Nashik (Central OPD)');
  const [department, setDepartment] = useState('General Medicine');
  const [slotTime, setSlotTime] = useState('Today, Fast-Track Walk-in');
  const [reason, setReason] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<PastConsultationDetail | null>(null);

  const pastAppointments: PastConsultationDetail[] = [
    {
      id: 'past-01',
      token_number: 'OPD-MED-2026-8491',
      date: '12 Sep 2026, 10:45 AM',
      department: 'General Medicine',
      doctor: 'Dr. Priya Sharma (MBBS, MD)',
      doctor_reg: 'MMC-2018/04/1829',
      facility: 'District Hospital, Nashik',
      status: 'Completed',
      diagnosis: 'Type-2 Diabetes Mellitus (E11.9) & Essential Hypertension (I10) — Stable control',
      vitals: {
        bp: '120/80 mmHg',
        pulse: '74 bpm',
        spo2: '98% Air',
        sugar: '115 mg/dL (Fasting)'
      },
      medications: [
        {
          name: 'Tab. Metformin Hydrochloride 500mg',
          dosage: '1 Tablet',
          freq: 'Twice Daily (BD) — After Breakfast & Dinner',
          duration: '30 Days (60 Tabs)',
          pmbjp: 'PMBJP-DM-04',
          cost: '₹24'
        },
        {
          name: 'Tab. Telmisartan 40mg',
          dosage: '1 Tablet',
          freq: 'Once Daily (OD) — Morning after food',
          duration: '30 Days (30 Tabs)',
          pmbjp: 'PMBJP-CV-12',
          cost: '₹32'
        },
        {
          name: 'Tab. Paracetamol 650mg',
          dosage: '1 Tablet',
          freq: 'SOS (When fever/bodyache > 99°F)',
          duration: '5 Days (10 Tabs)',
          pmbjp: 'PMBJP-AL-01',
          cost: '₹7'
        }
      ],
      advice: [
        'Maintain daily morning brisk walk for 30–40 minutes.',
        'Strictly limit salt intake to under 1 teaspoon per day (avoid pickles/namkeen).',
        'Take generic medicines on time without skipping.',
        'Drink plenty of warm boiled water.'
      ],
      next_followup: '12 Oct 2026 at Sinnar PHC / Sub-District Hospital'
    },
    {
      id: 'past-02',
      token_number: 'OPD-COMM-2026-4019',
      date: '28 Aug 2026, 11:30 AM',
      department: 'Community Medicine',
      doctor: 'Dr. Ramesh Patil (MBBS)',
      doctor_reg: 'MMC-2015/02/0941',
      facility: 'Sinnar Primary Health Centre',
      status: 'Completed',
      diagnosis: 'Acute Upper Respiratory Tract Infection (Viral Rhinitis) & General Health Checkup',
      vitals: {
        bp: '122/82 mmHg',
        pulse: '76 bpm',
        spo2: '99% Air',
        sugar: '110 mg/dL'
      },
      medications: [
        {
          name: 'Tab. Cetirizine 10mg',
          dosage: '1 Tablet',
          freq: 'Once Daily at Night (HS)',
          duration: '5 Days',
          pmbjp: 'PMBJP-AL-03',
          cost: '₹5'
        },
        {
          name: 'Tab. Paracetamol 500mg',
          dosage: '1 Tablet',
          freq: 'Three times daily (TDS)',
          duration: '3 Days',
          pmbjp: 'PMBJP-AL-01',
          cost: '₹6'
        },
        {
          name: 'Steam Inhalation with Ajwain',
          dosage: '10 Mins',
          freq: 'Twice daily',
          duration: '3 Days',
          pmbjp: 'Home AYUSH',
          cost: '₹0'
        }
      ],
      advice: [
        'Warm salt water gargle 3 times a day.',
        'Avoid cold refrigerated water, ice creams, and curd at night.',
        'Take steam inhalation twice daily for chest comfort.'
      ],
      next_followup: 'As needed (SOS) if symptoms persist over 7 days'
    }
  ];

  const handlePrintSpecificPrescription = (c: PastConsultationDetail) => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prescription — ${citizenName} (${c.token_number})</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
    body { background: #fff; padding: 24px; color: #1e293b; }
    .page { max-width: 800px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 16px; }
    .title { font-size: 18px; font-weight: 800; color: #0f172a; }
    .sub { font-size: 11px; color: #64748b; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; font-size: 11px; margin-bottom: 16px; }
    .vitals { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px; font-size: 11px; margin-bottom: 16px; display: flex; justify-content: space-between; font-weight: 700; color: #166534; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 16px; }
    th { background: #f1f5f9; padding: 8px; text-align: left; font-weight: 800; }
    td { padding: 8px; border-bottom: 1px solid #f1f5f9; }
    .advice { background: #fffbeb; border: 1px solid #fef3c7; padding: 10px; border-radius: 8px; font-size: 11px; margin-bottom: 16px; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e2e8f0; padding-top: 12px; }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <h1 class="title">${c.facility}</h1>
        <p class="sub">Ayushman Bharat Digital Mission • Certified Health Facility</p>
      </div>
      <div style="text-align:right;">
        <span style="font-size:10px;font-weight:800;background:#eff6ff;color:#1d4ed8;padding:2px 6px;border-radius:4px;">ABDM M3 SYNCED</span>
        <p class="sub" style="margin-top:4px;">Token: <strong>${c.token_number}</strong></p>
        <p class="sub">Date: <strong>${c.date}</strong></p>
      </div>
    </div>

    <div class="box">
      <div><span style="color:#94a3b8;font-size:9px;text-transform:uppercase;font-weight:700;">Patient</span><br><strong>${citizenName}</strong></div>
      <div><span style="color:#94a3b8;font-size:9px;text-transform:uppercase;font-weight:700;">ABHA ID</span><br><strong>91-4829-1029-3847</strong></div>
      <div><span style="color:#94a3b8;font-size:9px;text-transform:uppercase;font-weight:700;">Department</span><br><strong>${c.department}</strong></div>
      <div><span style="color:#94a3b8;font-size:9px;text-transform:uppercase;font-weight:700;">Doctor</span><br><strong>${c.doctor}</strong></div>
    </div>

    <div class="vitals">
      <span>BP: ${c.vitals.bp}</span>
      <span>Pulse: ${c.vitals.pulse}</span>
      <span>SpO2: ${c.vitals.spo2}</span>
      <span>Sugar: ${c.vitals.sugar}</span>
    </div>

    <div style="font-size:12px;font-weight:800;color:#0f172a;margin-bottom:8px;">
      Clinical Diagnosis: ${c.diagnosis}
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
        ${c.medications.map((m, idx) => `
          <tr>
            <td><strong>${idx + 1}</strong></td>
            <td><strong>${m.name}</strong><br><span style="font-size:9px;color:#64748b;">PMBJP: ${m.pmbjp}</span></td>
            <td>${m.dosage} — ${m.freq}</td>
            <td>${m.duration}</td>
            <td><strong>${m.cost}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="advice">
      <strong>Doctor's Advice:</strong>
      <ul style="padding-left:16px;margin-top:4px;">
        ${c.advice.map((a) => `<li>${a}</li>`).join('')}
      </ul>
      <p style="margin-top:6px;font-weight:700;">Next Follow-up: ${c.next_followup}</p>
    </div>

    <div class="footer">
      <div style="font-size:9px;color:#94a3b8;">Digitally authenticated under ABDM National Health Grid.</div>
      <div style="text-align:right;">
        <div style="font-size:12px;font-weight:800;">${c.doctor}</div>
        <div style="font-size:10px;color:#64748b;">Reg: ${c.doctor_reg}</div>
      </div>
    </div>
  </div>
</body>
</html>`;

    const printWindow = window.open('', '_blank', 'width=900,height=750');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 400);
    }
  };

  const handleBookNew = (e: React.FormEvent) => {
    e.preventDefault();
    const tokenNum = `TK-${department.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newToken: OpdToken = {
      id: `tok-${Date.now()}`,
      token_number: tokenNum,
      patient_id: user?.id || 'p-citizen',
      patient_name: citizenName,
      patient_mrn: 'MH-2026-0812',
      patient_abha: '91-4829-1029-3847',
      facility_name: selectedFacility,
      department,
      room_number: department === 'General Medicine' ? 'Room 104' : 'Room 108',
      doctor_name: 'Dr. Specialist on Duty',
      position_in_queue: 1,
      estimated_wait_mins: 5,
      priority: 'ROUTINE',
      status: 'WAITING',
      slot_time: slotTime,
      created_at: new Date().toISOString(),
    };
    setActiveToken(newToken);
    setIsBookModalOpen(false);
    setBookingSuccess(true);
    setTimeout(() => setBookingSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              My Appointments & OPD Passes
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
              ABDM Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time OPD queue status, digital doctor boarding passes & instant slot booking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Book OPD Appointment</span>
          </button>
        </div>
      </div>

      {bookingSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>New appointment confirmed! Your digital OPD Pass has been generated.</span>
        </div>
      )}

      {/* Live Digital Boarding Pass */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Active OPD Ticket
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white mt-2">
              {activeToken.token_number}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5 font-medium">
              {activeToken.facility_name} • {activeToken.department}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Estimated Wait</span>
            <span className="text-xl font-bold text-emerald-400">~{activeToken.estimated_wait_mins} Mins</span>
            <span className="block text-[11px] text-blue-300 font-semibold mt-0.5">
              Position in line: #{activeToken.position_in_queue}
            </span>
          </div>
        </div>

        {/* Pass Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-4">
          <div className="sm:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Assigned Room</span>
              <strong className="text-white text-sm">{activeToken.room_number}</strong>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block">Doctor on Duty</span>
              <strong className="text-white text-sm truncate block">{activeToken.doctor_name}</strong>
            </div>
            <div className="bg-white/5 border border-white/10 p-2.5 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 block">Scheduled Slot</span>
              <strong className="text-blue-300 text-sm">{activeToken.slot_time}</strong>
            </div>
          </div>

          <div className="sm:col-span-4 flex justify-center sm:justify-end">
            <div className="p-2 bg-white rounded-xl shadow-md border border-white/20 flex flex-col items-center">
              <QRCodeSVG
                value={`https://abdm.gov.in/token?id=${activeToken.token_number}&patient=${encodeURIComponent(citizenName)}`}
                size={74}
                level="H"
              />
              <span className="text-[8px] font-bold text-slate-800 uppercase tracking-widest mt-1">
                Scan at OPD Desk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Past Completed Appointments */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">Past Appointment Consultations</h3>
          </div>
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
            {pastAppointments.length} Completed • Tap to View Details
          </span>
        </div>

        <div className="space-y-3">
          {pastAppointments.map((appt) => (
            <div
              key={appt.id}
              onClick={() => setSelectedConsultation(appt)}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-300 space-y-2 transition cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {appt.department} • {appt.doctor}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-blue-600 transition">
                  <span className="text-[11px] font-medium">{appt.date}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-600">{appt.facility}</p>

              <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <strong className="text-slate-800">Diagnosis:</strong> {appt.diagnosis}
                </div>
                <span className="text-[10px] font-bold text-blue-600 underline">
                  View Full Record &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Past Consultation Full Detail Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Official Consultation Record
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ABDM EHR Verified
                  </span>
                </div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                  {selectedConsultation.department} Consultation
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedConsultation.facility} • Token: <strong>{selectedConsultation.token_number}</strong>
                </p>
              </div>

              <button
                onClick={() => setSelectedConsultation(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                aria-label="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Attending Doctor</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedConsultation.doctor}</p>
                <p className="text-[11px] text-slate-500">Reg: {selectedConsultation.doctor_reg}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Date & Time of Consultation</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedConsultation.date}</p>
                <p className="text-[11px] text-emerald-600 font-semibold">Status: Successfully Completed</p>
              </div>
            </div>

            {/* Recorded Vitals */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-extrabold text-emerald-900 uppercase tracking-wider block">
                Recorded Vitals (During Consultation)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                  <strong className="text-slate-900">{selectedConsultation.vitals.bp}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Pulse</span>
                  <strong className="text-slate-900">{selectedConsultation.vitals.pulse}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">SpO2</span>
                  <strong className="text-slate-900">{selectedConsultation.vitals.spo2}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Blood Sugar</span>
                  <strong className="text-slate-900">{selectedConsultation.vitals.sugar}</strong>
                </div>
              </div>
            </div>

            {/* Clinical Assessment */}
            <div className="bg-blue-50/60 border border-blue-200 p-3.5 rounded-2xl text-xs space-y-1">
              <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider block">
                Clinical Diagnosis
              </span>
              <p className="font-bold text-slate-900 text-xs leading-relaxed">
                {selectedConsultation.diagnosis}
              </p>
            </div>

            {/* Prescribed Medications */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <Pill className="w-3.5 h-3.5 text-blue-600" />
                  <span>Prescribed Medicines ({selectedConsultation.medications.length})</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Jan Aushadhi Generic Formulary
                </span>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {selectedConsultation.medications.map((m, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.dosage} • {m.freq}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">{m.cost}</div>
                      <div className="text-[10px] text-slate-400">{m.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctor's Advice */}
            <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl text-xs space-y-1.5">
              <span className="font-extrabold text-amber-900 uppercase tracking-wider block">
                Doctor's Lifestyle & Dietary Advice
              </span>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-950 text-[11px]">
                {selectedConsultation.advice.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
              <p className="text-[11px] font-bold text-amber-900 pt-1">
                Next Follow-up Checkup: {selectedConsultation.next_followup}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => handlePrintSpecificPrescription(selectedConsultation)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                <span>Download & Print Prescription</span>
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <Link
                  to="/pharmacy"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow flex items-center space-x-1 cursor-pointer"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Get Medicines at PMBJP Store</span>
                </Link>

                <button
                  onClick={() => setSelectedConsultation(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book OPD Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-slate-900">Book OPD Appointment</h3>
                <p className="text-xs text-slate-500">Citizen: <strong>{citizenName}</strong> ({citizenAbha})</p>
              </div>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookNew} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Health Facility *</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="District Hospital, Nashik (Central OPD)">District Hospital, Nashik (Central OPD)</option>
                  <option value="Sinnar Sub-District Hospital">Sinnar Sub-District Hospital</option>
                  <option value="Dindori Primary Health Centre">Dindori Primary Health Centre</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Department / Specialty *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="General Medicine">General Medicine (Room 104)</option>
                  <option value="Cardiology (NCD)">Cardiology & Diabetes NCD (Room 108)</option>
                  <option value="Orthopedics">Orthopedics & Joint Care (Room 105)</option>
                  <option value="Ophthalmology">Eye & Vision Care (Room 301)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot *</label>
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="Today, Fast-Track Walk-in">Today, Fast-Track Walk-in (Immediate)</option>
                  <option value="Tomorrow, Morning (9:00 AM - 12:00 PM)">Tomorrow, Morning (9:00 AM - 12:00 PM)</option>
                  <option value="Tomorrow, Afternoon (2:00 PM - 5:00 PM)">Tomorrow, Afternoon (2:00 PM - 5:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Symptoms / Reason for Visit</label>
                <Input
                  placeholder="e.g. Routine blood sugar checkup, mild back pain"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsBookModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Confirm & Generate Pass
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. CLINICIAN / DOCTOR / STAFF DAILY OPD APPOINTMENT ROSTER
   ========================================================================= */
interface DoctorAppointmentSlot {
  id: string;
  slot_time: string;
  token_number: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  abha_id: string;
  mrn: string;
  visit_type: 'ROUTINE_FOLLOWUP' | 'NEW_CONSULTATION' | 'TELECONSULT_REVIEW' | 'EMERGENCY_FASTTRACK';
  chief_complaint: string;
  status: 'NOW_SERVING' | 'IN_WAITING' | 'CONFIRMED' | 'COMPLETED' | 'NO_SHOW';
  room_number: string;
  vitals_preview?: string;
  asha_referrer?: string;
}

const INITIAL_DOCTOR_ROSTER: DoctorAppointmentSlot[] = [
  {
    id: 'apt-01',
    slot_time: '09:00 AM - 09:15 AM',
    token_number: 'TK-MED-101',
    patient_name: 'Eknath Tukaram Shinde',
    patient_age: 64,
    patient_gender: 'Male',
    abha_id: '91-3329-8812-7612',
    mrn: 'MH-2026-0112',
    visit_type: 'ROUTINE_FOLLOWUP',
    chief_complaint: 'Hypertension monthly refill & BP checkup',
    status: 'COMPLETED',
    room_number: 'Room 104',
    vitals_preview: 'BP: 130/84 • HR: 74 bpm',
    asha_referrer: 'Sunita Shinde (ASHA #104)'
  },
  {
    id: 'apt-02',
    slot_time: '09:15 AM - 09:30 AM',
    token_number: 'TK-MED-102',
    patient_name: 'Rajesh Patil',
    patient_age: 48,
    patient_gender: 'Male',
    abha_id: '91-4820-9182-3910',
    mrn: 'MH-2026-0041',
    visit_type: 'NEW_CONSULTATION',
    chief_complaint: 'Exertional chest tightness & chronic acidity',
    status: 'NOW_SERVING',
    room_number: 'Room 104',
    vitals_preview: 'BP: 148/92 • SpO2: 96% • Sugar: 165',
    asha_referrer: 'Sunita Shinde (ASHA #104)'
  },
  {
    id: 'apt-03',
    slot_time: '09:30 AM - 09:45 AM',
    token_number: 'TK-ANC-103',
    patient_name: 'Sunita Mehra',
    patient_age: 28,
    patient_gender: 'Female',
    abha_id: '91-8841-2910-4491',
    mrn: 'MH-2026-0089',
    visit_type: 'EMERGENCY_FASTTRACK',
    chief_complaint: 'High-Risk ANC Tri-3 with severe headache & swelling',
    status: 'IN_WAITING',
    room_number: 'Room 104',
    vitals_preview: 'BP: 142/90 • HR: 88 bpm • FHR: 140',
    asha_referrer: 'Kavita Rao (ASHA #108)'
  },
  {
    id: 'apt-04',
    slot_time: '09:45 AM - 10:00 AM',
    token_number: 'TK-MED-104',
    patient_name: 'Ramesh Yadav',
    patient_age: 41,
    patient_gender: 'Male',
    abha_id: '91-4432-8901-7721',
    mrn: 'MH-2026-0001',
    visit_type: 'ROUTINE_FOLLOWUP',
    chief_complaint: 'Type-2 Diabetes glycemic review & Metformin refill',
    status: 'IN_WAITING',
    room_number: 'Room 104',
    vitals_preview: 'BP: 124/80 • Sugar: 140 mg/dL',
    asha_referrer: 'Sunita Shinde (ASHA #104)'
  },
  {
    id: 'apt-05',
    slot_time: '10:00 AM - 10:15 AM',
    token_number: 'TK-TEL-105',
    patient_name: 'Gopal Singh Rao',
    patient_age: 71,
    patient_gender: 'Male',
    abha_id: '91-7721-0043-9811',
    mrn: 'MH-2026-0003',
    visit_type: 'TELECONSULT_REVIEW',
    chief_complaint: 'COPD post-nebulization follow-up via Bassi Dispensary',
    status: 'CONFIRMED',
    room_number: 'Room 104 (Tele-Hub)',
    vitals_preview: 'BP: 138/86 • SpO2: 94%',
    asha_referrer: 'Meera Bai (ASHA #112)'
  },
  {
    id: 'apt-06',
    slot_time: '10:15 AM - 10:30 AM',
    token_number: 'TK-MED-106',
    patient_name: 'Kavita Gurjar',
    patient_age: 31,
    patient_gender: 'Female',
    abha_id: '91-8821-4902-3112',
    mrn: 'MH-2026-0002',
    visit_type: 'NEW_CONSULTATION',
    chief_complaint: 'Persistent dizziness and low blood pressure symptoms',
    status: 'CONFIRMED',
    room_number: 'Room 104',
    vitals_preview: 'BP: 104/68 • HR: 76 bpm',
    asha_referrer: 'Kavita Rao (ASHA #108)'
  }
];

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const isPatientRole = user?.role === 'PATIENT';

  if (isPatientRole) {
    return <CitizenAppointmentsView />;
  }

  const { t } = useTranslation();
  const [roster, setRoster] = useState<DoctorAppointmentSlot[]>(INITIAL_DOCTOR_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddWalkInOpen, setIsAddWalkInOpen] = useState(false);

  // New Walk-in Form State
  const [walkinName, setWalkinName] = useState('');
  const [walkinAge, setWalkinAge] = useState('45');
  const [walkinGender, setWalkinGender] = useState('Male');
  const [walkinType, setWalkinType] = useState<DoctorAppointmentSlot['visit_type']>('NEW_CONSULTATION');
  const [walkinComplaint, setWalkinComplaint] = useState('');

  const handleUpdateStatus = (slotId: string, newStatus: DoctorAppointmentSlot['status']) => {
    setRoster(roster.map(s => s.id === slotId ? { ...s, status: newStatus } : s));
  };

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const newSlot: DoctorAppointmentSlot = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      slot_time: 'Next Available (Walk-in)',
      token_number: `TK-WLK-${Math.floor(100 + Math.random() * 900)}`,
      patient_name: walkinName,
      patient_age: parseInt(walkinAge) || 45,
      patient_gender: walkinGender,
      abha_id: `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: `MH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      visit_type: walkinType,
      chief_complaint: walkinComplaint || 'Walk-in OPD Consultation',
      status: 'IN_WAITING',
      room_number: 'Room 104',
      vitals_preview: 'Logged at Triage Station',
      asha_referrer: 'OPD Reception Desk'
    };

    setRoster([...roster, newSlot]);
    setIsAddWalkInOpen(false);
    setWalkinName('');
    setWalkinComplaint('');
    alert(`✓ Patient ${newSlot.patient_name} assigned Token #${newSlot.token_number} in today's OPD schedule.`);
  };

  const filteredRoster = roster.filter(slot => {
    const matchesSearch =
      slot.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.token_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.abha_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slot.chief_complaint.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || slot.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-12 font-sans">
      {/* 1. TOP DOCTOR SCHEDULE HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Doctor OPD Schedule & Appointments Roster
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Dr. Priya Sharma • Room 104
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Today's scheduled OPD consultation slots, patient queues, and walk-in capacity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAddWalkInOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Add Walk-In Patient</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Today's Total Slots</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{roster.length} Appointments</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Waiting in Lobby</p>
            <p className="text-lg font-bold text-amber-600 mt-0.5">
              {roster.filter(r => r.status === 'IN_WAITING').length} Patients
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Completed Consults</p>
            <p className="text-lg font-bold text-emerald-600 mt-0.5">
              {roster.filter(r => r.status === 'COMPLETED').length} Seen
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Now in Consultation</p>
            <p className="text-lg font-bold text-blue-600 mt-0.5">
              {roster.find(r => r.status === 'NOW_SERVING')?.patient_name || 'None Active'}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 2. SEARCH & STATUS FILTER CONTROLS */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search scheduled patient, token, or condition..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'NOW_SERVING', 'IN_WAITING', 'CONFIRMED', 'COMPLETED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition shrink-0 cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. DOCTOR'S APPOINTMENT ROSTER TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-3.5">TIME SLOT / TOKEN</th>
                <th className="py-3 px-3.5">PATIENT DETAILS</th>
                <th className="py-3 px-3.5">VISIT TYPE / REASON</th>
                <th className="py-3 px-3.5">VITALS PREVIEW</th>
                <th className="py-3 px-3.5">STATUS</th>
                <th className="py-3 px-3.5 text-right">CONSULTATION ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRoster.map(slot => (
                  <tr
                    key={slot.id}
                    className={`transition ${
                      slot.status === 'NOW_SERVING'
                        ? 'bg-blue-50/60 font-medium'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Slot Time & Token */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block">{slot.slot_time}</span>
                      <span className="font-mono text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                        {slot.token_number}
                      </span>
                    </td>

                    {/* Patient Info */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-bold text-slate-900 block text-xs">{slot.patient_name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {slot.patient_age}y/{slot.patient_gender} • ABHA: {slot.abha_id}
                      </span>
                    </td>

                    {/* Visit Type & Complaint */}
                    <td className="py-3 px-3.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {slot.visit_type.replace('_', ' ')}
                      </span>
                      <p className="text-slate-800 text-[11px] leading-snug line-clamp-1">{slot.chief_complaint}</p>
                    </td>

                    {/* Vitals */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-[11px] text-slate-600">
                      {slot.vitals_preview}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          slot.status === 'NOW_SERVING'
                            ? 'bg-blue-600 text-white animate-pulse'
                            : slot.status === 'IN_WAITING'
                            ? 'bg-amber-100 text-amber-800'
                            : slot.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {slot.status.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap space-x-1.5">
                      {slot.status === 'IN_WAITING' && (
                        <button
                          onClick={() => handleUpdateStatus(slot.id, 'NOW_SERVING')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer"
                        >
                          Call In
                        </button>
                      )}
                      {slot.status === 'NOW_SERVING' && (
                        <button
                          onClick={() => handleUpdateStatus(slot.id, 'COMPLETED')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer"
                        >
                          Mark Done
                        </button>
                      )}
                      {slot.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(slot.id, 'IN_WAITING')}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md text-[11px] font-medium transition cursor-pointer"
                        >
                          Arrived
                        </button>
                      )}
                      <Link
                        to="/doctor"
                        className="bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-slate-200/80 transition inline-block cursor-pointer"
                      >
                        OPD Console &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. ADD WALK-IN MODAL */}
      {isAddWalkInOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>Add Walk-In Patient to OPD Schedule</span>
              </h3>
              <button
                onClick={() => setIsAddWalkInOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddWalkin} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={walkinName}
                  onChange={e => setWalkinName(e.target.value)}
                  placeholder="e.g. Ramesh Tukaram"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Gender</label>
                  <select
                    value={walkinGender}
                    onChange={e => setWalkinGender(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Age</label>
                  <input
                    type="number"
                    value={walkinAge}
                    onChange={e => setWalkinAge(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Visit Type</label>
                <select
                  value={walkinType}
                  onChange={e => setWalkinType(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                >
                  <option value="NEW_CONSULTATION">New Clinical Consultation</option>
                  <option value="ROUTINE_FOLLOWUP">Routine Follow-up & Medication Refill</option>
                  <option value="EMERGENCY_FASTTRACK">Emergency / Urgent Fast-Track</option>
                  <option value="TELECONSULT_REVIEW">Teleconsultation Review</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Symptoms / Chief Complaint</label>
                <textarea
                  rows={2}
                  value={walkinComplaint}
                  onChange={e => setWalkinComplaint(e.target.value)}
                  placeholder="Describe patient symptoms..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddWalkInOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Confirm Walk-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
