import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CloudFog, Briefcase, FileCheck, ArrowRightLeft, Loader2, Sparkles, Plus, Link as LinkIcon, BadgeCheck } from "lucide-react";
import { useEnsText } from 'wagmi';
import { normalize } from 'viem/ens';

export function WorkerDashboard() {
  const [ensName, setEnsName] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [state, setState] = useState<'IDLE' | 'MATCHING' | 'WORKING' | 'VERIFYING' | 'PAID' | 'SWAPPING' | 'COMPLETED'>('IDLE');
  const [logs, setLogs] = useState<string[]>([]);
  const [credentials, setCredentials] = useState<{title: string, link: string}[]>([]);
  const [showAddCred, setShowAddCred] = useState(false);
  const [newCredTitle, setNewCredTitle] = useState("");
  const [newCredLink, setNewCredLink] = useState("");
  const [isUploadingCred, setIsUploadingCred] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [modalJob, setModalJob] = useState<any>(null);
  const [newSkill, setNewSkill] = useState("");

  const MOCK_JOBS = [
    { id: '1', title: "Build Data Dashboard", employer: "john.employer.eth", amount: "150 USDC", requirements: ["React", "Data Engineering", "Python"], desc: "Need a comprehensive data dashboard built.", responsibilities: "Frontend development, data integration.", breakdown: "Initial setup 50 USDC, Completion 100 USDC" },
    { id: '2', title: "E-commerce Smart Contract", employer: "alice.eth", amount: "500 USDC", requirements: ["Solidity", "Web3"], desc: "Develop secure escrow contracts.", responsibilities: "Smart contract dev, testing.", breakdown: "Full amount on audit passing" },
    { id: '3', title: "Backend API Migration", employer: "techcorp.eth", amount: "300 USDC", requirements: ["Node.js", "Python"], desc: "Migrate legacy Python APIs to Node.js.", responsibilities: "API writing, testing, documentation.", breakdown: "Milestone based" },
  ];

  const filteredJobs = MOCK_JOBS.filter(job => 
    (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.employer.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterSkill === "" || job.requirements.some(r => r.toLowerCase().includes(filterSkill.toLowerCase())))
  );

  // Wagmi useEnsText implementation
  const { data: ensTextData, error } = useEnsText({
    name: 'maria.labor.eth', // In real app: use active ENS name
    key: 'skills',
  });

  const addLog = (log: string) => setLogs(prev => [...prev, log]);

  const connectIdentity = () => {
    addLog("Resolving ENS maria.labor.eth...");
    setTimeout(() => {
      setEnsName("maria.labor.eth");
      setSkills(["Python", "React", "Data Engineering"]);
      setCredentials([
        { title: "Python Data Structures", link: "coursera.org/verify/xyz" }
      ]);
      addLog("Identity loaded from 0G Storage via ENS text records (" + (ensTextData || 'mocked skills') + ").");
    }, 1000);
  };

  const handleAddCredential = () => {
    if (!newCredTitle || !newCredLink) return;
    setIsUploadingCred(true);
    addLog(`Uploading credential "${newCredTitle}" to 0G Storage...`);
    setTimeout(() => {
      setCredentials(prev => [...prev, { title: newCredTitle, link: newCredLink }]);
      setShowAddCred(false);
      setNewCredTitle("");
      setNewCredLink("");
      setIsUploadingCred(false);
      addLog(`Credential verified and stored. ENS text record updated.`);
    }, 1500);
  };

  const seekWork = async (job?: any) => {
    setState('MATCHING');
    addLog(`Matcher Agent invoked with Worker Rep: 4.8, Skills: ${skills.join(", ")}`);
    addLog(`Evaluating skill semantic proximity and reputation weight against ${job ? 'selected job' : 'all jobs'}...`);
    try {
      const res = await fetch("/api/agents/matcher");
      const data = await res.json();
      setTimeout(() => {
        const bestMatchedJob = job || MOCK_JOBS[0];
        setActiveJob(bestMatchedJob);
        setState('WORKING');
        addLog("High match found! Proximity score: 92%. Reputation multiplier applied.");
        addLog(`AXL P2P channel established. Job accepted and escrow confirmed via KeeperHub.`);
      }, 1500);
    } catch (e) {
      addLog("Error communicating with Matcher Agent");
      setState('IDLE');
    }
  };

  const submitWork = async () => {
    setState('VERIFYING');
    addLog("Submitting GitHub repo link and proof screenshots via AXL to Employer's Verifier Agent...");
    try {
      const res = await fetch("/api/agents/verifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: 'verify', evidence: 'github.com/maria/dashboard', jobId: '123' })
      });
      const data = await res.json();
      addLog("Verifier Agent (0G Compute): " + data.details);
      
      addLog("Verifier Agent triggering KeeperHub payout via MCP...");
      const payRes = await fetch("/api/keeperhub/execute", { method: 'POST' });
      const payData = await payRes.json();
      addLog("KeeperHub: " + payData.message);
      
      setState('PAID');
    } catch (e) {
      addLog("Error verifying work.");
      setState('WORKING');
    }
  };

  const swapToLocal = async () => {
    setState('SWAPPING');
    addLog("Triggering Uniswap API swap from USDC -> cUSD...");
    try {
      const res = await fetch("/api/uniswap/swap", { method: 'POST' });
      const data = await res.json();
      addLog(`Swap Confirmed: Received ${data.swappedAmount} (Tx: ${data.hash})`);
      setState('COMPLETED');
    } catch (e) {
      addLog("Error swapping.");
      setState('PAID');
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-8 h-[calc(100vh-200px)]">
      {modalJob && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0A]/90 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-zinc-900 border-2 border-[#CDFF00] p-8 max-w-xl w-full rounded-sm">
             <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{modalJob.title}</h3>
                  <div className="text-xs font-mono uppercase text-[#CDFF00]">{modalJob.employer}</div>
                </div>
                <span className="text-black font-mono font-bold bg-[#CDFF00] px-3 py-1 rounded-sm text-xs ml-4 break-keep whitespace-nowrap">{modalJob.amount} ESCROW</span>
             </div>
             
             <div className="space-y-6">
               <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Description</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{modalJob.desc}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Responsibilities</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{modalJob.responsibilities}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Payment Breakdown</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed">{modalJob.breakdown}</p>
               </div>
               <div>
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {modalJob.requirements.map((req: string) => (
                       <span key={req} className="text-[9px] bg-black border border-white/20 px-2 py-1 rounded-sm text-zinc-300 font-mono uppercase">{req}</span>
                    ))}
                  </div>
               </div>
             </div>

             <div className="mt-8 flex justify-end gap-4">
                <button onClick={() => setModalJob(null)} className="px-6 py-3 border border-white/20 hover:border-white text-white rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors">Close</button>
                {state === 'IDLE' && (
                  <button onClick={() => { setModalJob(null); seekWork(modalJob); }} className="px-6 py-3 bg-[#CDFF00] hover:bg-[#CDFF00]/80 text-black rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center gap-2">
                     <Sparkles size={14} /> Match & Accept
                  </button>
                )}
             </div>
           </div>
        </div>
      )}
      <div className="space-y-8 overflow-y-auto pr-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Worker Portal</h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">Manage identity, find jobs, autonomous payment</p>
        </div>

        {!ensName ? (
          <div className="bg-zinc-900 border-t-2 border-white p-8 rounded-sm text-center space-y-4">
            <CloudFog className="mx-auto text-zinc-500 mb-4" size={48} strokeWidth={1} />
            <h2 className="text-xl font-black uppercase tracking-tighter">Connect Identity</h2>
            <p className="text-zinc-400 text-xs max-w-md mx-auto uppercase tracking-wide leading-relaxed">
              Your identity is anchored to an ENS subname and credentials are stored securely on 0G Storage.
            </p>
            <button 
              onClick={connectIdentity}
              className="mt-4 bg-[#CDFF00] hover:bg-[#CDFF00]/80 text-black px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors"
            >
              Sign In with ENS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-zinc-900 border-t-2 border-[#CDFF00] p-6 rounded-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-black border border-[#CDFF00]/30 text-[#CDFF00] rounded-sm flex items-center justify-center font-black text-xl">
                  M
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tighter">{ensName}</h2>
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    {skills.map(s => (
                      <span key={s} className="text-[9px] bg-black border border-zinc-800 px-2 py-1 rounded-sm text-zinc-300 font-mono uppercase flex items-center gap-1 group">
                        {s}
                        <button onClick={() => setSkills(skills.filter(sk => sk !== s))} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"><Plus size={10} className="rotate-45" /></button>
                      </span>
                    ))}
                    <div className="flex items-center">
                       <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => {
                          if (e.key === 'Enter' && newSkill) {
                             setSkills([...skills, newSkill]);
                             setNewSkill("");
                             addLog(`Skill "${newSkill}" anchored to ENS text records.`);
                          }
                       }} placeholder="+ Skill" className="w-16 bg-transparent border-b border-white/20 text-[9px] font-mono text-white focus:outline-none focus:border-[#CDFF00] py-1 uppercase placeholder:text-zinc-600" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Reputation</div>
                <div className="text-[#CDFF00] font-black text-2xl leading-none">4.8</div>
                <div className="text-[9px] text-zinc-500 font-mono mt-1">0G ZK VERIFIED</div>
              </div>
            </div>

            <div className="bg-zinc-900 border-t-2 border-white p-6 rounded-sm">
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                 <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Verified Credentials</h3>
                 <button onClick={() => setShowAddCred(!showAddCred)} className="text-[#CDFF00] hover:text-white flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest transition-colors"><Plus size={14}/> Add New</button>
              </div>
              
              {showAddCred && (
                <div className="mb-6 p-4 border border-white/10 bg-black rounded-sm space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Credential Title</label>
                    <input type="text" value={newCredTitle} onChange={(e) => setNewCredTitle(e.target.value)} placeholder="e.g., Codecademy React" className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-3 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Proof Link (URL)</label>
                    <input type="text" value={newCredLink} onChange={(e) => setNewCredLink(e.target.value)} placeholder="https://..." className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-3 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" />
                  </div>
                  <button onClick={handleAddCredential} disabled={isUploadingCred} className="bg-white hover:bg-zinc-200 disabled:opacity-50 text-black px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center gap-2">
                    {isUploadingCred ? <Loader2 className="animate-spin" size={14} /> : <BadgeCheck size={14} />}
                    {isUploadingCred ? "Verifying with 0G Compute..." : "Verify & Anchor to ENS"}
                  </button>
                </div>
              )}

              <div className="space-y-2">
                 {credentials.length === 0 ? (
                    <p className="text-zinc-600 text-xs font-mono uppercase">No credentials added yet.</p>
                 ) : (
                    credentials.map((cred, idx) => (
                      <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-3">
                           <LinkIcon size={14} className="text-[#CDFF00]" />
                           <span className="font-mono text-xs uppercase text-zinc-300">{cred.title}</span>
                        </div>
                        <span className="text-[#CDFF00] text-[9px] uppercase tracking-widest bg-[#CDFF00]/10 border border-[#CDFF00]/20 px-2 py-1 rounded-sm">0G ZK VERIFIED</span>
                      </div>
                    ))
                 )}
              </div>
            </div>

            {state === 'IDLE' && (
              <div className="space-y-4">
                <div className="bg-zinc-900 border-t-2 border-white p-6 rounded-sm space-y-4">
                  <div className="flex gap-4">
                     <div className="flex-grow">
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Search Jobs</label>
                         <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Keywords, Employers..." className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-3 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" />
                     </div>
                     <div className="w-1/3">
                         <label className="block text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Filter Skill</label>
                         <input type="text" value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} placeholder="e.g. React" className="w-full bg-[#0A0A0A] border border-white/20 rounded-sm p-3 text-white font-mono text-xs focus:outline-none focus:border-[#CDFF00]" />
                     </div>
                  </div>
                  
                  <button 
                    onClick={() => seekWork()}
                    className="w-full bg-white text-black py-4 rounded-sm font-bold uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Auto-Match Best Job (AI Matcher)
                  </button>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Available Jobs ({filteredJobs.length})</h3>
                   {filteredJobs.map(job => (
                      <div key={job.id} className="bg-zinc-900 border-l border-white/20 p-5 rounded-sm hover:border-[#CDFF00] cursor-pointer transition-colors" onClick={() => setModalJob(job)}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg uppercase tracking-tighter">{job.title}</h4>
                            <span className="text-black font-mono font-bold bg-[#CDFF00] px-2 py-1 rounded-sm text-[10px] break-keep whitespace-nowrap ml-2">{job.amount} ESCROW</span>
                          </div>
                          <div className="text-xs font-mono uppercase text-zinc-400 mb-3">{job.employer}</div>
                          <div className="flex flex-wrap gap-2">
                            {job.requirements.map((req: string) => (
                               <span key={req} className="text-[9px] bg-black border border-white/10 px-2 py-1 rounded-sm text-zinc-400 font-mono uppercase">{req}</span>
                            ))}
                          </div>
                      </div>
                   ))}
                </div>
              </div>
            )}

            {(state === 'MATCHING') && (
              <div className="bg-zinc-900 border-t-2 border-white py-12 rounded-sm text-center flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#CDFF00] mb-4" size={32} />
                <p className="text-zinc-400 text-xs font-mono uppercase">Matcher Agent processing 0G Compute inference...</p>
              </div>
            )}

            {(state === 'WORKING' || state === 'VERIFYING' || state === 'PAID' || state === 'SWAPPING' || state === 'COMPLETED') && activeJob && (
               <div className="bg-zinc-900 border-t-2 border-[#CDFF00] p-6 rounded-sm space-y-6">
                 <div>
                   <div className="flex justify-between items-start mb-4">
                     <h3 className="text-2xl font-black uppercase tracking-tighter cursor-pointer hover:text-[#CDFF00] underline decoration-[#CDFF00]/30 underline-offset-4 transition-colors" onClick={() => setModalJob(activeJob)}>{activeJob.title}</h3>
                     <span className="text-black font-mono font-bold bg-[#CDFF00] px-3 py-1 rounded-sm text-xs">{activeJob.amount} ESCROW</span>
                   </div>
                   <p className="text-zinc-400 text-xs font-mono uppercase">Employer: <span className="text-white">{activeJob.employer}</span></p>
                 </div>
                 
                 {state === 'WORKING' && (
                   <button 
                     onClick={submitWork}
                     className="w-full bg-[#CDFF00] hover:bg-[#CDFF00]/80 text-black py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2"
                   >
                     <FileCheck size={16} />
                     Submit Work to Verifier Agent
                   </button>
                 )}

                 {state === 'VERIFYING' && (
                   <div className="flex items-center gap-3 text-[#CDFF00] py-3 justify-center bg-black border border-[#CDFF00]/20 rounded-sm font-mono text-xs uppercase">
                     <Loader2 className="animate-spin" size={16} />
                     Verifier Agent checking evidence...
                   </div>
                 )}

                 {state === 'PAID' && (
                   <div className="space-y-4">
                     <div className="flex items-center gap-3 text-[#CDFF00] py-3 justify-center bg-black border border-[#CDFF00]/50 rounded-sm font-bold uppercase tracking-widest text-[10px]">
                       <CheckCircle2 size={16} />
                       Payment Released from Escrow
                     </div>
                     <button 
                       onClick={swapToLocal}
                       className="w-full border border-white/20 bg-zinc-900 hover:bg-zinc-800 text-white py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors flex items-center justify-center gap-2"
                     >
                       <ArrowRightLeft size={16} />
                       Swap to Local Fiat (cUSD) via Uniswap
                     </button>
                   </div>
                 )}

                 {state === 'SWAPPING' && (
                   <div className="flex items-center gap-3 text-zinc-400 py-3 justify-center bg-black border border-zinc-800 rounded-sm font-mono text-xs uppercase">
                     <Loader2 className="animate-spin" size={16} />
                     Executing swap...
                   </div>
                 )}

                  {state === 'COMPLETED' && (
                   <div className="space-y-4">
                     <div className="flex items-center gap-3 text-black py-3 justify-center bg-[#CDFF00] rounded-sm font-bold uppercase tracking-widest text-[10px]">
                       <CheckCircle2 size={16} />
                       Job Completed & Funds Localized
                     </div>
                     <div className="flex gap-4">
                       <button onClick={() => { setState('IDLE'); setActiveJob(null); }} className="flex-1 bg-white hover:bg-zinc-200 text-black py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors">Start New Search</button>
                       <button onClick={() => alert("Payout TX Hash: 0xswap_456...")} className="flex-1 border border-white/20 hover:border-white text-white py-3 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-colors">View Payout Details</button>
                     </div>
                   </div>
                 )}

               </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-zinc-900 border-l-2 border-[#CDFF00]/20 p-4 font-mono text-[10px] overflow-y-auto flex flex-col gap-2 rounded-sm relative">
        <div className="sticky top-0 bg-zinc-900 pt-1 pb-3 mb-2 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Agent Log</h3>
            <span className="w-1.5 h-1.5 bg-[#CDFF00] rounded-full animate-pulse"></span>
        </div>
        {logs.length === 0 && <p className="text-zinc-600 italic">Standby...</p>}
        {logs.map((log, i) => (
          <div key={i} className="text-zinc-300 leading-relaxed">
            <span className="text-[#CDFF00] mr-2 opacity-50">&gt;</span>{log}
          </div>
        ))}
        {logs.length > 0 && state !== 'COMPLETED' && (
            <div className="text-zinc-500 animate-pulse mt-2"><span className="text-[#CDFF00] mr-2 opacity-50">&gt;</span>_</div>
        )}
      </div>
    </div>
  );
}
