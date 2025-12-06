import React, { useState, useRef, useEffect } from 'react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User as UserIcon, Loader2, Sparkles } from 'lucide-react';

const AICoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your AI Study Coach. I can explain complex topics, create flashcards, or quiz you. What are we studying today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Call AI
    const responseText = await GeminiService.explainConcept(userMsg.text, "General", "10th Grade");
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-sm shadow-indigo-200">
           <Bot size={20} />
        </div>
        <div>
           <h2 className="font-bold text-slate-800">Study Coach</h2>
           <p className="text-xs text-slate-500 flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
             Powered by Gemini 2.5 Flash
           </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
             <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
             </div>
             <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
               msg.role === 'user' 
                 ? 'bg-indigo-600 text-white rounded-tr-none' 
                 : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
             }`}>
                {(msg.text || '').split('\n').map((line, i) => <p key={i} className="mb-1 last:mb-0">{line}</p>)}
             </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Bot size={16} />
             </div>
             <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-sm text-slate-400 font-medium">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
         <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-1 text-slate-800 placeholder:text-slate-400"
              placeholder="Ask about a topic, or say 'Quiz me on Math'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
               <Send size={18} />
            </button>
         </div>
         <p className="text-[10px] text-center text-slate-400 mt-2">
           AI can make mistakes. Always check important info.
         </p>
      </div>
    </div>
  );
};

export default AICoach;