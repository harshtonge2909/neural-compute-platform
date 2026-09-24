import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  HardwareConnectionMode, 
  SystemStatus, 
  NCEStatus, 
  LogEntry 
} from '../types';
import { 
  INITIAL_SYSTEM_STATUS, 
  INITIAL_NCE_STATUS, 
  INITIAL_LOGS 
} from '../data/mockData';
import { createLogEntry, generateDemoJitter } from '../services/system';

export type NavPage = 'overview' | 'detection' | 'llm' | 'nce' | 'benchmarks' | 'architecture';

interface SystemContextType {
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  hardwareMode: HardwareConnectionMode;
  setHardwareMode: (mode: HardwareConnectionMode) => void;
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  isInferring: boolean;
  setIsInferring: (inferring: boolean) => void;
  systemStatus: SystemStatus;
  nceStatus: NCEStatus;
  logs: LogEntry[];
  addLog: (module: LogEntry['module'], level: LogEntry['level'], message: string) => void;
  clearLogs: () => void;
  triggerNCEPulse: (blockIds?: string[]) => void;
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [hardwareMode, setHardwareMode] = useState<HardwareConnectionMode>('simulation');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const [nceStatus, setNceStatus] = useState<NCEStatus>(INITIAL_NCE_STATUS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>('http://192.168.1.120:8080');

  const addLog = useCallback((module: LogEntry['module'], level: LogEntry['level'], message: string) => {
    const entry = createLogEntry(module, level, message);
    setLogs(prev => [entry, ...prev.slice(0, 99)]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const triggerNCEPulse = useCallback((blockIds?: string[]) => {
    setNceStatus(prev => {
      const updated = { ...prev.blocks };
      const targets = blockIds && blockIds.length > 0 
        ? blockIds 
        : ['controller', 'on_chip_memory', 'mac_array', 'matrix_engine', 'conv_unit'];

      targets.forEach(id => {
        if (updated[id]) {
          updated[id] = {
            ...updated[id],
            status: 'ACTIVE',
            activityPercentage: Math.round(85 + Math.random() * 14)
          };
        }
      });
      return {
        ...prev,
        acceleratorUtilization: Math.round(80 + Math.random() * 15),
        macUtilization: Math.round(85 + Math.random() * 12),
        blocks: updated
      };
    });

    // Revert back after 1.8s
    setTimeout(() => {
      setNceStatus(prev => {
        const updated = { ...prev.blocks };
        Object.keys(updated).forEach(id => {
          updated[id] = {
            ...updated[id],
            status: 'IDLE',
            activityPercentage: Math.round(15 + Math.random() * 15)
          };
        });
        return {
          ...prev,
          acceleratorUtilization: 28,
          macUtilization: 25,
          blocks: updated
        };
      });
    }, 1800);
  }, []);

  // Demo mode ticker & uptime counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        uptimeSeconds: prev.uptimeSeconds + 1
      }));

      if (demoMode) {
        setSystemStatus(currSys => {
          setNceStatus(currNCE => {
            const { updatedStatus, updatedNCE, newLog } = generateDemoJitter(currSys, currNCE, isInferring);
            if (newLog) {
              setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]);
            }
            return updatedNCE;
          });
          return currSys;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [demoMode, isInferring]);

  return (
    <SystemContext.Provider
      value={{
        activePage,
        setActivePage,
        hardwareMode,
        setHardwareMode,
        demoMode,
        setDemoMode,
        isInferring,
        setIsInferring,
        systemStatus,
        nceStatus,
        logs,
        addLog,
        clearLogs,
        triggerNCEPulse,
        apiBaseUrl,
        setApiBaseUrl: setApiBaseUrlState,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
