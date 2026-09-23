import React from "react";
import { QRCodeSVG } from "qrcode.react";

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
    <div className="bg-white w-full aspect-[1.58] rounded-2xl overflow-hidden relative shadow-xl border border-slate-200 print:shadow-none print:w-[3.5in] print:h-[2.2in]">
      {/* Background Watermark Pattern */}
      <div className="absolute inset-0 bg-[#f8fafc]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-bl-[100px]" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-100/40 rounded-tr-[100px]" />
      </div>

      <div className="relative z-10 p-5 h-full flex flex-col justify-between">
        {/* Header with National Health Mission styling */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-xs">
              NHM
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-xs tracking-tight">Ayushman Digital Health Record</h3>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Ministry of Health & Family Welfare</p>
            </div>
          </div>
          <span className="text-[8px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            ABDM VERIFIED
          </span>
        </div>

        {/* Card Body */}
        <div className="flex items-center justify-between my-1">
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-slate-900 leading-tight">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-semibold">
              {user.gender} • {user.age} yrs • Village: {user.village}
            </p>
            <p className="text-[10px] font-mono font-bold text-blue-700 tracking-wide pt-1">
              ABHA: {user.qrId}
            </p>
          </div>

          <div className="bg-white p-1.5 rounded-xl shadow-xs border border-slate-100">
            <QRCodeSVG value={user.qrId} size={65} level="H" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/60 pt-2 flex justify-between items-center text-[8px] text-slate-400 font-semibold">
          <span>Emergency Helpline: 108 / 102</span>
          <span className="font-mono">ABHA-RURAL-MH</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalIDCard;
