import { SystemStatus, NCEStatus, LogEntry } from '../types';
import { INITIAL_SYSTEM_STATUS, INITIAL_NCE_STATUS } from '../data/mockData';

export function formatUptime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function createLogEntry(
  module: LogEntry['module'],
  level: LogEntry['level'],
  message: string
): LogEntry {
  const now = new Date();
  const timeStr = `${now.toTimeString().split(' ')[0]}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  return {
    id: 'log-' + Math.random().toString(36).substring(2, 9),
    timestamp: timeStr,
    level,
    module,
    message
  };
}

export function generateDemoJitter(
  currentStatus: SystemStatus, 
  currentNCE: NCEStatus,
  isInferring: boolean
): { updatedStatus: SystemStatus; updatedNCE: NCEStatus; newLog?: LogEntry } {
  const cpuBase = isInferring ? 32 : 18;
  const fpgaBase = isInferring ? 84 : 26;
  const jitterRange = 5;

  const newCpu = Math.max(8, Math.min(98, Math.round(cpuBase + (Math.random() - 0.5) * jitterRange)));
  const newFpga = Math.max(5, Math.min(99, Math.round(fpgaBase + (Math.random() - 0.5) * jitterRange)));
  const newPower = +(4.5 + (newFpga / 100) * 0.5 + (Math.random() - 0.5) * 0.1).toFixed(2);
  const newTemp = +(43.0 + (newFpga / 100) * 3.5 + (Math.random() - 0.5) * 0.2).toFixed(1);

  // Randomly update block status during demo mode
  const blockKeys = Object.keys(currentNCE.blocks);
  const updatedBlocks = { ...currentNCE.blocks };
  
  if (isInferring || Math.random() < 0.35) {
    const randomKey = blockKeys[Math.floor(Math.random() * blockKeys.length)];
    const states: ('IDLE' | 'ACTIVE' | 'WAITING')[] = ['ACTIVE', 'IDLE', 'ACTIVE'];
    const selectedState = isInferring ? 'ACTIVE' : states[Math.floor(Math.random() * states.length)];
    updatedBlocks[randomKey] = {
      ...updatedBlocks[randomKey],
      status: selectedState,
      activityPercentage: selectedState === 'ACTIVE' ? Math.round(75 + Math.random() * 24) : Math.round(10 + Math.random() * 20)
    };
  }

  // Occasional random log
  let newLog: LogEntry | undefined = undefined;
  if (Math.random() < 0.08) {
    const logPool = [
      { mod: 'FPGA' as const, lvl: 'NCE' as const, msg: 'Systolic array pipeline cycle sync verified: 0 slippage.' },
      { mod: 'COMM' as const, lvl: 'INFO' as const, msg: 'SPI DMA burst buffer synchronized: 256 words transferred.' },
      { mod: 'RUNTIME' as const, lvl: 'INFO' as const, msg: 'Tensor arena memory fragmentation: 0.2% (optimal).' },
      { mod: 'HOST' as const, lvl: 'PERF' as const, msg: 'RISC-V JH7110 Core thermal governor: Normal (43.8°C).' },
      { mod: 'MODEL' as const, lvl: 'INFO' as const, msg: 'Dynamic INT8 requantization table refreshed.' }
    ];
    const picked = logPool[Math.floor(Math.random() * logPool.length)];
    newLog = createLogEntry(picked.mod, picked.lvl, picked.msg);
  }

  return {
    updatedStatus: {
      ...currentStatus,
      uptimeSeconds: currentStatus.uptimeSeconds + 1,
      cpuTemperatureC: newTemp,
    },
    updatedNCE: {
      ...currentNCE,
      macUtilization: newFpga,
      acceleratorUtilization: newFpga,
      powerEstimateWatts: newPower,
      dataTransferRateMBps: +(38.0 + (newFpga / 100) * 12.0).toFixed(1),
      blocks: updatedBlocks
    },
    newLog
  };
}
