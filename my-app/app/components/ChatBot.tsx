import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { X, Send, MessageCircle, Mic, Zap } from "lucide-react";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "⚡ Hello! I'm your EV Charging Station AI Assistant. I can help you understand our intelligent infrastructure, agent decisions, ML predictions, and system operations. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load voices
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // Speech recognition (English only)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition)
      return console.warn("Speech recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      recognition.stop();
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (!recognitionRef.current)
      return alert("Speech recognition not supported in this browser.");
    setListening(true);
    recognitionRef.current.start();
  };

  const getVoiceForLang = () => {
    if (!voices.length) return null;
    return (
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith("en") &&
          v.name.toLowerCase().includes("india")
      ) ||
      voices.find((v) => v.lang.toLowerCase().startsWith("en")) ||
      null
    );
  };

  const speakText = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForLang() || voices[0];
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const botReply = data.reply || "No reply from EV Station Assistant.";

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
        speakText(botReply);
      }, 700);
    } catch {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ Unable to connect to EV Station Assistant. Please check your connection.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg flex items-center justify-center text-white z-50 hover:shadow-2xl"
          >
            <Zap size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-0 right-0 h-[80vh] w-[420px] bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-indigo-900/95 backdrop-blur-2xl border border-blue-500/20 rounded-l-3xl shadow-2xl flex flex-col z-40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Zap size={24} className="text-yellow-300" />
                <div>
                  <h3 className="font-semibold text-lg tracking-wide">
                    EV Station AI
                  </h3>
                  <p className="text-xs text-blue-100 opacity-80">
                    Intelligent Infrastructure Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-800/50 p-2 rounded-lg transition"
                aria-label="Close ChatBot"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-blue-500/40">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "ml-auto bg-blue-600/60 border border-blue-400/30 text-white shadow-sm"
                      : "bg-slate-800/60 border border-blue-300/20 text-blue-100 shadow-sm"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <ReactMarkdown className="prose prose-invert prose-sm max-w-none">
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-blue-200 text-sm px-4 py-3 bg-slate-800/40 border border-blue-400/20 rounded-2xl w-fit">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="ml-2">AI is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="p-4 border-t border-blue-400/20 bg-slate-900/70 flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className={`p-3 rounded-full transition-all ${
                  listening
                    ? "bg-red-600 text-white shadow-lg animate-pulse"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                aria-label="Start voice input"
              >
                <Mic size={18} />
              </motion.button>

              <input
                type="text"
                className="flex-1 px-4 py-3 bg-slate-800/60 text-white rounded-xl border border-blue-400/20 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-blue-200/60"
                placeholder="Ask about agents, ML predictions, system status..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full text-white hover:shadow-lg transition-all"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 10px;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background-color: rgba(96, 165, 250, 0.8);
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%,
          80%,
          100% {
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}