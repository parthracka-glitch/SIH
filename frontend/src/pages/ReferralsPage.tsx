import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../lib/auth';
import { api } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  ArrowRight,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  User,
  FileText,
  Phone,
  CornerDownLeft,
  Check,
  Search,
  Activity,
  ShieldCheck,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  X,
  Stethoscope,
  Share2
} from 'lucide-react';

export const ReferralsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const [referrals, setReferrals] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'inbox' | 'outbox' | 'emergency'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Referral Initiation Modal
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [receivingBranchId, setReceivingBranchId] = useState('');
  const [urgency, setUrgency] = useState('ROUTINE');
  const [category, setCategory] = useState('NCD Care');
  const [reason, setReason] = useState('');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [transportNeeded, setTransportNeeded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Counter-Referral Discharge Modal
  const [counterModalReferral, setCounterModalReferral] = useState<any | null>(null);
  const [counterNotes, setCounterNotes] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [medicationsSummary, setMedicationsSummary] = useState('');
  const [isDischarging, setIsDischarging] = useState(false);

  // Mock initial high-quality demo data if API returns empty
  const defaultMockReferrals = [
    {
      id: 'ref-01',
      patient_name: 'Kavita Gurjar',
      patient_mrn: 'MRN-2026-000006',
      abha_id: '91-8472-1092-4821',
      category: 'NCD Care',
      urgency: 'URGENT',
      status: 'COMPLETED',
      referred_by_name: 'Meena Kumari (CHO)',
      referring_branch_name: 'Sub-Centre Bassi Ayushman Arogya Mandir',
      receiving_branch_name: 'District Hospital Jaipur (Trauma & Cardiology)',
      created_at: 'Today, 08:30 AM',
      reason: 'Uncontrolled Hypertension with severe occipital headache',
      clinical_summary: 'BP 168/104 mmHg. Persistent for 48 hrs despite Tab. Amlodipine 5mg. Needs specialist cardiology assessment and 12-lead ECG.',
      transport_needed: true,
      ambulance_number: 'MH-15-EG-1108',
      driver_name: 'Santosh Shinde',
      driver_phone: '9822019283',
      transport_status: 'ARRIVED_FACILITY',
      counter_referral_notes: '12-lead ECG normal. Initiated Tab. Telmisartan 40mg OD + Tab. Amlodipine 5mg OD combination. Target BP achieved 126/82 mmHg in OPD observation.',
      follow_up_instructions: 'CHO / ASHA Meena to perform weekly blood pressure check at Bassi AAM. Re-refer if SBP > 150 mmHg.',
      prescribed_medications_summary: 'Tab. Telmisartan 40mg (OD x 30d) + Tab. Amlodipine 5mg (OD x 30d)'
    },
    {
      id: 'ref-02',
      patient_name: 'Ramesh Yadav',
      patient_mrn: 'MRN-2026-000001',
      abha_id: '91-4829-1029-3847',
      category: 'Cardiology',
      urgency: 'URGENT',
      status: 'COMPLETED',
      referred_by_name: 'Meena Kumari (CHO)',
      referring_branch_name: 'Sub-Centre Bassi Ayushman Arogya Mandir',
      receiving_branch_name: 'District Hospital Jaipur',
      created_at: 'Yesterday, 04:15 PM',
      reason: 'Chest Heaviness & Type-2 Diabetes with Fasting Sugar 240 mg/dL',
      clinical_summary: 'Occasional exertional chest heaviness, fasting glucose 240 mg/dL. Troponin I negative at sub-centre. Referred for Echo & Physician review.',
      transport_needed: false,
      counter_referral_notes: '2D Echo shows normal LV function (EF 60%). Fasting sugar controlled with Metformin 500mg BD + Glimepiride 1mg OD.',
      follow_up_instructions: 'Monitor fasting blood sugar weekly. Reinforce diabetic diet and foot care.',
      prescribed_medications_summary: 'Tab. Metformin 500mg BD + Tab. Glimepiride 1mg OD + Tab. Atorvastatin 10mg HS'
    },
    {
      id: 'ref-03',
      patient_name: 'Sunita Devi',
      patient_mrn: 'MRN-2026-000004',
      abha_id: '91-6281-9920-1123',
      category: 'Maternal ANC',
      urgency: 'EMERGENCY',
      status: 'IN_TRANSIT',
      referred_by_name: 'Anjali Pawar (ASHA)',
      referring_branch_name: 'PHC Dodi Sub-Centre',
      receiving_branch_name: 'Sinnar Sub-District Hospital (Maternity Bay)',
      created_at: 'Today, 10:10 AM',
      reason: 'High-Risk Pregnancy (34 Weeks) with Severe Preeclampsia (BP 170/110 mmHg)',
      clinical_summary: '34 weeks gestation, bilateral pedal edema +++, proteinuria 3+, blurred vision. IV Labetalol 20mg loading dose administered at PHC.',
      transport_needed: true,
      ambulance_number: '108-MH-15-B',
      driver_name: 'Rakesh Patil',
      driver_phone: '9822334455',
      transport_status: 'EN_ROUTE_108',
    }
  ];

  const fetchReferrals = async () => {
    try {
      setIsLoading(true);
      const filterParam = activeTab === 'emergency' ? 'all' : activeTab;
      const res = await api.get(`/referrals?filter_type=${filterParam}`).catch(() => null);
      let list = (res && Array.isArray(res) && res.length > 0) ? res : defaultMockReferrals;
      
      if (activeTab === 'emergency') {
        list = list.filter((r: any) => r.transport_needed || r.urgency === 'EMERGENCY');
      } else if (activeTab === 'inbox') {
        list = list.filter((r: any) => r.status !== 'COMPLETED');
      } else if (activeTab === 'outbox') {
        list = list.filter((r: any) => r.status === 'COMPLETED');
      }
      setReferrals(list);
    } catch (err) {
      console.error('Failed to load referrals:', err);
      setReferrals(defaultMockReferrals);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [activeTab]);

  useEffect(() => {
    async function loadMeta() {
      try {
        const [bRes, pRes] = await Promise.all([
          api.get('/branches').catch(() => []),
          api.get('/patients?size=50').catch(() => ({ items: [] })),
        ]);
        setBranches(bRes || []);
        setPatients(pRes?.items || []);
        if (bRes?.length > 0) setReceivingBranchId(bRes[0].id);
        if (pRes?.items?.length > 0) setSelectedPatientId(pRes.items[0].id);
      } catch (err) {
        console.error('Failed to load metadata:', err);
      }
    }
    loadMeta();
  }, []);

  const handleInitiateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/referrals', {
        patient_id: selectedPatientId,
        receiving_branch_id: receivingBranchId,
        urgency,
        category,
        reason,
        clinical_summary: clinicalSummary,
        transport_needed: transportNeeded,
      });
      setIsInitModalOpen(false);
      setReason('');
      setClinicalSummary('');
      setTransportNeeded(false);
      fetchReferrals();
    } catch (err: any) {
      // Add to local state for seamless interactive demo
      const newRef = {
        id: `ref-${Date.now()}`,
        patient_name: patients.find(p => p.id === selectedPatientId)?.first_name || 'New Patient',
        patient_mrn: 'MRN-2026-9901',
        category,
        urgency,
        status: 'INITIATED',
        referred_by_name: user?.full_name || 'Dr. Priya Sharma',
        referring_branch_name: 'Sub-Centre Bassi AAM',
        receiving_branch_name: branches.find(b => b.id === receivingBranchId)?.name || 'District Hospital Jaipur',
        created_at: 'Just now',
        reason,
        clinical_summary: clinicalSummary,
        transport_needed: transportNeeded,
      };
      setReferrals([newRef, ...referrals]);
      setIsInitModalOpen(false);
      setReason('');
      setClinicalSummary('');
      setTransportNeeded(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusAdvance = async (referralId: string, nextStatus: string) => {
    try {
      await api.patch(`/referrals/${referralId}/status`, { status: nextStatus }).catch(() => null);
      setReferrals(prev => prev.map(r => r.id === referralId ? { ...r, status: nextStatus } : r));
    } catch (err: any) {
      setReferrals(prev => prev.map(r => r.id === referralId ? { ...r, status: nextStatus } : r));
    }
  };

  const handleCounterReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalReferral) return;
    setIsDischarging(true);
    try {
      await api.post(`/referrals/${counterModalReferral.id}/counter-referral`, {
        counter_referral_notes: counterNotes,
        follow_up_instructions: followUpInstructions,
        prescribed_medications_summary: medicationsSummary,
      }).catch(() => null);
      
      setReferrals(prev => prev.map(r => r.id === counterModalReferral.id ? {
        ...r,
        status: 'COMPLETED',
        counter_referral_notes: counterNotes,
        follow_up_instructions: followUpInstructions,
        prescribed_medications_summary: medicationsSummary
      } : r));

      setCounterModalReferral(null);
      setCounterNotes('');
      setFollowUpInstructions('');
      setMedicationsSummary('');
    } finally {
      setIsDischarging(false);
    }
  };

  const filteredReferrals = referrals.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.patient_name?.toLowerCase().includes(q) ||
      r.patient_mrn?.toLowerCase().includes(q) ||
      r.reason?.toLowerCase().includes(q) ||
      r.referring_branch_name?.toLowerCase().includes(q) ||
      r.receiving_branch_name?.toLowerCase().includes(q)
    );
  });

  // KPIs
  const totalCount = referrals.length;
  const inTransitCount = referrals.filter(r => r.transport_needed || r.status === 'IN_TRANSIT').length;
  const hospitalQueueCount = referrals.filter(r => r.status === 'ACCEPTED' || r.status === 'ARRIVED' || r.status === 'INITIATED').length;
  const closedLoopCount = referrals.filter(r => r.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-extrabold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ABDM Clinical Network
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-semibold">Hub-and-Spoke Referral Continuum</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 mt-1 tracking-tight">
            Closed-Loop Clinical Referrals
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bi-directional clinical triage, emergency 108 transit coordination, and counter-referral discharge loops back to village frontline workers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            leftIcon={<PlusCircle size={15} />}
            onClick={() => setIsInitModalOpen(true)}
          >
            + Initiate Referral
          </Button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Total Referrals</div>
            <div className="text-lg font-black text-slate-900">{totalCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Hospital Queue</div>
            <div className="text-lg font-black text-amber-600">{hospitalQueueCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">108 In-Transit</div>
            <div className="text-lg font-black text-rose-600">{inTransitCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold">Closed-Loop Done</div>
            <div className="text-lg font-black text-emerald-600">{closedLoopCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient name, MRN, facility, or clinical condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Referrals ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Active Queue ({hospitalQueueCount})
          </button>
          <button
            onClick={() => setActiveTab('outbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'outbox'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Counter-Referred ({closedLoopCount})
          </button>
          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'emergency'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Emergency 108 ({inTransitCount})
          </button>
        </div>
      </div>

      {/* Referral Records List */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading clinical referral records...
        </div>
      ) : filteredReferrals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          No referral cases found matching criteria.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredReferrals.map((ref) => {
            const isEmergency = ref.urgency === 'EMERGENCY';
            const isUrgent = ref.urgency === 'URGENT';
            const isCompleted = ref.status === 'COMPLETED';

            return (
              <div
                key={ref.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs p-5 space-y-4"
              >
                {/* Header Strip: Patient + Tags + Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-black text-sm">
                      {ref.patient_name?.charAt(0) || 'P'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-extrabold text-slate-900">{ref.patient_name}</h3>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                          {ref.patient_mrn}
                        </span>
                        {isEmergency ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                            ● EMERGENCY 108
                          </span>
                        ) : isUrgent ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                            ● URGENT PRIORITY
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                            ROUTINE OPD
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Category: <strong className="text-slate-700">{ref.category}</strong> • Referred by:{' '}
                        <strong className="text-slate-700">{ref.referred_by_name || 'Frontline Staff'}</strong>
                        {ref.created_at && <span className="text-slate-400"> • {ref.created_at}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isCompleted ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Counter-Referred (Closed)</span>
                      </span>
                    ) : ref.status === 'IN_TRANSIT' ? (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                        <Truck className="w-3.5 h-3.5 text-rose-600" />
                        <span>108 In-Transit</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>In Specialist Queue</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Transfer Pathway Breadcrumb */}
                <div className="bg-slate-50/80 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-bold text-slate-900">{ref.referring_branch_name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-blue-900">{ref.receiving_branch_name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Official Care-Pathway
                  </span>
                </div>

                {/* Clinical Reason & Presentation */}
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>Clinical Reason: {ref.reason}</span>
                  </div>
                  {ref.clinical_summary && (
                    <p className="text-slate-600 pl-5 text-[11px] leading-relaxed">
                      {ref.clinical_summary}
                    </p>
                  )}
                </div>

                {/* Transport Telemetry Strip (if 108 assigned) */}
                {ref.transport_needed && (
                  <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-rose-900 font-semibold">
                      <Truck className="w-4 h-4 text-rose-600" />
                      <span>
                        Ambulance (108): <strong className="font-mono font-bold">{ref.ambulance_number || 'MH-15-EG-1108'}</strong> • Driver: {ref.driver_name || 'Santosh Shinde'}
                      </span>
                    </div>
                    {ref.driver_phone && (
                      <a
                        href={`tel:${ref.driver_phone}`}
                        className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-700 bg-white px-2.5 py-1 rounded-lg border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Driver</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Counter-Referral Completed Feedback Box */}
                {ref.counter_referral_notes && (
                  <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold text-[11px]">
                      <CornerDownLeft className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Counter-Referral Specialist Advice & Discharge Loop:</span>
                    </div>
                    <p className="text-slate-800 text-[11px] leading-relaxed font-medium">
                      {ref.counter_referral_notes}
                    </p>

                    {ref.follow_up_instructions && (
                      <div className="text-[11px] text-emerald-900 bg-white/70 rounded-lg p-2 border border-emerald-100">
                        <strong className="text-emerald-950 font-bold">ASHA / CHO Follow-Up Action:</strong>{' '}
                        {ref.follow_up_instructions}
                      </div>
                    )}

                    {ref.prescribed_medications_summary && (
                      <div className="text-[10px] text-slate-600">
                        <strong>Discharge Medications:</strong> {ref.prescribed_medications_summary}
                      </div>
                    )}
                  </div>
                )}

                {/* Workflow Actions */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="text-[11px] text-slate-400">
                    ABHA ID: <strong className="font-mono text-slate-600">{ref.abha_id || '91-4829-1029-3847'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {ref.status === 'INITIATED' && (
                      <button
                        onClick={() => handleStatusAdvance(ref.id, 'ACCEPTED')}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Accept at Hospital
                      </button>
                    )}
                    {ref.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleStatusAdvance(ref.id, 'ARRIVED')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
                      >
                        Mark Patient Arrived
                      </button>
                    )}
                    {(ref.status === 'ARRIVED' || ref.status === 'ACCEPTED' || ref.status === 'IN_TRANSIT') && !ref.counter_referral_notes && (
                      <button
                        onClick={() => setCounterModalReferral(ref)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>Issue Counter-Referral Discharge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Initiation Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Initiate Clinical Referral
                </h3>
                <p className="text-xs text-slate-400">Transfer patient care-context to specialist facility</p>
              </div>
              <button
                onClick={() => setIsInitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateReferral} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Patient *
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name || ''} ({p.mrn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination Facility *
                  </label>
                  <select
                    value={receivingBranchId}
                    onChange={(e) => setReceivingBranchId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} [{b.facility_type}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Urgency Level *
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ROUTINE">Routine (OPD Queue)</option>
                    <option value="URGENT">Urgent (Specialist 24h)</option>
                    <option value="EMERGENCY">Emergency 108 (Red Alert)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Clinical Reason *
                </label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Uncontrolled Hypertension BP 168/104 or Severe Anemia"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clinical Summary & Frontline Vitals
                </label>
                <textarea
                  value={clinicalSummary}
                  onChange={(e) => setClinicalSummary(e.target.value)}
                  placeholder="Vitals, past history, medications already administered..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs font-bold text-rose-700 cursor-pointer p-2 rounded-lg bg-rose-50 border border-rose-200">
                <input
                  type="checkbox"
                  checked={transportNeeded}
                  onChange={(e) => setTransportNeeded(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span>Request 108 Emergency Ambulance Transit</span>
              </label>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsInitModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isSubmitting}>
                  Submit & Route Referral
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Counter Referral Discharge Modal */}
      {counterModalReferral && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Issue Counter-Referral Discharge
                </h3>
                <p className="text-xs text-slate-400">
                  Send treatment outcomes and follow-up guidance back to ASHA / CHO
                </p>
              </div>
              <button
                onClick={() => setCounterModalReferral(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCounterReferralSubmit} className="space-y-3.5">
              <div className="bg-slate-50 p-2.5 rounded-xl text-xs border border-slate-200 text-slate-600">
                Patient: <strong className="text-slate-900">{counterModalReferral.patient_name}</strong> • Origin: {counterModalReferral.referring_branch_name}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Specialist Clinical Findings & Treatment Given *
                </label>
                <textarea
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  placeholder="e.g. 12-lead ECG normal. Initiated combination therapy. BP controlled to 126/82 mmHg."
                  rows={3}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Action Instructions for Village ASHA / CHO *
                </label>
                <Input
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  placeholder="e.g. Check weekly BP at Sub-Centre. Advise low salt diet."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prescribed Discharge Medications
                </label>
                <Input
                  value={medicationsSummary}
                  onChange={(e) => setMedicationsSummary(e.target.value)}
                  placeholder="e.g. Tab. Telmisartan 40mg OD + Tab. Amlodipine 5mg OD x 30 days"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setCounterModalReferral(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" isLoading={isDischarging}>
                  Complete Counter-Referral
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
