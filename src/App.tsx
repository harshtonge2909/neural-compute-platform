import React from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Layout } from './components/layout/Layout';
import { Overview } from './pages/Overview';
import { ObjectDetection } from './pages/ObjectDetection';
import { TinyLLM } from './pages/TinyLLM';
import { NeuralComputeEngine } from './pages/NeuralComputeEngine';
import { Benchmarks } from './pages/Benchmarks';
import { SystemArchitecture } from './pages/SystemArchitecture';

const AppContent: React.FC = () => {
  const { activePage } = useSystem();

  return (
    <Layout>
      {activePage === 'overview' && <Overview />}
      {activePage === 'detection' && <ObjectDetection />}
      {activePage === 'llm' && <TinyLLM />}
      {activePage === 'nce' && <NeuralComputeEngine />}
      {activePage === 'benchmarks' && <Benchmarks />}
      {activePage === 'architecture' && <SystemArchitecture />}
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
