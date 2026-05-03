import { useState } from "react";
import { Loader2, PlusCircle, CheckCircle2 } from "lucide-react";

export function EmployerDashboard() {
  const [jobPosted, setJobPosted] = useState(false);
  const [escrowed, setEscrowed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePostJob = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEscrowed(true);
      setJobPosted(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 w-full mt-12 pb-20">
      <div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Employer Portal</h1>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Post jobs and lock funds in escrow. The AI agents handle the rest.</p>
      </div>

      {!jobPosted ? (
        <div className="bg-zinc-900 border-t-2 border-white p-6 rounded-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Job Title</label>
              <input type="text" className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-4 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" value="Build Data Dashboard" readOnly />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Required Skills</label>
              <input type="text" className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-4 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" value="React, Data Engineering" readOnly />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Payment (Escrow via KeeperHub)</label>
              <div className="flex gap-2">
                <input type="text" className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-4 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" value="150" readOnly />
                <div className="bg-[#CDFF00] text-black flex items-center px-6 rounded-sm font-black text-xs uppercase">USDC</div>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePostJob}
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 disabled:opacity-50 text-black py-4 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <PlusCircle size={16} />}
            {loading ? "Locking Escrow on 0G Chain..." : "Post Job & Lock Escrow"}
          </button>
        </div>
      ) : (
        <div className="bg-zinc-900 border-t-2 border-[#CDFF00] p-8 rounded-sm text-center space-y-4">
           <div className="w-16 h-16 bg-black border border-[#CDFF00]/50 text-[#CDFF00] rounded-sm flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={24} />
           </div>
           <h2 className="text-2xl font-black uppercase tracking-tighter text-[#CDFF00]">Job Posted</h2>
           <p className="text-zinc-400 max-w-sm mx-auto text-xs uppercase leading-relaxed font-mono">
             150 USDC locked in KeeperHub smart contract. Matcher Agent is finding the best worker based on verified 0G Storage skills.
           </p>
           
           <div className="pt-6 border-t border-white/10 mt-8 text-left bg-black p-6 rounded-sm border-l border-[#CDFF00]/20">
             <div className="flex items-center gap-2 mb-4">
               <span className="w-1.5 h-1.5 bg-[#CDFF00] rounded-full animate-pulse"></span>
               <h3 className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Live Agent Activity</h3>
             </div>
             <ul className="space-y-3 font-mono text-xs uppercase text-zinc-400">
               <li><span className="text-[#CDFF00] opacity-50 mr-2">09:42:01</span> Job indexed. Needs: React, Data.</li>
               <li><span className="text-[#CDFF00] opacity-50 mr-2">09:42:15</span> Found matches. Negotiating via AXL P2P...</li>
               <li className="animate-pulse text-zinc-600"><span className="text-[#CDFF00] opacity-50 mr-2">&gt;</span> Waiting for Worker Agent to accept...</li>
             </ul>
           </div>
        </div>
      )}
    </div>
  );
}
