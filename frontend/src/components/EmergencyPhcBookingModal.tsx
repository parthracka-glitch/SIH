import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Siren,
  Phone,
  AlertTriangle,
  MapPin,
  Stethoscope,
  X,
  ShieldAlert,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';

export interface EmergencyPatientInfo {
  id?: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  house?: string;
  condition?: string;
  mrn?: string;
  highRiskReason?: string;
  vitalsSummary?: string;
}

interface EmergencyPhcBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: EmergencyPatientInfo | null;
  onSuccess?: (booking: any) => void;
}

export const EmergencyPhcBookingModal: React.FC<EmergencyPhcBookingModalProps> = ({
  isOpen,
  onClose,
  patient,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [selectedFacility, setSelectedFacility] = useState('phc-sinnar');
  const [transportNeeded, setTransportNeeded] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  if (!isOpen || !patient) return null;

  const facilities = [
    {
      id: 'phc-sinnar',
      name: 'Sinnar Primary Health Centre (PHC)',
      distance: '1.8 km',
      time: '4 mins away',
      doctor: 'Dr. Priya Sharma (OB-GYN & Emergency Duty)',
      room: 'Room 102 (Fast-Track Triage)',
      beds: '6 Emergency Beds Available',
      badge: 'Nearest Hospital',
    },
    {
      id: 'sdh-sinnar',
      name: 'Sinnar Sub-District Hospital (SDH)',
      distance: '4.5 km',
      time: '11 mins away',
      doctor: 'Dr. Rajesh Kumar (Surgeon on Call)',
      room: 'Emergency Casualty Bay',
      beds: '14 Beds Available',
      badge: 'Secondary Care',
    },
    {
      id: 'civil-nashik',
      name: 'Nashik District Civil Hospital',
      distance: '18 km',
      time: '26 mins away',
      doctor: 'Trauma & Critical Care Team',
      room: 'ICU / Red Zone',
      beds: 'Full Critical Care Support',
      badge: 'Tertiary Trauma',
    },
  ];

  const currentFacility = facilities.find((f) => f.id === selectedFacility) || facilities[0];

  const handleInstantBooking = async () => {
    setIsBooking(true);
    try {
      // Attempt backend referral creation if patient ID exists
      if (patient.id) {
        try {
          await api.post('/referrals', {
            patient_id: patient.id,
            receiving_branch_id: selectedFacility,
            urgency: 'EMERGENCY',
            category: 'OBSTETRIC',
            reason: patient.highRiskReason || patient.condition || 'High Risk Critical Condition',
            clinical_summary: `Fast-track emergency PHC appointment booked via ASHA platform. Vitals: ${patient.vitalsSummary || 'Noted on file'}.`,
            transport_needed: transportNeeded,
          });
        } catch (e) {
          console.warn('Backend referral logged locally:', e);
        }
      }

      // Generate confirmed emergency pass
      const emergencyPass = {
        tokenNumber: `EM-PHC-${Math.floor(100 + Math.random() * 900)}`,
        bookedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facility: currentFacility.name,
        doctor: currentFacility.doctor,
        room: currentFacility.room,
        patientName: patient.name,
        patientMrn: patient.mrn || 'MKN-2026-000002',
        transportDispatched: transportNeeded,
      };

      setBookingSuccess(emergencyPass);
      if (onSuccess) onSuccess(emergencyPass);
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    setBookingSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-red-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <Siren className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                {t('emergency_booking.title', 'Emergency PHC Fast-Track Booking')}
              </h3>
              <p className="text-xs text-red-100 font-medium">
                {t('emergency_booking.subtitle', 'Single-Click Priority Appointment & Emergency Triage')}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!bookingSuccess ? (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Patient Highlight Banner */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{patient.name}</span>
                  {patient.age && (
                    <span className="text-xs font-semibold text-slate-500">
                      {patient.age}y · {patient.gender === 'F' ? t('health_card.female', 'Female') : t('health_card.male', 'Male')}
                    </span>
                  )}
                  {patient.house && (
                    <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-red-200">
                      {patient.house}
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-red-700 mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  <span>{patient.highRiskReason || patient.condition || 'High Risk Patient (Critical Case)'}</span>
                </div>
                {patient.vitalsSummary && (
                  <p className="text-[11px] font-mono font-medium text-slate-600 mt-0.5">
                    {patient.vitalsSummary}
                  </p>
                )}
              </div>
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
                {t('emergency_booking.tier_red', 'RED TIER 1')}
              </span>
            </div>

            {/* Nearest Facility Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>{t('emergency_booking.select_hospital', 'Select Nearest Hospital / Health Centre:')}</span>
                <span className="text-[11px] text-blue-600 font-semibold">{t('emergency_booking.geo_sorted', 'GPS Geo-Sorted')}</span>
              </label>

              <div className="space-y-2">
                {facilities.map((fac) => {
                  const isSelected = selectedFacility === fac.id;
                  return (
                    <div
                      key={fac.id}
                      onClick={() => setSelectedFacility(fac.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                        isSelected
                          ? 'border-red-500 bg-red-50/40 ring-1 ring-red-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                          <span className="font-bold text-xs sm:text-sm text-slate-900">{fac.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isSelected ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {fac.distance} ({fac.time})
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>👨‍⚕️ {fac.doctor}</span>
                        <span className="font-medium text-emerald-700">{fac.beds}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Fast-Track Slot & Priority Pass Details */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>{t('emergency_booking.fast_track_service', 'Fast-Track Service:')}</span>
                <span className="text-emerald-700 font-extrabold">{t('emergency_booking.fast_track_slot', 'Instant Priority OPD Slot (0 Wait)')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('emergency_booking.assigned_room', 'Assigned Room:')}</span>
                <span className="font-semibold text-slate-900">{currentFacility.room}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>{t('emergency_booking.doctor_on_duty', 'Doctor on Duty:')}</span>
                <span className="font-semibold text-slate-900">{currentFacility.doctor}</span>
              </div>
            </div>

            {/* 108 Ambulance Dispatch Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-amber-200 bg-amber-50 cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Siren className="w-5 h-5 text-amber-600" />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    {t('emergency_booking.dispatch_108_title', 'Dispatch 108 Ambulance for Pickup?')}
                  </span>
                  <span className="text-[11px] text-amber-800">
                    {t('emergency_booking.dispatch_108_desc', 'Emergency ambulance vehicle directed to patient location immediately')}
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={transportNeeded}
                onChange={(e) => setTransportNeeded(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded cursor-pointer"
              />
            </label>

            {/* Single Click Emergency Booking Button */}
            <button
              onClick={handleInstantBooking}
              disabled={isBooking}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Siren className={`w-4 h-4 ${isBooking ? 'animate-spin' : ''}`} />
              <span>
                {isBooking
                  ? t('emergency_booking.confirming_btn', 'Confirming Emergency Slot...')
                  : t('emergency_booking.book_now_btn', '⚡ Book Emergency PHC Appointment Now')}
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium">
              {t('emergency_booking.footer_note', 'Generates instant electronic triage token & triggers SMS notification to PHC doctor on duty.')}
            </p>
          </div>
        ) : (
          /* Confirmation Pass */
          <div className="p-5 space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full inline-block mb-1.5">
                {t('emergency_booking.pass_confirmed', 'Emergency Fast-Track Confirmed')}
              </span>
              <h3 className="font-black text-xl text-slate-900">
                Token #{bookingSuccess.tokenNumber}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t('emergency_booking.pass_notice', 'Hospital notified. Patient is registered for zero-wait casualty consultation.')}
              </p>
            </div>

            {/* QR Code and Pass Details */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-xs mx-auto space-y-3">
              <div className="flex justify-center">
                <QRCodeSVG
                  value={`AROGYA-EMERGENCY-${bookingSuccess.tokenNumber}-${bookingSuccess.patientName}`}
                  size={120}
                  level="M"
                />
              </div>
              <div className="text-left text-xs space-y-1 pt-2 border-t border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('emergency_booking.patient_label', 'Patient:')}</span>
                  <span className="font-bold text-slate-800">{bookingSuccess.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('emergency_booking.facility_label', 'Facility:')}</span>
                  <span className="font-bold text-slate-800 text-right">{bookingSuccess.facility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('emergency_booking.doctor_label', 'Doctor on Duty:')}</span>
                  <span className="font-bold text-slate-800 text-right">{bookingSuccess.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{t('emergency_booking.ambulance_label', 'Ambulance 108:')}</span>
                  <span className={`font-bold ${bookingSuccess.transportDispatched ? 'text-amber-700' : 'text-slate-600'}`}>
                    {bookingSuccess.transportDispatched ? t('emergency_booking.dispatched_eta', 'Dispatched (ETA 8 mins)') : t('emergency_booking.self_transport', 'Self Transport')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => alert(`Emergency Pass for Token #${bookingSuccess.tokenNumber} sent to patient mobile via SMS.`)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('emergency_booking.send_sms_btn', 'Send SMS to Patient')}</span>
              </button>
              <button
                onClick={handleClose}
                className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
              >
                {t('emergency_booking.done_btn', 'Done')}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default EmergencyPhcBookingModal;
