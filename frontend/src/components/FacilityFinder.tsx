import React from "react";
import { MapPin, Phone, CheckCircle2 } from "lucide-react";

export interface FacilityItem {
  name: string;
  type: string;
  dist: string;
  genBeds: number;
  icuBeds: number;
  o2: string;
  phone: string;
}

export const FacilityFinder: React.FC = () => {
  const facilities: FacilityItem[] = [
    { name: "Sinnar Rural Primary Health Centre", type: "PHC", dist: "2.4 km", genBeds: 18, icuBeds: 4, o2: "Adequate", phone: "02551-220192" },
    { name: "Wavi Sub-Center Clinic", type: "Sub-Center", dist: "5.1 km", genBeds: 6, icuBeds: 0, o2: "Limited", phone: "02551-224810" },
    { name: "Nashik District Civil Hospital", type: "District Hospital", dist: "24.0 km", genBeds: 120, icuBeds: 28, o2: "Adequate", phone: "0253-2571234" }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">Nearby Health Facilities & Live Beds</h3>
          <p className="text-xs text-slate-400">Real-time availability across Taluka hierarchy</p>
        </div>
        <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
          Auto-Detected: Sinnar / Jaipur
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {facilities.map((fac, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 hover:border-blue-300 transition">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {fac.type}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{fac.name}</h4>
                <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{fac.dist} away</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block">General Beds</span>
                <span className="font-black text-slate-800">{fac.genBeds} Available</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">ICU Beds</span>
                <span className="font-black text-teal-700">{fac.icuBeds} Ready</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>O2: {fac.o2}</span>
              </span>
              <a
                href={`tel:${fac.phone}`}
                className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 hover:bg-blue-600 transition"
              >
                <Phone className="w-3 h-3" />
                <span>Call</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilityFinder;
