import React, { useRef, useEffect } from 'react';
import { Send, Square, Trash2, Terminal, User, Cpu } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface LLMChatProps {
  messages: ChatMessage[];
  currentStreamingText: string;
  isGenerating: boolean;
  inputText: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onStopGeneration: () => void;
  onClearChat: () => void;
}

export const LLMChat: React.FC<LLMChatProps> = ({
  messages,
  currentStreamingText,
  isGenerating,
  inputText,
  onInputChange,
  onSendMessage,
  onStopGeneration,
  onClearChat,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentStreamingText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && inputText.trim()) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#D9E2EC] shadow-xs flex flex-col h-[520px] overflow-hidden font-sans">
      {/* Top Console Bar */}
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#D9E2EC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-[#172033] tracking-tight">
            LLM Inference Console
          </span>
          <span className="text-[#718096] text-[11px] hidden sm:inline font-mono-tech">
            [FPGA NCE Systolic Decoder]
          </span>
        </div>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1 text-[#526174] hover:text-rose-600 transition-colors px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Clear</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F8FAFC]">
        {messages.length === 0 && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#718096] text-xs space-y-2">
            <Cpu className="w-8 h-8 text-blue-600/40" />
            <p className="text-[#172033] font-semibold text-sm">
              Inference Session Ready
            </p>
            <p className="max-w-md text-[#526174]">
              Select one of the preset engineering prompts above or type a custom question to stream tokens accelerated by the FPGA Neural Compute Engine.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <Cpu className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-50 border border-blue-200 text-[#172033] rounded-tr-xs'
                  : 'bg-white border border-[#D9E2EC] text-[#172033] rounded-tl-xs shadow-2xs whitespace-pre-wrap'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-[#718096] mb-1.5 pb-1 border-b border-slate-100 font-sans">
                <span className="font-semibold uppercase tracking-wider">
                  {msg.sender === 'user' ? 'Host Client' : 'FPGA NCE Accelerator'}
                </span>
                <span className="font-mono-tech">{msg.timestamp}</span>
              </div>
              <p className="font-sans text-xs">{msg.text}</p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Live Streaming Response */}
        {isGenerating && currentStreamingText && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>

            <div className="max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed bg-white border border-blue-400 text-[#172033] rounded-tl-xs whitespace-pre-wrap shadow-sm">
              <div className="flex items-center justify-between text-[10px] text-blue-700 mb-1.5 pb-1 border-b border-blue-100 font-sans font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                  Streaming from FPGA NCE...
                </span>
                <span className="font-mono-tech">Generating</span>
              </div>
              <p className="font-sans text-xs">
                {currentStreamingText}
                <span className="inline-block w-2 h-3.5 bg-blue-600 ml-1 animate-pulse align-middle" />
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-[#D9E2EC]">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Tiny LLM (e.g. 'Explain how FPGA acceleration improves neural network inference.')... [Enter to send, Shift+Enter for newline]"
              disabled={isGenerating}
              className="w-full bg-white border border-[#D9E2EC] rounded-lg p-2.5 text-xs text-[#172033] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none disabled:opacity-50 font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="p-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-sans text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                title="Stop token generation"
              >
                <Square className="w-3.5 h-3.5 fill-white" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-sans text-xs font-semibold transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send inference prompt"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
