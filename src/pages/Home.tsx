import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Cpu, Wallet } from "lucide-react";

export function Home() {
  return (
    <div className="flex-grow flex flex-col justify-center">
      <div className="flex-grow flex flex-col justify-center border-b border-white/10 pb-8 mt-12 mb-8">
        <h2 className="text-[64px] md:text-[112px] leading-[0.85] font-black uppercase tracking-tighter">
          Autonomous<br/>
          Settlement<br/>
          <span className="text-[#CDFF00]">Verified.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-8">
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed uppercase">
            01 / Decentralized AI Agents replacing centralized trust platforms for the global workforce.
          </p>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed uppercase">
            02 / P2P identity via ENS with zero-knowledge skill verification stored on 0G persistent storage.
          </p>
          <p className="text-xs md:text-sm text-zinc-400 leading-relaxed uppercase">
            03 / Guaranteed payouts via KeeperHub & Uniswap smart settlements. 1.7B workers empowered.
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-start gap-4 pt-12"
        >
          <Link to="/worker" className="bg-[#CDFF00] text-black px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#CDFF00]/80 transition-colors">
            I am a Worker <ArrowRight size={14} />
          </Link>
          <Link to="/employer" className="border border-white/20 hover:border-white text-white bg-zinc-900 px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors">
            Post a Job
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8 pb-12">
        {/* Worker Card */}
        <div className="bg-zinc-900 p-5 rounded-sm border-t-2 border-[#CDFF00]">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">01 _ Identity</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="opacity-50 font-mono italic text-[10px]">Subname</span>
              <span className="font-mono">labor.eth</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="opacity-50 font-mono italic text-[10px]">ZK-Credential</span>
              <span className="font-mono">[VERIFIED]</span>
            </div>
            <div className="flex justify-between text-xs border-t border-white/10 pt-2">
              <span className="opacity-50 font-mono italic text-[10px]">Worker Rating</span>
              <span className="font-bold text-[#CDFF00]">4.92 / 5.0</span>
            </div>
          </div>
        </div>

        {/* Agent Swarm Card */}
        <div className="bg-zinc-900 p-5 rounded-sm border-t-2 border-white">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">02 _ Agent Swarm</h3>
          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#CDFF00]"></span>
              MATCHER: <span className="text-[#CDFF00]">IDLE</span>
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-1.5 h-1.5 bg-white"></span>
              VERIFIER: RUNNING_INF
            </div>
            <div className="flex items-center gap-2 opacity-50">
              <span className="w-1.5 h-1.5 bg-white"></span>
              RESOLVER: STANDBY
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 text-[9px] uppercase tracking-tighter">
              Executing: Sealed Inference qwen3.6-plus
            </div>
          </div>
        </div>

        {/* 0G Storage/AXL Status */}
        <div className="bg-zinc-900 p-5 rounded-sm border-t-2 border-white">
          <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">03 _ Infrastructure</h3>
          <div className="space-y-3">
            <div className="h-8 bg-zinc-800 relative overflow-hidden flex items-center px-2">
              <div className="absolute left-0 h-full w-[65%] bg-[#CDFF00]/20 border-r border-[#CDFF00]"></div>
              <span className="relative z-10 text-[10px] font-mono">0G STORAGE: 65% CAPACITY</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span>AXL COMM P2P</span>
              <span className="text-[#CDFF00]">ENCRYPTED</span>
            </div>
            <div className="text-[9px] opacity-40 uppercase">Gensyn AXL Cross-Node Mesh Active</div>
          </div>
        </div>

        {/* Payout/Settlement */}
        <div className="bg-[#CDFF00] text-black p-5 rounded-sm">
          <h3 className="text-[10px] font-bold text-black/50 uppercase tracking-widest mb-4">04 _ Settlement</h3>
          <div className="space-y-1 mb-4">
            <div className="text-2xl font-black leading-none">$1,450.00</div>
            <div className="text-[10px] font-bold uppercase">USDC (KeeperHub Escrow)</div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold uppercase border-t border-black/20 pt-2">
              <span>Swap Config</span>
              <span>50% cUSD</span>
            </div>
            <div className="text-[9px] italic opacity-60 leading-none mt-1">
              Triggering Uniswap API settlement upon verifier proof...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
