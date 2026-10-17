import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  HardwareConnectionMode, 
  SystemStatus, 
  NCEStatus, 
  LogEntry,
  NavPage 
} from '../types';
import { 
  INITIAL_SYSTEM_STATUS, 
  INITIAL_NCE_STATUS, 
  INITIAL_LOGS 
} from '../data/mockData';
import { createLogEntry, generateDemoJitter } from '../services/system';
import { realBackend, setApiBaseUrl as updateApiBaseUrl } from '../services/api';

export type { NavPage };

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
  refreshTelemetry: () => Promise<void>;
  backendConnected: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<NavPage>('overview');
  const [hardwareMode, setHardwareMode] = useState<HardwareConnectionMode>('hardware');
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isInferring, setIsInferring] = useState<boolean>(false);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const [nceStatus, setNceStatus] = useState<NCEStatus>(INITIAL_NCE_STATUS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>('http://127.0.0.1:8000');
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const handleSetApiBaseUrl = useCallback((url: string) => {
    setApiBaseUrlState(url);
    updateApiBaseUrl(url);
  }, []);

  const addLog = useCallback((module: LogEntry['module'], level: LogEntry['level'], message: string) => {
    const entry = createLogEntry(module, level, message);
    setLogs(prev => [entry, ...prev.slice(0, 199)]);
  }, []);

  const clearLogs = useCallback(async () => {
    setLogs([]);
    try {
      await realBackend.clearLogs();
    } catch {
      // ignore
    }
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

    setTimeout(() => {
      setNceStatus(prev => {
        const updated = { ...prev.blocks };
        Object.keys(updated).forEach(id => {
          updated[id] = {
            ...updated[id],
            status: 'IDLE',
            activityPercentage: 0
          };
        });
        return {
          ...prev,
          acceleratorUtilization: prev.isAvailable ? 15 : null,
          macUtilization: prev.isAvailable ? 10 : null,
          blocks: updated
        };
      });
    }, 1800);
  }, []);

  const refreshTelemetry = useCallback(async () => {
    try {
      const [sys, nce, logList] = await Promise.all([
        realBackend.getSystemStatus(),
        realBackend.getNCEStatus(),
        realBackend.getLogs(50)
      ]);
      setSystemStatus(sys);
      setNceStatus(nce);
      setBackendConnected(true);
      if (logList && logList.length > 0) {
        setLogs(logList);
      }
    } catch {
      setBackendConnected(false);
    }
  }, []);

  // Poll real backend telemetry every 2 seconds when in hardware mode
  useEffect(() => {
    if (hardwareMode === 'hardware') {
      refreshTelemetry();
      const interval = setInterval(refreshTelemetry, 2000);
      return () => clearInterval(interval);
    }
  }, [hardwareMode, refreshTelemetry]);

  // Demo mode jitter ticker when explicitly opted into simulation
  useEffect(() => {
    if (demoMode) {
      const timer = setInterval(() => {
        setSystemStatus(currSys => {
          setNceStatus(currNCE => {
            const { updatedStatus, updatedNCE, newLog } = generateDemoJitter(currSys, currNCE, isInferring);
            if (newLog) {
              setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 199)]);
            }
            return updatedNCE;
          });
          return currSys;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
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
        setApiBaseUrl: handleSetApiBaseUrl,
        refreshTelemetry,
        backendConnected
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
