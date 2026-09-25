import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlaskConical,
  X,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  ShieldCheck,
  FileText,
  Activity,
  Droplets,
  Heart,
  Search,
  Download,
  QrCode
} from 'lucide-react';
import {
  PatientLabReport,
  getPatientLabReports
} from '../data/patientLabReports';

interface PatientLabReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: {
    id: string;
    name?: string;
    full_name?: string;
    abhaId?: string;
    abha_id?: string;
    age?: number;
    gender?: string;
    village?: string;
  } | null;
  allowOrderTests?: boolean;
}

export const PatientLabReportsModal: React.FC<PatientLabReportsModalProps> = ({
  isOpen,
  onClose,
  patient,
  allowOrderTests = true
}) => {
  const { t } = useTranslation();

  const patientName = patient?.full_name || patient?.name || "Patient";
  const patientAbha = patient?.abha_id || patient?.abhaId || "ABHA-XXXX-XXXX";
  const patientId = patient?.id || "P-001";

  // Initial reports for this patient
  const [reports, setReports] = useState<PatientLabReport[]>(() =>
    patient ? getPatientLabReports({ id: patientId, abhaId: patientAbha, name: patientName }) : []
  );

  const [selectedReportId, setSelectedReportId] = useState<string | null>(
    reports.length > 0 ? reports[0].id : null
  );

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedNewTest, setSelectedNewTest] = useState("Complete Blood Count (CBC)");
  const [orderUrgency, setOrderUrgency] = useState<"ROUTINE" | "URGENT">("ROUTINE");
  const [orderIndication, setOrderIndication] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // If patient prop updates, refresh reports
  React.useEffect(() => {
    if (patient) {
      const pReports = getPatientLabReports({
        id: patient.id,
        abhaId: patient.abha_id || patient.abhaId,
        name: patient.full_name || patient.name
      });
      setReports(pReports);
      if (pReports.length > 0) {
        setSelectedReportId(pReports[0].id);
      }
    }
  }, [patient]);

  if (!isOpen || !patient) return null;

  const currentReport = reports.find(r => r.id === selectedReportId) || reports[0];

  const handleOrderTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: PatientLabReport = {
      id: `REP-${Date.now()}`,
      reportNumber: `LAB-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: patient.id,
      patientName: patientName,
      abhaId: patientAbha,
      testName: selectedNewTest,
      category: selectedNewTest.includes("Blood") || selectedNewTest.includes("CBC") ? "HEMATOLOGY" : "BIOCHEMISTRY",
      sampleType: "Sample Ordered / Pending Phlebotomy",
      collectedAt: "Sample Scheduled at PHC Lab",
      verifiedAt: "Awaiting Lab Analysis",
      facility: "Sinnar PHC Pathology Unit",
      technicianName: "Phlebotomist Duty Officer",
      pathologistName: "Pathologist On-Duty",
      status: "ORDERED",
      overallStatus: orderUrgency === "URGENT" ? "CRITICAL" : "NORMAL",
      clinicalNotes: orderIndication || "Test requisition placed by attending medical officer.",
      parameters: [
        {
          name: `${selectedNewTest} (Specimen Queue)`,
          value: "Sample Pending Collection",
          unit: "Status",
          referenceRange: "Pending",
          status: "NORMAL"
        }
      ]
    };

    setReports([newReport, ...reports]);
    setSelectedReportId(newReport.id);
    setShowOrderModal(false);
    setOrderIndication("");
    setSuccessToast(`✓ Lab Order for "${selectedNewTest}" dispatched to PHC Diagnostic Center!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">
                  {patientName}
                </h2>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-400/30">
                  {reports.length} {reports.length === 1 ? 'Report' : 'Reports'} Available
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                ABHA: <strong className="text-white">{patientAbha}</strong>
                {patient.age ? ` • ${patient.age}y` : ''}
                {patient.gender ? ` • ${patient.gender}` : ''}
                {patient.village ? ` • ${patient.village}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {allowOrderTests && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Order New Test</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Main Workspace: Left Reports List, Right Report Detail */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Reports Sidebar / Tab Strip */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/60 p-3 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Diagnostic Dossier
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                ABDM Verified
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No diagnostic test reports on file for this patient.
              </div>
            ) : (
              reports.map((rep) => {
                const isSelected = rep.id === currentReport?.id;
                return (
                  <div
                    key={rep.id}
                    onClick={() => setSelectedReportId(rep.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                      isSelected
                        ? "bg-white border-teal-500 shadow-sm ring-1 ring-teal-500/20"
                        : "bg-white/80 border-slate-200/80 hover:bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <span className="font-semibold text-xs text-slate-900 line-clamp-1">
                        {rep.testName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          rep.overallStatus === "CRITICAL"
                            ? "bg-red-100 text-red-700 animate-pulse"
                            : rep.overallStatus === "ABNORMAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {rep.status === 'ORDERED' ? 'ORDERED' : rep.overallStatus}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="font-mono">{rep.reportNumber}</span>
                      <span>{rep.collectedAt.split(',')[0]}</span>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-teal-700 font-medium bg-teal-50 px-1.5 py-0.2 rounded">
                        {rep.category}
                      </span>
                      <span className="text-slate-400">
                        {rep.parameters.length} {rep.parameters.length === 1 ? 'metric' : 'metrics'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Report Detailed View */}
          <div className="md:col-span-8 p-4 sm:p-5 overflow-y-auto bg-white flex flex-col justify-between space-y-4">
            {currentReport ? (
              <div className="space-y-4">
                {/* Official Lab Certificate Header */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                        {currentReport.reportNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        {currentReport.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {currentReport.testName}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {currentReport.facility} • Specimen: <strong>{currentReport.sampleType}</strong>
                    </p>
                  </div>

                  <div className="text-right text-[11px]">
                    <span className="text-slate-400 block">Verification Date</span>
                    <strong className="text-slate-800">{currentReport.verifiedAt}</strong>
                    <div className="flex items-center space-x-1 text-emerald-600 font-semibold justify-end mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ABDM Certified</span>
                    </div>
                  </div>
                </div>

                {/* Parameters Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-200">
                        <th className="py-2.5 px-3">Test Investigation / Parameter</th>
                        <th className="py-2.5 px-3">Observed Value</th>
                        <th className="py-2.5 px-3">Reference Interval</th>
                        <th className="py-2.5 px-3 text-right">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentReport.parameters.map((param, pIdx) => {
                        const isAbnormal = param.status === "HIGH" || param.status === "LOW" || param.status === "CRITICAL";
                        return (
                          <tr key={pIdx} className={isAbnormal ? "bg-amber-50/30" : ""}>
                            <td className="py-2.5 px-3 font-medium text-slate-800">
                              {param.name}
                            </td>
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <span className={`font-bold font-mono text-xs ${
                                param.status === 'CRITICAL'
                                  ? 'text-red-700 bg-red-50 px-1.5 py-0.5 rounded'
                                  : param.status === 'HIGH' || param.status === 'LOW'
                                  ? 'text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded'
                                  : 'text-slate-900'
                              }`}>
                                {param.value} {param.unit}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                              {param.referenceRange} {param.unit !== 'Status' && param.unit !== '%' ? param.unit : ''}
                            </td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                param.status === 'CRITICAL'
                                  ? 'bg-red-100 text-red-700'
                                  : param.status === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800'
                                  : param.status === 'LOW'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {param.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pathologist Notes & Signatures */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Clinical Impression & Remarks
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {currentReport.clinicalNotes || "No specific pathological remarks noted."}
                  </p>
                  
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <div>
                      <span>Logged By: </span>
                      <strong className="text-slate-700">{currentReport.technicianName}</strong>
                    </div>
                    <div>
                      <span>Authorized Signatory: </span>
                      <strong className="text-teal-800 font-semibold">{currentReport.pathologistName}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Print and Export Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <QrCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Scan QR for ABDM Health Record Digitally Signed FHIR JSON</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>

                <button
                  onClick={() => alert(`ABDM FHIR DiagnosticReport JSON downloaded for ${currentReport?.reportNumber}`)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF / FHIR</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER NEW LAB TEST MODAL POPUP */}
        {showOrderModal && (
          <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 bg-blue-700 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FlaskConical className="w-4 h-4 text-cyan-200" />
                  <h3 className="font-bold text-sm">Order Lab Investigation</h3>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="text-blue-200 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleOrderTestSubmit} className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Select Test from Essential Diagnostics List (EDL)
                  </label>
                  <select
                    value={selectedNewTest}
                    onChange={(e) => setSelectedNewTest(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC with Platelets)</option>
                    <option value="Fasting & Postprandial Blood Glucose">Fasting & Postprandial Blood Glucose</option>
                    <option value="Glycated Hemoglobin (HbA1c)">Glycated Hemoglobin (HbA1c)</option>
                    <option value="Lipid Profile Comprehensive">Lipid Profile Comprehensive (Cholesterol, Triglycerides, HDL, LDL)</option>
                    <option value="Renal Function Test (KFT / Creatinine + BUN)">Renal Function Test (Creatinine, BUN, Electrolytes)</option>
                    <option value="Liver Function Test (LFT / Bilirubin, SGOT, SGPT)">Liver Function Test (Bilirubin, SGOT, SGPT, ALP)</option>
                    <option value="Cardiac Troponin T High Sensitivity">Cardiac Troponin T High Sensitivity (hs-cTnT)</option>
                    <option value="Malaria Antigen RDT (Pv & Pf)">Malaria Antigen RDT (Pv & Pf)</option>
                    <option value="Dengue NS1 Antigen & IgM">Dengue NS1 Antigen & IgM</option>
                    <option value="Routine Urine Analysis (Microscopy & Albumin)">Routine Urine Analysis (Microscopy & Albumin)</option>
                    <option value="Thyroid Profile (T3, T4, TSH)">Thyroid Profile (T3, T4, TSH)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Clinical Priority
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderUrgency("ROUTINE")}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        orderUrgency === "ROUTINE"
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      Routine OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderUrgency("URGENT")}
                      className={`py-1.5 text-xs font-semibold rounded-lg border transition cursor-pointer ${
                        orderUrgency === "URGENT"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                      }`}
                    >
                      Stat / Urgent
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Clinical Indication / Diagnosis
                  </label>
                  <textarea
                    rows={2}
                    value={orderIndication}
                    onChange={(e) => setOrderIndication(e.target.value)}
                    placeholder="e.g. Chest pain evaluation, fever workup, glycemic control assessment..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowOrderModal(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    Confirm & Send Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
