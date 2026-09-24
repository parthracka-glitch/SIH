import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertOctagon,
  RotateCcw,
  ShieldCheck,
  PhoneCall,
  Activity,
  Heart,
  ChevronLeft,
  ArrowLeft,
  Minimize2
} from "lucide-react";
import { ruralTriageEngine, TriageResult } from "../lib/ruralTriageEngine";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  triage?: TriageResult;
  isEmergency?: boolean;
}

export const AIAgentChatbot: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "agent",
      text: "Namaste! I am Arogya Mitra AI Clinical Assistant. You can tell me your symptoms in Hindi, English or Marathi. (नमस्ते! आप अपने लक्षण या बीमारी के बारे में बता सकते हैं। आपको तुरंत घरेलू नुस्खे और प्राथमिक सलाह मिलेगी।)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [quickOptions, setQuickOptions] = useState<string[]>([
    "मुझे बुखार है",
    "दस्त और पेट खराब है",
    "खांसी और जुकाम है",
    "एसिडिटी व गैस है",
    "सिर में बहुत दर्द है"
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Global trigger listener & Escape key listener
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("arogya_open_voice_ai", handleOpen);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("arogya_open_voice_ai", handleOpen);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = i18n.language === "mr" ? "mr-IN" : i18n.language === "hi" ? "hi-IN" : "en-IN";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          // auto trigger triage on voice input
          processSymptomInput(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your symptoms.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const speakReply = (text: string) => {
    if (!voiceOn || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown stars/bullets for smooth voice reading
      const cleanVoiceText = text
        .replace(/[*#•]/g, "")
        .replace(/\n+/g, ". ")
        .slice(0, 300); // Read concise summary
      const utterance = new SpeechSynthesisUtterance(cleanVoiceText);
      utterance.lang = /[\u0900-\u097F]/.test(cleanVoiceText) ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  };

  const processSymptomInput = (symptomText: string) => {
    if (!symptomText.trim()) return;
    const userMsg = symptomText.trim();
    setInput("");

    // 1. Add User Message
    const userMsgObj: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userMsg
    };

    setMessages((prev) => [...prev, userMsgObj]);

    // 2. Evaluate using AI Clinical NLP Engine
    setTimeout(() => {
      const activeLang = (i18n.language as "en" | "hi" | "mr") || "hi";
      const triageResult = ruralTriageEngine.evaluate(userMsg, activeLang);

      if (triageResult.isEmergency) {
        setEmergencyActive(true);
      }

      if (triageResult.quickReplies && triageResult.quickReplies.length > 0) {
        setQuickOptions(triageResult.quickReplies);
      }

      const agentMsgObj: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: triageResult.formattedReply,
        triage: triageResult,
        isEmergency: triageResult.isEmergency
      };

      setMessages((prev) => [...prev, agentMsgObj]);
      speakReply(triageResult.explanationHindi || triageResult.explanationEnglish);
    }, 400);
  };

  const handleSend = () => {
    processSymptomInput(input);
  };

  const handleReset = () => {
    ruralTriageEngine.reset();
    setEmergencyActive(false);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "agent",
        text: "New consultation started. Please describe your health symptoms. (नया परामर्श शुरू हुआ। कृपया अपनी परेशानी या लक्षण बताएं।)"
      }
    ]);
    setQuickOptions([
      "मुझे बुखार है",
      "दस्त और पेट खराब है",
      "खांसी और जुकाम है",
      "एसिडिटी व गैस है",
      "सिर में बहुत दर्द है"
    ]);
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 via-blue-800 to-teal-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 border-2 border-white/40 cursor-pointer group"
        aria-label="Open AI Clinical Doctor Chatbot"
      >
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        <span className="font-extrabold text-xs sm:text-sm tracking-tight pr-1 hidden sm:inline">
          {isOpen ? "Close AI Doctor" : "AI Doctor & Remedies"}
        </span>
      </button>

      {/* 2. Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-3 right-2 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[450px] h-[82vh] max-h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 font-sans">
          {/* Header with Prominent Back / Cancel Button */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 px-3.5 py-3 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-white/15 hover:bg-white/25 active:scale-95 text-white px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 border border-white/20 cursor-pointer shadow-xs"
                title="Back / Close Chat (वापस / बंद करें)"
                aria-label="Back / Close Chat"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="pl-1">
                <h3 className="font-extrabold text-xs sm:text-sm tracking-tight flex items-center space-x-1.5">
                  <span>Arogya AI Navigator</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] text-blue-200 leading-tight">
                  Triage & Safe Home Remedies (घरेलू उपचार)
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-white/20 rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
                title="Reset Symptoms / नया परामर्श"
                aria-label="Reset Symptoms"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setVoiceOn(!voiceOn)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
                title={voiceOn ? "Mute Voice" : "Enable Voice"}
                aria-label={voiceOn ? "Mute Voice" : "Enable Voice"}
              >
                {voiceOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-300" /> : <VolumeX className="w-3.5 h-3.5 text-rose-300" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg text-slate-200 hover:text-white transition cursor-pointer"
                title="Close / Cancel"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Emergency Alert Banner with Dismiss Action */}
          {emergencyActive && (
            <div className="bg-red-600 text-white px-3.5 py-2 flex items-center justify-between text-xs font-bold animate-pulse">
              <span className="flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 shrink-0 text-yellow-300" />
                <span className="text-[11px]">Emergency Warning</span>
              </span>
              <div className="flex items-center space-x-1.5">
                <a
                  href="tel:108"
                  className="bg-white text-red-700 px-2.5 py-0.5 rounded-lg text-[11px] font-black hover:bg-red-50 transition shadow"
                >
                  Call 108
                </a>
                <button
                  onClick={() => setEmergencyActive(false)}
                  className="p-1 rounded text-white/80 hover:text-white hover:bg-red-700 transition cursor-pointer"
                  title="Dismiss Emergency Alert / बंद करें"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#F8FAFC]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "user" ? (
                  <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-br-xs px-4 py-2.5 text-xs font-medium shadow-xs">
                    {m.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[92%] rounded-2xl rounded-bl-xs p-3.5 text-xs font-normal shadow-xs border ${
                      m.isEmergency
                        ? "bg-red-50 border-red-200 text-red-950"
                        : "bg-white border-slate-200 text-slate-800"
                    }`}
                  >
                    {m.triage ? (
                      <div className="space-y-2.5">
                        {/* Condition Badge & Triage Tier */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                              {m.triage.conditionHindi || m.triage.suspectedCondition}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {m.triage.suspectedCondition}
                            </span>
                          </div>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                              m.triage.triageLevel === "CRITICAL_108"
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : m.triage.triageLevel === "URGENT"
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                          >
                            {m.triage.triageLevel.replace("_", " ")}
                          </span>
                        </div>

                        {/* Explanation */}
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {m.triage.explanationHindi || m.triage.explanationEnglish}
                        </p>

                        {/* Home Remedies Section (घरेलू नुस्खे) */}
                        {m.triage.homeRemediesHindi && m.triage.homeRemediesHindi.length > 0 && (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 space-y-1.5">
                            <div className="flex items-center space-x-1.5 text-emerald-800 font-bold text-xs">
                              <span className="text-sm">🌿</span>
                              <span>घरेलू उपाय / Home Remedies:</span>
                            </div>
                            <ul className="space-y-1 pl-1">
                              {m.triage.homeRemediesHindi.map((remedy, idx) => (
                                <li key={idx} className="text-emerald-950 text-[11px] leading-relaxed flex items-start space-x-1.5">
                                  <span className="text-emerald-600 font-bold mt-0.5">•</span>
                                  <span>{remedy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Safe First Aid & OTC Guidance */}
                        {m.triage.safeFirstAid && m.triage.safeFirstAid.length > 0 && (
                          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 space-y-1">
                            <div className="flex items-center space-x-1.5 text-blue-900 font-bold text-[11px]">
                              <span>💊</span>
                              <span>प्राथमिक सलाह / Safe First Aid:</span>
                            </div>
                            <ul className="space-y-1 pl-1">
                              {m.triage.safeFirstAid.map((aid, idx) => (
                                <li key={idx} className="text-slate-700 text-[11px] leading-relaxed flex items-start space-x-1.5">
                                  <span className="text-blue-500 font-bold">•</span>
                                  <span>{aid}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Red Flags / Emergency Hospital Warning */}
                        {m.triage.redFlags && m.triage.redFlags.length > 0 && (
                          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2 text-[11px] text-amber-900 space-y-1">
                            <div className="font-bold flex items-center space-x-1">
                              <span>⚠️</span>
                              <span>चेतावनी (डॉक्टर को कब दिखाएं):</span>
                            </div>
                            <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-amber-800">
                              {m.triage.redFlags.map((flag, idx) => (
                                <li key={idx}>{flag}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="px-3 py-2 bg-slate-100/90 border-t border-slate-200 overflow-x-auto flex items-center space-x-2 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0">
              सुझाव:
            </span>
            {quickOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => processSymptomInput(opt)}
                className="bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-full px-2.5 py-1 text-[11px] font-medium whitespace-nowrap shadow-2xs transition cursor-pointer shrink-0"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-full transition cursor-pointer ${
                isListening
                  ? "bg-red-500 text-white animate-bounce shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              aria-label={isListening ? "Stop listening" : "Speak in Hindi/English"}
              title="Speak in Hindi/English (माइक से बोलें)"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="लक्षण बताएं (e.g. बुखार, दस्त, खांसी, सिर दर्द)..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-transparent transition"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-full transition shadow-md cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgentChatbot;
