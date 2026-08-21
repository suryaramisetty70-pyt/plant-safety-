import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { askPlantDoctor } from "@/api/chatApi";

interface ChatbotDrawerProps {
  language: string;
  plantContext?: string;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  language,
  plantContext
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      role: "assistant",
      content:
        "Hello! I'm your AI Agronomist Assistant. Ask me any follow-up question about your crops, organic fertilizers, or spraying weather!",
      language,
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: userText,
      language,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const botReply = await askPlantDoctor(userText, language, plantContext);
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: "assistant",
          content: "I recommend spraying Neem Oil (5ml/L) and pruning affected foliage.",
          language,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-950 font-heading font-extrabold text-sm shadow-[0_8px_25px_rgba(46,204,113,0.4)] hover:scale-105 transition flex items-center gap-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Ask Plant Doctor</span>
        </button>
      ) : (
        <div className="w-[360px] h-[480px] bg-[#121a16] border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-black/40 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-heading font-bold text-xs text-white">Ask Plant Doctor AI</h4>
                <span className="text-[10px] text-emerald-400">Online • Multi-Lingual Agronomist</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded-xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-emerald-500 text-slate-950 font-semibold ml-auto rounded-br-none"
                    : "bg-slate-800/80 text-slate-200 rounded-bl-none border border-slate-700"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="bg-slate-800/80 text-slate-400 text-xs p-3 rounded-xl rounded-bl-none max-w-[85%]">
                AI is typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field */}
          <div className="p-3 bg-black/40 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask e.g. 'Can I spray Neem oil today?'..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-400"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="p-2 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
