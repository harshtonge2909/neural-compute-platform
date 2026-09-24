import React, { useState } from 'react';
import { useSystem } from '../context/SystemContext';
import { getBackend } from '../services/api';
import { LLM_PRESETS, LLMPreset } from '../data/mockData';
import { LLMResult } from '../types';
import { LLMControls } from '../components/llm/LLMControls';
import { LLMChat, ChatMessage } from '../components/llm/LLMChat';
import { LLMStatusIndicator } from '../components/llm/LLMStatusIndicator';
import { LLMMetricsPanel } from '../components/llm/LLMMetricsPanel';
import { RuntimeLog } from '../components/common/RuntimeLog';

export const TinyLLM: React.FC = () => {
  const { hardwareMode, addLog, triggerNCEPulse, setIsInferring } = useSystem();

  const [model, setModel] = useState<'TinyLlama-1.1B' | 'Custom Tiny LLM (INT8)' | 'Lightweight Transformer'>('TinyLlama-1.1B');
  const [inputText, setInputText] = useState<string>('Explain how FPGA acceleration improves neural network inference.');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<string>('');
  const [currentStreamingText, setCurrentStreamingText] = useState<string>('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg-1',
      sender: 'user',
      text: 'Explain how FPGA acceleration improves neural network inference.',
      timestamp: '12:41:00',
    },
    {
      id: 'init-msg-2',
      sender: 'assistant',
      text: LLM_PRESETS[0].response,
      timestamp: '12:41:04',
    }
  ]);

  const [latestMetrics, setLatestMetrics] = useState<LLMResult | null>({
    text: LLM_PRESETS[0].response,
    tokensGenerated: 148,
    tokensPerSecond: 18.7,
    timeToFirstTokenMs: 215,
    totalGenerationTimeSec: 7.9,
    cpuUtilization: 24,
    fpgaUtilization: 73,
    energyJoules: 0.42,
    isSimulated: true,
  });

  const handleSelectPreset = (preset: LLMPreset) => {
    setInputText(preset.prompt);
    addLog('MODEL', 'INFO', `Loaded preset prompt: "${preset.title}"`);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, userMsg]);
    const promptToSend = inputText;
    setInputText('');
    setIsGenerating(true);
    setIsInferring(true);
    setCurrentStreamingText('');

    addLog('RUNTIME', 'INFO', `LLM request: Model=${model}, Prompt="${promptToSend.slice(0, 35)}..."`);
    triggerNCEPulse(['controller', 'on_chip_memory', 'matrix_engine', 'mac_array']);

    try {
      const api = getBackend(hardwareMode);
      const result = await api.generateLLM(
        { prompt: promptToSend, model },
        (_token: string, fullText: string) => {
          setCurrentStreamingText(fullText);
        },
        (stage: string) => {
          setActiveStage(stage);
          addLog('FPGA', 'INFO', `LLM Pipeline Stage: ${stage}`);
        }
      );

      // Add final assistant message
      const assistantMsg: ChatMessage = {
        id: 'msg-resp-' + Date.now(),
        sender: 'assistant',
        text: result.text,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, assistantMsg]);
      setCurrentStreamingText('');
      setLatestMetrics(result);
      addLog('PERF', 'PERF', `LLM generated ${result.tokensGenerated} tokens at ${result.tokensPerSecond} tok/s (${result.totalGenerationTimeSec}s). Energy: ${result.energyJoules}J`);
    } catch (err: any) {
      addLog('RUNTIME', 'ERROR', `LLM generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setIsInferring(false);
      setActiveStage('');
    }
  };

  const handleStopGeneration = () => {
    setIsGenerating(false);
    setIsInferring(false);
    setActiveStage('');
    if (currentStreamingText) {
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-stop-' + Date.now(),
          sender: 'assistant',
          text: currentStreamingText + ' [INTERRUPTED BY USER]',
          timestamp: new Date().toLocaleTimeString(),
        }
      ]);
      setCurrentStreamingText('');
    }
    addLog('RUNTIME', 'WARN', 'LLM token generation halted by operator interrupt');
  };

  const handleClearChat = () => {
    setMessages([]);
    setCurrentStreamingText('');
    setLatestMetrics(null);
    addLog('RUNTIME', 'INFO', 'LLM session context cleared');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 font-mono-tech tracking-tight">
              TINY LLM
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono-tech font-bold">
              QUANTIZED TRANSFORMER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lightweight Language Model on Embedded AI Hardware (FPGA Matrix Engine)
          </p>
        </div>

        {/* Live Generation Indicator */}
        <LLMStatusIndicator isGenerating={isGenerating} activeStage={activeStage} />
      </div>

      {/* Model Controls & Preset Prompts */}
      <LLMControls
        selectedModel={model}
        onSelectModel={setModel}
        onSelectPreset={handleSelectPreset}
        disabled={isGenerating}
      />

      {/* Real-time LLM Metrics Bar */}
      <LLMMetricsPanel metrics={latestMetrics} isGenerating={isGenerating} />

      {/* Console Chat Stream */}
      <LLMChat
        messages={messages}
        currentStreamingText={currentStreamingText}
        isGenerating={isGenerating}
        inputText={inputText}
        onInputChange={setInputText}
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        onClearChat={handleClearChat}
      />

      {/* Runtime Log */}
      <RuntimeLog maxHeight="max-h-44" title="LLM Runtime Execution Log" />
    </div>
  );
};
