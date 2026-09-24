import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Lock } from "lucide-react";

export interface DigitalIDCardProps {
  user: {
    name: string;
    qrId: string;
    age: number;
    gender: string;
    village: string;
    phone: string;
  };
}

export const DigitalIDCard: React.FC<DigitalIDCardProps> = ({ user }) => {
  return (
    <div className="bg-white w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs transition hover:shadow-md">
      {/* Subtle National Tricolor Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF9933] via-slate-200 to-[#138808]" />

      <div className="p-4 sm:p-5 flex flex-col justify-between space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
              🇮🇳
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xs tracking-tight">Ayushman Bharat Health Account</h3>
              <p className="text-[9px] text-slate-400 font-medium">National Health Authority</p>
            </div>
          </div>
          <span className="inline-flex items-center text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />
            Verified
          </span>
        </div>

        {/* Card Body */}
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-900 leading-tight">{user.name}</p>
            <p className="text-[11px] text-slate-500">
              {user.gender} • {user.age} yrs • {user.village}
            </p>
            <div className="pt-1">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                ABHA: {user.qrId}
              </span>
            </div>
          </div>

          <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs shrink-0">
            <QRCodeSVG value={`https://abdm.gov.in/verify?abha=${user.qrId}`} size={64} level="H" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10px] text-slate-400">
          <span>Helpline: 108 / 102</span>
          <span className="inline-flex items-center font-mono text-[9px]">
            <Lock className="w-2.5 h-2.5 mr-0.5 text-emerald-500" />
            ABDM SECURED
          </span>
        </div>
      </div>
    </div>
  );
};

export default DigitalIDCard;
