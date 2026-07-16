/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Languages, Send } from "lucide-react";
import { Message } from "../types";

interface FanChatPanelProps {
  chatMessages: Message[];
  chatLoading: boolean;
  chatInput: string;
  onChatInputChange: (val: string) => void;
  onSendChat: () => void;
  onChatSuggestion: (suggestion: string) => void;
}

export function FanChatPanel({
  chatMessages,
  chatLoading,
  chatInput,
  onChatInputChange,
  onSendChat,
  onChatSuggestion,
}: FanChatPanelProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg flex flex-col justify-between h-[540px]">
      
      {/* Chat Container Header */}
      <div className="border-b border-white/10 p-4 flex items-center justify-between text-left">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold text-xs">
            AI
          </div>
          <div>
            <h4 className="font-bold text-sm text-white font-display">FIFA 2026 Multilingual Fan Assist</h4>
            <p className="text-[10px] text-emerald-400 font-mono font-medium">Powered by Gemini AI • English, Spanish, French, etc.</p>
          </div>
        </div>
        <Languages className="h-4 w-4 text-slate-400" />
      </div>

      {/* Chat Scroll Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-black/10">
        {chatMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col max-w-[85%] text-left ${
              msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
              msg.role === "user"
                ? "bg-gradient-to-tr from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-md shadow-emerald-950/20"
                : "bg-white/10 text-slate-200 border border-white/10 rounded-tl-none whitespace-pre-wrap"
            }`}>
              {msg.content}
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {chatLoading && (
          <div className="mr-auto flex items-center gap-2 max-w-[80%]">
            <div className="p-3 bg-white/5 border border-white/10 shadow-lg rounded-2xl rounded-tl-none flex items-center gap-1">
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="p-3 border-t border-white/10 bg-[#050B18]/60 flex flex-col gap-2 text-left">
        <p className="text-[10px] text-slate-400 font-mono font-medium">SUGGESTED FAN FAQS:</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChatSuggestion("What is the clear bag policy?")}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-full font-medium transition border border-white/5 cursor-pointer text-left"
          >
            👜 Clear Bag Rules
          </button>
          <button
            onClick={() => onChatSuggestion("How do I get to the stadium by train?")}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-full font-medium transition border border-white/5 cursor-pointer text-left"
          >
            🚆 Train Route Directions
          </button>
          <button
            onClick={() => onChatSuggestion("Is there a quiet room for sensory assistance?")}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-full font-medium transition border border-white/5 cursor-pointer text-left"
          >
            🧠 Sensory Calm Room
          </button>
          <button
            onClick={() => onChatSuggestion("Are water bottles permitted inside?")}
            className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-full font-medium transition border border-white/5 cursor-pointer text-left"
          >
            💧 Water Bottle Policy
          </button>
        </div>
      </div>

      {/* Input Text box */}
      <div className="p-4 border-t border-white/10 bg-[#050B18]/80 rounded-b-2xl text-left">
        <label htmlFor="fan-chat-input" className="sr-only">
          Ask a question to Multilingual Fan Assist
        </label>
        <div className="flex gap-2">
          <input
            id="fan-chat-input"
            type="text"
            value={chatInput}
            onChange={(e) => onChatInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSendChat()}
            placeholder="Type a query (e.g., '¿Dónde está el sensory room?' or 'Train schedule')..."
            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 focus:bg-black/60 transition font-sans"
          />
          <button
            onClick={onSendChat}
            disabled={chatLoading || !chatInput.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 flex items-center justify-center transition disabled:opacity-50 shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
