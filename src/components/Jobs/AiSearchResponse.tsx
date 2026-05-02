"use client";

import { Sparkles, Bot } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface AiSearchResponseProps {
  message: string;
}

const AiSearchResponse = ({ message }: AiSearchResponseProps) => {
  if (!message) return null;

  return (
    <div className="bg-gradient-to-r from-[#4640DE]/5 to-indigo-50/50 border border-[#4640DE]/20 rounded-2xl p-6 mb-8 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-[#4640DE]/20 to-purple-400/20 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-indigo-100 shrink-0">
          <Bot className="text-[#4640DE]" size={28} />
        </div>
        
        <div className="space-y-2 grow">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#2D2D2D] font-clash text-lg">AI Assistant</h3>
            <Sparkles className="text-yellow-500" size={16} />
          </div>
          
          <div className="text-[#515B6F] font-epilogue text-base leading-relaxed prose prose-indigo max-w-none">
             <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSearchResponse;
