import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  Syringe,
  ThermometerSnowflake,
  TrendingUp,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  Baby,
  ShieldCheck,
  Search,
  Check,
  Calendar,
} from 'lucide-react';

export const ImmunizationPage: React.FC = () => {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [forecasts, setForecasts] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [childPass, setChildPass] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPassLoading, setIsPassLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'COLD_CHAIN' | 'FORECAST'>('SCHEDULE');
  const [searchChildQuery, setSearchChildQuery] = useState('');

  // Administer Dose Modal
  const [isAdministerModalOpen, setIsAdministerModalOpen] = useState(false);
  const [selectedRecordForAdmin, setSelectedRecordForAdmin] = useState<any | null>(null);
  const [adminBatchNo, setAdminBatchNo] = useState('');
  const [adminAefi, setAdminAefi] = useState('NONE');
  const [isSubmittingAdmin, setIsSubmittingAdmin] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [catRes, eqRes, fcRes, ptsRes] = await Promise.all([
        api.get('/immunization/catalog'),
        api.get('/immunization/cold-chain'),
        api.get('/immunization/forecast'),
        api.get('/patients?size=50'),
      ]);
      setCatalog(catRes || []);
      setEquipment(eqRes || []);
      setForecasts(fcRes || []);
      const pItems = ptsRes?.items || [];
      setPatients(pItems);
      if (pItems.length > 0 && !selectedChildId) {
        setSelectedChildId(pItems[0].id);
        fetchChildPass(pItems[0].id);
      }
    } catch (err) {
      console.error('Failed to load immunization data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChildPass = async (childId: string) => {
    try {
      setIsPassLoading(true);
      const pass = await api.get(`/immunization/child/${childId}`);
      setChildPass(pass || []);
    } catch (err) {
      console.error('Failed to load child pass:', err);
    } finally {
      setIsPassLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    fetchChildPass(childId);
  };

  const handleOpenAdminister = (rec: any) => {
    setSelectedRecordForAdmin(rec);
    setAdminBatchNo(`VAC-${rec.vaccine?.vaccine_code || 'UIP'}-2026A`);
    setAdminAefi('NONE');
    setIsAdministerModalOpen(true);
  };

  const handleAdministerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecordForAdmin) return;

    try {
      setIsSubmittingAdmin(true);
      await api.post(`/immunization/records/${selectedRecordForAdmin.id}/administer`, {
        batch_number: adminBatchNo,
        aefi_reported: adminAefi,
      });

      setIsAdministerModalOpen(false);
      setActionSuccessMsg(`Vaccine dose recorded with batch #${adminBatchNo}.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
      if (selectedChildId) {
        fetchChildPass(selectedChildId);
      }
    } catch (err) {
      console.error('Failed to record vaccine administration:', err);
      alert('Failed to administer vaccine dose.');
    } finally {
      setIsSubmittingAdmin(false);
    }
  };

  const selectedPatientObj = patients.find((p) => p.id === selectedChildId);
  const administeredCount = childPass.filter((r) => r.status === 'ADMINISTERED').length;
  const totalScheduleCount = childPass.length;

  const filteredPatients = patients.filter((p) => {
    const q = searchChildQuery.toLowerCase();
    const fullName = `${p.first_name || ''} ${p.last_name || ''}`.toLowerCase();
    return !q || fullName.includes(q) || (p.mrn && p.mrn.toLowerCase().includes(q));
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* ─── TOAST ─── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. CLEAN HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Child Immunization & UIP Schedule</h1>
          <p className="text-sm text-slate-500 mt-0.5">Vaccination records, due doses tracking & cold chain monitor</p>
        </div>

        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ─── 2. SIMPLE STATS (FLAT, CLEAN) ─── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">UIP Coverage Rate</span>
          <span className="text-2xl font-bold text-emerald-700 block mt-1">96.4%</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Cold Chain Storage</span>
          <span className="text-2xl font-bold text-blue-700 block mt-1">{equipment.length} Active Hubs</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Temperature Status</span>
          <span className="text-base font-bold text-emerald-700 block mt-1.5">Optimal (+2° to +8°C)</span>
        </div>
      </div>

      {/* ─── 3. CLEAN TAB BAR ─── */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-1 text-xs">
        {[
          { id: 'SCHEDULE', label: 'Child Vaccination Pass', icon: Baby },
          { id: 'COLD_CHAIN', label: 'Cold Chain Refrigerators', icon: ThermometerSnowflake },
          { id: 'FORECAST', label: 'Vaccine Demand Forecast', icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: CHILD VACCINATION PASS ─── */}
      {activeTab === 'SCHEDULE' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Left: Child Selector (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Infant / Child
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {patients.length} Registered
              </span>
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search child name..."
                value={searchChildQuery}
                onChange={(e) => setSearchChildQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            {/* Child list */}
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto">
              {filteredPatients.map((p) => {
                const isSelected = p.id === selectedChildId;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectChild(p.id)}
                    className={`p-2.5 rounded-lg border transition cursor-pointer text-xs ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 text-blue-950 font-bold'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{p.first_name} {p.last_name || ''}</span>
                      <span className="text-[10px] text-slate-400">{p.gender === 'F' ? 'Female' : 'Male'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      MRN: {p.mrn} · DOB: {p.date_of_birth ? new Date(p.date_of_birth).toLocaleDateString() : 'Recent'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Vaccination Schedule Card (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            
            {/* Beneficiary Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedPatientObj ? `${selectedPatientObj.first_name} ${selectedPatientObj.last_name || ''}` : 'Child Vaccine Pass'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Completed: <strong className="text-slate-800">{administeredCount} of {totalScheduleCount}</strong> mandatory UIP doses
                </p>
              </div>

              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                administeredCount === totalScheduleCount && totalScheduleCount > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}>
                {administeredCount === totalScheduleCount && totalScheduleCount > 0 ? 'Fully Immunized' : 'In Progress'}
              </span>
            </div>

            {/* Vaccine Pass List */}
            {isPassLoading ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
                <span>Loading immunization pass...</span>
              </div>
            ) : childPass.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <span>No vaccine records found for this beneficiary.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {childPass.map((rec) => {
                  const isAdministered = rec.status === 'ADMINISTERED';
                  const isDue = rec.status === 'DUE' || rec.status === 'OVERDUE';
                  const vaccine = rec.vaccine;

                  return (
                    <div
                      key={rec.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition ${
                        isAdministered
                          ? 'bg-slate-50/50 border-slate-200'
                          : isDue
                          ? 'bg-amber-50/30 border-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* Left: Vaccine details */}
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isAdministered
                            ? 'bg-emerald-100 text-emerald-700'
                            : isDue
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isAdministered ? '✓' : '!'}
                        </div>

                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {vaccine?.name || 'Vaccine Dose'}
                            {vaccine?.dose_number && <span className="text-slate-500 text-xs font-normal ml-1">({vaccine.dose_number})</span>}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Target: {vaccine?.target_disease} · Due: {new Date(rec.scheduled_date).toLocaleDateString()}
                          </div>
                          {isAdministered && rec.batch_number && (
                            <div className="text-[10px] font-mono text-emerald-700 mt-0.5">
                              Batch: {rec.batch_number}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Status / Action */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          isAdministered
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDue
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isAdministered ? 'GIVEN' : 'DUE NOW'}
                        </span>

                        {!isAdministered && (
                          <button
                            onClick={() => handleOpenAdminister(rec)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition cursor-pointer"
                          >
                            <Syringe className="w-3 h-3" />
                            <span>Record Dose</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

      {/* ─── TAB 2: COLD CHAIN REFRIGERATORS (eVIN) ─── */}
      {activeTab === 'COLD_CHAIN' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {equipment.map((eq) => {
              const isTempSafe =
                eq.current_temperature_c >= eq.target_min_c && eq.current_temperature_c <= eq.target_max_c;

              return (
                <div key={eq.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 text-sm block">{eq.equipment_code}</strong>
                      <span className="text-[11px] text-slate-500">{eq.equipment_type}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      isTempSafe ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {isTempSafe ? 'OPTIMAL' : 'EXCURSION'}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-slate-100">
                    <span className="text-2xl font-black text-slate-900 block">
                      {eq.current_temperature_c.toFixed(1)} °C
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Safe Band: {eq.target_min_c}°C to {eq.target_max_c}°C
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span>Power: <strong>{eq.power_source}</strong></span>
                    <span className="text-emerald-700 font-semibold">Sensor Active</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── TAB 3: DEMAND FORECAST ─── */}
      {activeTab === 'FORECAST' && (
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 space-y-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Vaccine Commodity Stock & Next Month Requirement</h3>
            <p className="text-xs text-slate-500 mt-0.5">Sinnar Primary Health Centre stock buffer prediction</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {forecasts.map((fc) => {
              const deficit = fc.predicted_demand_units - fc.current_stock_units;
              const isShortage = deficit > 0;

              return (
                <div key={fc.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900 text-sm">{fc.commodity_name}</strong>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                      {fc.forecast_month}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block">Current Stock:</span>
                      <span className="text-base font-bold text-slate-900">{fc.current_stock_units} Units</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">Predicted Need:</span>
                      <span className={`text-base font-bold ${isShortage ? 'text-amber-700' : 'text-slate-900'}`}>
                        {fc.predicted_demand_units} Units
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex items-center justify-between">
                    <span>Driver: {fc.seasonal_risk_factor}</span>
                    <span className="font-bold text-blue-700">+{fc.recommended_buffer_units} Buffer</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── MODAL: RECORD VACCINE DOSE ─── */}
      {isAdministerModalOpen && selectedRecordForAdmin && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base text-slate-900">Record Vaccine Administration</h3>
              </div>
              <button
                onClick={() => setIsAdministerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdministerSubmit} className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-500 text-[11px] block">Vaccine:</span>
                <strong className="text-slate-900 text-sm block">
                  {selectedRecordForAdmin.vaccine?.name} ({selectedRecordForAdmin.vaccine?.dose_number})
                </strong>
                <span className="text-slate-500 text-[11px]">
                  Target Disease: {selectedRecordForAdmin.vaccine?.target_disease}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Manufacturer Batch Number</label>
                <input
                  type="text"
                  value={adminBatchNo}
                  onChange={(e) => setAdminBatchNo(e.target.value)}
                  placeholder="e.g. SII-BCG-9942A"
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">AEFI Observation (Reaction)</label>
                <select
                  value={adminAefi}
                  onChange={(e) => setAdminAefi(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold outline-none"
                >
                  <option value="NONE">None Observed (Standard 30-min observation normal)</option>
                  <option value="MILD_FEVER">Mild Fever / Local Swelling</option>
                  <option value="ANAPHYLAXIS_ALERT">Urgent Reaction / Medical Alert</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdministerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdmin}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  {isSubmittingAdmin ? 'Recording...' : 'Confirm Vaccine Given'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ImmunizationPage;
