import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import {
  Siren,
  Phone,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  X,
  RefreshCw,
  Building2,
  User,
  Heart,
  Plus,
} from 'lucide-react';

export const EmergencyDispatchPage: React.FC = () => {
  const [fleet, setFleet] = useState<any[]>([]);
  const [dispatches, setDispatches] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any | null>(null);

  // Modals
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Form State
  const [callerName, setCallerName] = useState('Rekha Bai (ASHA)');
  const [callerPhone, setCallerPhone] = useState('+91 98234 11204');
  const [locationName, setLocationName] = useState('Ward 4, Sinnar Village (H-42)');
  const [chiefComplaint, setChiefComplaint] = useState('Severe Bleeding & Labor Pain');
  const [urgency, setUrgency] = useState('EMERGENCY_CRITICAL');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [fleetRes, dispatchesRes, patientsRes] = await Promise.all([
        api.get('/emergency/fleet'),
        api.get('/emergency/dispatches'),
        api.get('/patients?size=50'),
      ]);
      setFleet(fleetRes || []);
      const dList = dispatchesRes || [];
      setDispatches(dList);
      if (dList.length > 0 && !selectedIncident) {
        setSelectedIncident(dList[0]);
      }
      setPatients(patientsRes?.items || []);
      if (fleetRes?.length > 0 && !selectedVehicleId) {
        setSelectedVehicleId(fleetRes[0].id);
      }
    } catch (err) {
      console.error('Failed to load emergency data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callerName || !callerPhone || !locationName || !chiefComplaint) {
      alert('Please fill all required details.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/emergency/dispatch', {
        caller_name: callerName,
        caller_phone: callerPhone,
        location_name: locationName,
        pickup_lat: 19.8458,
        pickup_lng: 73.9984,
        vehicle_id: selectedVehicleId || undefined,
        chief_complaint: chiefComplaint,
        urgency: urgency,
      });

      setIsDispatchModalOpen(false);
      setActionSuccessMsg(`Ambulance Dispatched! Vehicle is en-route (ETA: ${res.estimated_arrival_minutes || 8} mins).`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
      fetchData();
      setSelectedIncident(res);
    } catch (err) {
      console.error('Dispatch failed:', err);
      alert('Failed to dispatch ambulance.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeAmbulances = fleet.filter((f) => f.is_available).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* ─── TOAST NOTIFICATION ─── */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── 1. CLEAN TOP HEADER ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900">108 Emergency Ambulance</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quick dispatch & live ambulance tracking for Ward 4</p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="tel:108"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Call 108</span>
          </a>
          <button
            onClick={() => setIsDispatchModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
          >
            <Siren className="w-4 h-4" />
            <span>Dispatch Ambulance</span>
          </button>
        </div>
      </div>

      {/* ─── 2. SIMPLE, UNCLUTTERED STATS ─── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Active Pickups</span>
          <span className="text-2xl font-bold text-red-600 block mt-1">{dispatches.length}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Available Ambulances</span>
          <span className="text-2xl font-bold text-blue-600 block mt-1">{activeAmbulances} / {fleet.length}</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Nearest PHC Status</span>
          <span className="text-base font-bold text-emerald-700 block mt-1.5">Sinnar PHC (Ready)</span>
        </div>
      </div>

      {/* ─── 3. ACTIVE AMBULANCE PICKUPS (CLEAN LIST) ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Active Ambulance Runs ({dispatches.length})
          </h2>
          <button
            onClick={fetchData}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {dispatches.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">No active emergency calls</p>
            <p className="text-xs text-slate-400 mt-0.5">All local patients are stable.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dispatches.map((d) => {
              const isSelected = selectedIncident?.id === d.id;

              return (
                <div
                  key={d.id}
                  onClick={() => setSelectedIncident(d)}
                  className={`bg-white rounded-xl border p-4 sm:p-5 transition cursor-pointer ${
                    isSelected
                      ? 'border-red-500 ring-2 ring-red-500/10 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Patient & Complaint Details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{d.dispatch_number}</span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {d.urgency === 'EMERGENCY_CRITICAL' ? 'Critical Emergency' : 'Urgent'}
                        </span>
                      </div>

                      <p className="font-semibold text-slate-800 text-sm">
                        {d.chief_complaint}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{d.location_name}</span>
                        <span className="text-slate-300">·</span>
                        <span>Caller: {d.caller_name}</span>
                      </div>
                    </div>

                    {/* Ambulance & Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                      <div className="text-left sm:text-right mr-1">
                        <div className="flex items-center gap-1 font-bold text-sm text-blue-700">
                          <Truck className="w-4 h-4" />
                          <span>{d.assigned_vehicle?.registration_number || '108-ALS-01'}</span>
                        </div>
                        <span className="text-xs text-slate-500 block">
                          ETA {d.estimated_arrival_minutes || 8} mins
                        </span>
                      </div>

                      <a
                        href={`tel:${d.caller_phone || '108'}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Driver</span>
                      </a>
                    </div>

                  </div>

                  {/* Expanded Detail (Only when selected) */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/70 p-3.5 rounded-lg">
                      <div>
                        <span className="font-bold text-slate-500 uppercase block text-[10px] mb-1">En-Route Patient Vitals</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-medium text-slate-800">
                            SpO2: <strong className="text-red-600">{d.latest_vitals?.spo2_pct || 88}%</strong>
                          </span>
                          <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-medium text-slate-800">
                            BP: <strong className="text-red-600">{d.latest_vitals?.bp_systolic || 85}/{d.latest_vitals?.bp_diastolic || 50}</strong>
                          </span>
                          <span className="bg-white px-2.5 py-1 rounded border border-slate-200 font-medium text-slate-800">
                            Pulse: <strong>{d.latest_vitals?.pulse_bpm || 128} bpm</strong>
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-500 uppercase block text-[10px] mb-1">Receiving Facility</span>
                        <p className="font-semibold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Sinnar PHC Casualty (Room 102 - Doctor Alerted)</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── 4. DISPATCH 108 AMBULANCE MODAL (SIMPLE & FAST) ─── */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Siren className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-base text-slate-900">Dispatch 108 Ambulance</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Pickup House / Village Location</label>
                <input
                  type="text"
                  placeholder="e.g. Ward 4, House H-42, Sinnar"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Emergency Complaint</label>
                <input
                  type="text"
                  placeholder="e.g. Labor pains, severe bleeding, chest pain, high fever"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Caller / ASHA Name</label>
                  <input
                    type="text"
                    value={callerName}
                    onChange={(e) => setCallerName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-600 block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={callerPhone}
                    onChange={(e) => setCallerPhone(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Assign Nearest Ambulance</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none"
                >
                  {fleet.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registration_number} ({v.vehicle_type}) — Pilot: {v.driver_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm transition"
                >
                  {isSubmitting ? 'Dispatching...' : 'Confirm 108 Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmergencyDispatchPage;
