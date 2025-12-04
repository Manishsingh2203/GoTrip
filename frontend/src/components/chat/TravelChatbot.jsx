// src/components/chat/TravelChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Loader2,
  Plane,
  Hotel,
  MapPin,
  Calendar,
  Bot, // Changed MessageCircle to Bot
  MoreVertical,
  ThumbsUp
} from "lucide-react";
import { aiChatAPI } from "../../services/aiChatAPI";

const typewriterTexts = [
  "What are you looking for?",
  "Where do you want to go?",
  "Plan your perfect trip...",
  "Ask anything about travel!",
  "Find cheap flights to Goa",
  "Best hotels in Mumbai"
];

const quickQuestions = [
  { text: "Plan a 3-day trip", icon: Calendar },
  { text: "Best hotels nearby", icon: Hotel },
  { text: "Cheap flights", icon: Plane },
  { text: "Top attractions", icon: MapPin },
];

// CSS Animations
const ChatbotStyles = () => (
  <style>{`
    @keyframes float-robot {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      25% { transform: translateY(-4px) rotate(-5deg); }
      75% { transform: translateY(2px) rotate(5deg); }
    }
    .animate-robot {
      animation: float-robot 3s ease-in-out infinite;
    }

    @keyframes gradient-xy {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .animate-gradient-border {
      background-size: 200% 200%;
      animation: gradient-xy 3s ease infinite;
    }

    @keyframes fadeInScale {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-enter {
      animation: fadeInScale 0.3s ease-out forwards;
    }
    
    /* Custom Scrollbar for chat */
    .chat-scroll::-webkit-scrollbar {
      width: 5px;
    }
    .chat-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .chat-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 10px;
    }
    .chat-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `}</style>
);

const TravelChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Typewriter State
  const [twIndex, setTwIndex] = useState(0);
  const [twText, setTwText] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hi there! I'm chalo your AI Travel Buddy 🤖. Where are you planning to go?",
      createdAt: new Date().toISOString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Typewriter Logic
  useEffect(() => {
    if (isOpen) return;

    let i = 0;
    const text = typewriterTexts[twIndex];
    const interval = setInterval(() => {
      setTwText(text.slice(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setTwIndex((twIndex + 1) % typewriterTexts.length);
        }, 1500);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [twIndex, isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Simulation of API call - Replace with your actual API logic
      const res = await aiChatAPI.ask(trimmed, { source: "home-chatbot" });
      const aiText = res.data?.data || res.data?.message || "I can help you plan that trip! Tell me more about your budget.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiText,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, sender: "ai", text: "Oops, my circuits got tangled. Try again!", createdAt: new Date() }
      ]);
    }
    setLoading(false);
  };

  const handleQuickQuestion = (txt) => {
    setInput(txt);
    setTimeout(() => {
        // Optional: Auto send on click
        inputRef.current?.focus();
    }, 100);
  }

  // MINIMIZED STATE (Small Bubble)
  if (isMinimized) {
    return (
      <>
        <ChatbotStyles />
        <div className="fixed bottom-6 right-6 z-50 animate-enter">
           <div className="p-[2px] rounded-full bg-gradient-to-r from-[#0CA9A5] via-[#a880ff] to-[#FF7A32] shadow-xl animate-gradient-border">
              <button
                onClick={() => setIsMinimized(false)}
                className="bg-white text-gray-800 p-3 rounded-full hover:scale-105 transition shadow-sm"
              >
                 <Bot className="h-6 w-6 text-[#005CFF] animate-robot" />
              </button>
           </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ChatbotStyles />

      {/* =============================================
          1. TRIGGER BUTTON (Fixed Size, Sleek, Robot)
          ============================================= */}
      {!isOpen && (
        <div 
            className="fixed bottom-6 right-6 z-50 cursor-pointer group animate-enter"
            onClick={() => setIsOpen(true)}
        >
          {/* Gradient Border Wrapper */}
          <div className="p-[2px] rounded-full bg-gradient-to-r from-[#0CA9A5] via-[#a880ff] to-[#FF7A32] shadow-2xl animate-gradient-border group-hover:scale-[1.02]">
            
            {/* Main Content Box - FIXED SIZE SET HERE */}
            <div className="bg-white rounded-full w-[300px] h-14 flex items-center pl-2 pr-5 relative overflow-hidden transition-transform g">
              
              {/* Robot Icon Container */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2 rounded-full mr-3 shrink-0 border border-blue-100 shadow-sm">
                <Bot className="h-6 w-6 text-[#005CFF] animate-robot" />
              </div>

              {/* Text Container - With Truncate */}
              <div className="flex flex-col justify-center overflow-hidden flex-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-[1px]">
                  AI Assistant
                </span>
                
                {/* Typewriter Text - Truncated */}
                <div className="flex items-center">
                   <p className="text-sm font-semibold text-gray-800 truncate">
                     {twText}
                   </p>
                   <span className="w-1.5 h-4 bg-[#FF7A32] ml-1 animate-pulse shrink-0"></span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =============================================
          2. IMPROVED INTERIOR UI (Chat Window)
          ============================================= */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-enter border border-white/20 font-sans">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#003EB5] via-[#005CFF] to-[#0075FF] px-5 py-4 shrink-0 shadow-md relative overflow-hidden">
             {/* Decorative Circles */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
             
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                     <Bot className="h-6 w-6 text-white animate-robot" />
                  </div>
                  <div className="text-white">
                    <h3 className="font-bold text-lg leading-tight">Chalo AI</h3>
                    <div className="flex items-center gap-1.5 opacity-90">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="text-xs font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                   <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/20 rounded-full transition text-white">
                      <span className="text-xl font-bold leading-none">-</span>
                   </button>
                   <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition text-white">
                      <X className="h-5 w-5" />
                   </button>
                </div>
             </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f0f2f5] chat-scroll relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-center">
                 <span className="text-[10px] text-gray-400 bg-gray-200/50 px-3 py-1 rounded-full">Today</span>
              </div>

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Sender Avatar for AI */}
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#003EB5] to-[#005CFF] flex items-center justify-center mr-2 mt-1 shrink-0">
                       <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[80%] px-4 py-3 shadow-sm text-sm leading-relaxed relative group
                      ${msg.sender === "user"
                          ? "bg-[#005CFF] text-white rounded-2xl rounded-tr-none"
                          : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
                      }
                    `}
                  >
                    {msg.text}
                    <span className={`text-[9px] absolute bottom-1 right-3 opacity-60 ${msg.sender === 'user' ? 'text-white' : 'text-gray-400'}`}>
                       {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}

              {loading && (
                 <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-1">
                       <Bot className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                 </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* SUGGESTIONS AREA (If few messages) */}
          {messages.length < 3 && !loading && (
            <div className="px-4 pb-2 bg-[#f0f2f5]">
               <p className="text-xs text-gray-500 mb-2 font-medium ml-1">Suggested for you:</p>
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {quickQuestions.map((q, i) => {
                     const Icon = q.icon;
                     return (
                        <button 
                           key={i} 
                           onClick={() => handleQuickQuestion(q.text)}
                           className="flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-2 rounded-xl text-xs whitespace-nowrap hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors shadow-sm"
                        >
                           <Icon className="h-3 w-3" />
                           {q.text}
                        </button>
                     )
                  })}
               </div>
            </div>
          )}

          {/* INPUT AREA */}
          <div className="bg-white p-3 border-t border-gray-100">
             <form onSubmit={handleSend} className="relative flex items-center gap-2">
                <input
                   ref={inputRef}
                   type="text"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder="Type your question..."
                   className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white border border-transparent focus:border-blue-200 transition-all placeholder-gray-400"
                />
                <button
                   type="submit"
                   disabled={!input.trim() || loading}
                   className="bg-[#005CFF] text-white p-3 rounded-full hover:bg-[#004ecb] shadow-lg disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95 flex items-center justify-center"
                >
                   {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                </button>
             </form>
             <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">Powered by GoTrip AI</p>
             </div>
          </div>

        </div>
      )}
    </>
  );
};

export default TravelChatbot;