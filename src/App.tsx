import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { ObjectDetection } from './pages/ObjectDetection';
import { TinyLLM } from './pages/TinyLLM';
import { NeuralComputeEngine } from './pages/NeuralComputeEngine';
import { Benchmarks } from './pages/Benchmarks';
import { SystemArchitecture } from './pages/SystemArchitecture';
import { DeviceSettings } from './pages/DeviceSettings';
import { LogsDiagnostics } from './pages/LogsDiagnostics';
import { About } from './pages/About';

const AppContent: React.FC = () => {
  const { activePage } = useSystem();

  return (
    <Layout>
      {activePage === 'overview' && <Overview />}
      {activePage === 'detection' && <ObjectDetection />}
      {activePage === 'llm' && <TinyLLM />}
      {activePage === 'nce' && <NeuralComputeEngine />}
      {activePage === 'settings' && <DeviceSettings />}
      {activePage === 'benchmarks' && <Benchmarks />}
      {activePage === 'architecture' && <SystemArchitecture />}
      {activePage === 'logs' && <LogsDiagnostics />}
      {activePage === 'about' && <About />}
    </Layout>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
