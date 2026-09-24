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
    <div className="tech-card rounded-xl border border-slate-800 flex flex-col h-[520px] overflow-hidden">
      {/* Top Console Bar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between font-mono-tech text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-100 tracking-wider">
            LLM INFERENCE CONSOLE
          </span>
          <span className="text-slate-400 text-[10px] hidden sm:inline">
            [FPGA NCE Systolic Decoder]
          </span>
        </div>

        <button
          onClick={onClearChat}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors px-2 py-0.5 rounded hover:bg-slate-800"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-[11px]">Clear</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 terminal-grid bg-[#060810]">
        {messages.length === 0 && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono-tech text-xs space-y-2">
            <Cpu className="w-8 h-8 text-cyan-400/50" />
            <p className="text-slate-300 font-semibold">
              Inference Session Ready
            </p>
            <p className="max-w-md text-slate-400">
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
              <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shrink-0 text-cyan-400 mt-1 shadow-[0_0_8px_rgba(34,211,238,0.2)]">
                <Cpu className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl p-3.5 text-xs font-mono-tech leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600/20 border border-blue-500/40 text-blue-100 rounded-tr-xs'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-xs whitespace-pre-wrap'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 pb-1 border-b border-slate-800/60">
                <span className="font-semibold text-slate-400 uppercase">
                  {msg.sender === 'user' ? 'HOST CLIENT' : 'FPGA NCE ACCELERATOR'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <p>{msg.text}</p>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-blue-950/80 border border-blue-500/50 flex items-center justify-center shrink-0 text-blue-400 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Live Streaming Response */}
        {isGenerating && currentStreamingText && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-7 h-7 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center shrink-0 text-cyan-400 mt-1 shadow-[0_0_10px_rgba(34,211,238,0.4)]">
              <Cpu className="w-4 h-4 animate-pulse" />
            </div>

            <div className="max-w-[85%] rounded-xl p-3.5 text-xs font-mono-tech leading-relaxed bg-slate-900/90 border border-cyan-500/50 text-slate-200 rounded-tl-xs whitespace-pre-wrap shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 pb-1 border-b border-slate-800/60">
                <span className="font-semibold text-cyan-400 uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  FPGA NCE STREAMING
                </span>
                <span>Generating...</span>
              </div>
              <p>
                {currentStreamingText}
                <span className="inline-block w-2 h-3.5 bg-cyan-400 ml-1 animate-pulse" />
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Tiny LLM (e.g. 'Explain how FPGA acceleration improves neural network inference.')... [Enter to send, Shift+Enter for newline]"
              disabled={isGenerating}
              className="w-full bg-[#080c16] border border-slate-700/80 rounded-lg p-2.5 text-xs font-mono-tech text-slate-200 focus:outline-none focus:border-cyan-500 resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="p-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono-tech text-xs transition-colors flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                title="Stop token generation"
              >
                <Square className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono-tech text-xs transition-all flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
                title="Send inference prompt"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
