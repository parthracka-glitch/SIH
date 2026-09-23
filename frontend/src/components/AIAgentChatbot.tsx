import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertOctagon,
} from "lucide-react";

export const AIAgentChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "user" | "agent"; text: string; isEmergency?: boolean }>>([
    {
      sender: "agent",
      text: "Namaste! I am Arogya Mitra AI. You can speak in Hindi or English about your health symptoms. (नमस्ते! आप अपनी बीमारी या दर्द के बारे में बता सकते हैं।)"
    }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceOn, setVoiceOn] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Global trigger listener
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("arogya_open_voice_ai", handleOpen);
    return () => window.removeEventListener("arogya_open_voice_ai", handleOpen);
  }, []);

  // Web Speech API for voice input
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "hi-IN";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
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
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please type your symptoms.");
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = /[\u0900-\u097F]/.test(text) ? "hi-IN" : "en-IN";
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore audio synthesis errors
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");

    setMessages((prev) => [...prev, { sender: "user", text }]);

    // Simulated medical triage evaluation
    setTimeout(() => {
      const isRedFlag = /chest|heart|breath|seene|sans|khoon|attack|bleed|dard|pain|faint/i.test(text);
      const reply = isRedFlag
        ? "ALERT: Symptoms indicate possible acute cardiovascular or respiratory distress. Please remain seated and dial 108 immediately. Nearest PHC alerted. (चेतावनी: यह आपातकालीन स्थिति हो सकती है। कृपया तुरंत 108 डायल करें।)"
        : "I have recorded your symptoms. Recommended department: General OPD. Drink plenty of warm fluids and consult your village ASHA worker or Sinnar PHC.";

      if (isRedFlag) setEmergencyActive(true);
      setMessages((prev) => [...prev, { sender: "agent", text: reply, isEmergency: isRedFlag }]);
      speakReply(reply);
    }, 600);
  };

  return (
    <>
      {/* 1. Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-700 to-teal-600 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center space-x-2 border-2 border-white/40 cursor-pointer"
        aria-label="Open AI Doctor Chatbot"
      >
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: "6s" }} />
        <span className="font-extrabold text-sm hidden sm:inline">AI Doctor</span>
      </button>

      {/* 2. Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-8 z-50 w-[95vw] sm:w-[420px] h-[550px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-black text-sm">Arogya AI Clinical Navigator</h3>
                <p className="text-[10px] text-teal-100">Bilingual Voice & Text Triage</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setVoiceOn(!voiceOn)}
                className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer"
                aria-label={voiceOn ? "Mute Voice" : "Enable Voice"}
              >
                {voiceOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-300" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Emergency Alert Bar */}
          {emergencyActive && (
            <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center space-x-1">
                <AlertOctagon className="w-4 h-4 mr-1" />
                Emergency Escalation
              </span>
              <a href="tel:108" className="bg-white text-red-700 px-2.5 py-1 rounded-md text-[11px] font-black">
                Call 108
              </a>
            </div>
          )}

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed ${
                  m.sender === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : m.isEmergency
                    ? "bg-red-100 text-red-900 border border-red-300"
                    : "bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-none"
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Controls */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <button
              onClick={toggleListening}
              className={`p-2.5 rounded-full transition cursor-pointer ${
                isListening ? "bg-red-500 text-white animate-bounce" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              aria-label={isListening ? "Stop listening" : "Start speaking"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Describe symptoms in Hindi or English..."
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full transition shadow cursor-pointer"
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
