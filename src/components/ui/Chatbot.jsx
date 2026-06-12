import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles, Bot } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { AI_API_ENDPOINT } from "@/utils/data";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "assistant",
      content: "Hi there! 👋 I'm your AI Career Assistant. How can I help you with your job search today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isOpen]);

  // Don't show chatbot if not logged in
  if (!user) return null;

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message.trim() };
    setHistory(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${AI_API_ENDPOINT}/chat`,
        {
          message: userMessage.content,
          history: history.slice(-5) // Send last 5 messages for context
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setHistory(prev => [...prev, { role: "assistant", content: res.data.reply }]);
      }
    } catch (error) {
      setHistory(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#6A38C2] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AI Career Assistant</h3>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Online
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {history.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#6A38C2] text-white rounded-br-sm' 
                        : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && index > 0 && (
                      <Sparkles size={12} className="text-[#6A38C2] mb-1 inline mr-1" />
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 text-slate-700 shadow-sm p-4 rounded-2xl rounded-bl-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#6A38C2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-[#6A38C2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-[#6A38C2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about jobs, resume tips..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#6A38C2] focus:ring-1 focus:ring-[#6A38C2] transition-all"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="p-3 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
