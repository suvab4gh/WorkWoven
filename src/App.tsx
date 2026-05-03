/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { WorkerDashboard } from './pages/WorkerDashboard';
import { EmployerDashboard } from './pages/EmployerDashboard';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

function Layout() {
  const location = useLocation();
  const identity = location.pathname.includes('/worker') ? 'maria.labor.eth' : location.pathname.includes('/employer') ? 'john.employer.eth' : 'unconnected';

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden flex flex-col select-none">
      <header className="flex justify-between items-start border-b border-white/20 pb-4 mb-6 pt-8 px-8 sticky top-0 bg-[#0A0A0A] z-10">
        <div>
          <Link to="/" className="text-4xl font-black tracking-tighter uppercase leading-none block">WorkWoven</Link>
          <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-widest">Labor Trust Infrastructure v1.0.4</p>
        </div>
        <div className="flex space-x-12">
          <div className="flex space-x-6 items-center">
             <Link to="/worker" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Worker Portal</Link>
             <Link to="/employer" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Employer Portal</Link>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">Active Identity</p>
            <p className="text-sm font-mono text-[#CDFF00]">{identity}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">Network Status</p>
            <div className="flex items-center gap-2 justify-end font-mono text-sm">
              <span className="w-2 h-2 rounded-full bg-[#CDFF00] animate-pulse"></span>
              0G_TESTNET_IV
            </div>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/worker" element={<WorkerDashboard />} />
          <Route path="/employer" element={<EmployerDashboard />} />
        </Routes>
      </main>
      <footer className="mt-auto flex justify-between items-end pt-4 pb-4 px-8 opacity-50 border-t border-white/10 mt-8">
        <div className="text-[9px] font-mono uppercase tracking-[0.2em]">
          Protocol: WovenRep-721-ZK // Sequence: 99421-A
        </div>
        <div className="text-[9px] font-mono uppercase tracking-[0.2em]">
          [ ENS ] [ 0G ] [ AXL ] [ KEEPERHUB ] [ UNISWAP ]
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

