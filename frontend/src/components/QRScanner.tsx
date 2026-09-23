import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";

export interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [manualCode, setManualCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = "arogya-qr-reader";

  useEffect(() => {
    let isMounted = true;
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          onScan(decodedText);
          scanner.stop().then(() => scanner.clear()).catch(() => {});
        },
        () => {}
      )
      .catch((_err) => {
        if (isMounted) {
          setErrorMsg("Unable to access camera or permission denied. Please enter ABHA code manually below.");
        }
      });

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
          } else {
            scannerRef.current.clear();
          }
        } catch {
          // Ignore scanner cleanup errors on unmount
        }
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col justify-between p-4">
      {/* Header */}
      <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Camera className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-base">Scan Patient ABHA Card</h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close QR Scanner"
          className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 flex flex-col items-center justify-center my-4">
        {errorMsg ? (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-2xl max-w-sm text-center text-xs space-y-1">
            <AlertCircle className="w-6 h-6 mx-auto text-red-400" />
            <p>{errorMsg}</p>
          </div>
        ) : (
          <div className="relative w-full max-w-xs">
            <div id={containerId} className="rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-2xl bg-black min-h-[240px]" />
            <p className="text-center text-white/70 text-xs mt-3">Align the QR code within the frame</p>
          </div>
        )}
      </div>

      {/* Manual Input Fallback */}
      <div className="max-w-md mx-auto w-full bg-slate-800/80 p-4 rounded-2xl border border-white/10 space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Or Enter 14-Digit ABHA ID Manually
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="e.g. 91-8472-9104-5821"
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-white text-xs font-mono outline-none focus:border-teal-400"
          />
          <button
            onClick={() => manualCode.trim() && onScan(manualCode.trim())}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
