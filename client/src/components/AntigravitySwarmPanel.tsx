import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { MotionReveal } from './motion/MotionReveal';
import {
  Bot,
  Terminal,
  Play,
  RefreshCw,
  Zap,
  MapPin,
  Search,
  Cpu
} from 'lucide-react';

interface SwarmPanelProps {
  selectedLead: BusinessProfile | null;
  onRefreshLeads: () => void;
}

export const AntigravitySwarmPanel = ({ selectedLead, onRefreshLeads }: SwarmPanelProps) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [targetCity, setTargetCity] = useState('Parakou');
  const [targetQuery, setTargetQuery] = useState('peintre');

  const fetchStatusAndLogs = async () => {
    try {
      const [agentsData, logsData] = await Promise.all([
        api.getAgentsStatus(),
        api.getAgentLogs(),
      ]);
      setAgents(agentsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Failed to fetch swarm data:', err);
    }
  };

  useEffect(() => {
    fetchStatusAndLogs();
    const interval = setInterval(fetchStatusAndLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDispatch = async (role: string, payload: any) => {
    try {
      await api.dispatchAgentTask(role, payload);
      await fetchStatusAndLogs();
      onRefreshLeads();
    } catch (err) {
      console.error('Agent task error:', err);
    }
  };

  const handleRunAutonomousPipeline = async () => {
    if (!selectedLead) return;
    setIsRunningAll(true);
    try {
      // 1. AuditorAgent
      await api.dispatchAgentTask('auditor', { leadId: selectedLead.id });
      await fetchStatusAndLogs();

      // 2. ArchitectAgent
      await api.dispatchAgentTask('architect', { leadId: selectedLead.id });
      await fetchStatusAndLogs();

      // 3. DevOpsAgent
      await api.dispatchAgentTask('devops', { leadId: selectedLead.id });
      await fetchStatusAndLogs();

      // 4. CloserAgent
      await api.dispatchAgentTask('closer', { leadId: selectedLead.id, action: 'pitch' });
      await fetchStatusAndLogs();

      onRefreshLeads();
    } catch (err) {
      console.error('Full pipeline error:', err);
    } finally {
      setIsRunningAll(false);
    }
  };

  const handleRunAutopilotMission = async () => {
    setIsRunningAll(true);
    try {
      // 1. ScoutAgent live search
      const discovered = await api.dispatchAgentTask('scout', { query: targetQuery, location: targetCity });
      await fetchStatusAndLogs();
      onRefreshLeads();

      const leadToProcess = discovered && discovered.length > 0 ? discovered[0] : selectedLead;
      if (leadToProcess) {
        // 2. AuditorAgent
        await api.dispatchAgentTask('auditor', { leadId: leadToProcess.id });
        await fetchStatusAndLogs();

        // 3. ArchitectAgent
        await api.dispatchAgentTask('architect', { leadId: leadToProcess.id });
        await fetchStatusAndLogs();

        // 4. DevOpsAgent
        await api.dispatchAgentTask('devops', { leadId: leadToProcess.id });
        await fetchStatusAndLogs();

        // 5. CloserAgent
        await api.dispatchAgentTask('closer', { leadId: leadToProcess.id, action: 'pitch' });
        await fetchStatusAndLogs();

        onRefreshLeads();
      }
    } catch (err) {
      console.error('Autopilot error:', err);
    } finally {
      setIsRunningAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <MotionReveal direction="up" delay={0.05}>
        <div className="glass-card p-6 sm:p-8 relative overflow-hidden border border-white/80 shadow-md">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rose-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C] text-xs font-outfit font-extrabold uppercase tracking-widest">
                <Cpu className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Antigravity Multi-Agent Swarm Orchestrator</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#0F172A] tracking-tight uppercase">
                Essaim d'Agents IA <span className="text-[#EA580C]">Autonomes</span>
              </h2>

              <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                Supervision temps réel des 5 agents spécialisés : <strong>Scout</strong> (détection Maps),
                <strong>Auditor</strong> (Vision LLM & Scoring), <strong>Architect</strong> (Génération React modulaire),
                <strong>DevOps</strong> (Anycast Cloudflare Pages) et <strong>Closer</strong> (FeexPay & Closing).
              </p>
            </div>

            {/* Mission Controls Strip */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 bg-slate-100/90 p-2.5 rounded-2xl border border-slate-200 w-full lg:w-auto shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                  <select
                    value={targetCity}
                    onChange={(e) => setTargetCity(e.target.value)}
                    className="bg-transparent font-outfit font-bold text-[#0F172A] focus:outline-none cursor-pointer"
                  >
                    <option value="Parakou">Parakou</option>
                    <option value="Cotonou">Cotonou</option>
                    <option value="Porto-Novo">Porto-Novo</option>
                    <option value="Abidjan">Abidjan</option>
                    <option value="Dakar">Dakar</option>
                    <option value="Lomé">Lomé</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={targetQuery}
                    onChange={(e) => setTargetQuery(e.target.value)}
                    className="bg-transparent font-outfit font-bold text-[#0F172A] focus:outline-none cursor-pointer"
                  >
                    <option value="peintre">Peintre</option>
                    <option value="plombier">Plombier</option>
                    <option value="boulangerie">Boulangerie</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="couture">Couture</option>
                    <option value="mecanique">Mécanique</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleRunAutopilotMission}
                disabled={isRunningAll}
                className="btn-primary text-xs !py-2.5 !px-4 !rounded-xl"
                aria-label="Lancer la mission autopilot"
              >
                {isRunningAll ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{isRunningAll ? 'Mission en cours...' : 'Mission Autopilot'}</span>
              </button>

              {selectedLead && (
                <button
                  onClick={handleRunAutonomousPipeline}
                  disabled={isRunningAll}
                  className="btn-secondary text-xs !py-2.5 !px-4 !rounded-xl"
                  title={`Exécuter le cycle sur : ${selectedLead.title}`}
                >
                  <Play className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span className="truncate max-w-[130px]">Cycle : {selectedLead.title}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </MotionReveal>

      {/* Agents Cards Grid */}
      <MotionReveal direction="up" delay={0.1}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {agents.map((agent: any) => {
            const isBusy = agent.state === 'THINKING' || agent.state === 'EXECUTING_TOOL';
            return (
              <div
                key={agent.role}
                className="glass-card p-5 space-y-4 flex flex-col justify-between hover:-translate-y-1 transition duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-outfit font-black text-sm shadow-md"
                      style={{ backgroundColor: agent.avatarColor }}
                    >
                      <Bot className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isBusy
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : agent.state === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {agent.state}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-outfit font-black text-sm text-[#0F172A] uppercase leading-tight">
                      {agent.name}
                    </h3>
                    <p className="text-[10px] text-[#EA580C] font-mono font-bold mt-0.5">{agent.title}</p>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {agent.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Outils : {agent.tools?.length || 0}</span>
                    <span className="font-bold text-[#0F172A]">{agent.tasksCompleted || 0} tâches</span>
                  </div>

                  <button
                    onClick={() => {
                      if (agent.role === 'scout') {
                        handleDispatch('scout', { query: 'peintre', location: 'Parakou' });
                      } else if (selectedLead) {
                        handleDispatch(agent.role, { leadId: selectedLead.id });
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#0F172A] hover:text-white text-[#0F172A] font-outfit font-bold text-[10px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3 h-3" />
                    <span>Activer Agent</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </MotionReveal>

      {/* Live Thinking Stream & Terminal */}
      <MotionReveal direction="up" delay={0.15}>
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0A0F1D] border border-white/10 text-white space-y-4 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-[#EA580C]" />
              </div>
              <div>
                <h3 className="font-outfit font-black text-sm uppercase text-white tracking-tight">
                  Flux d'Exécution & Raisonnement (Live Agent Stream)
                </h3>
                <p className="text-[11px] font-mono text-slate-400">
                  Interception des pensées, appels d'outils et retours d'exécution de l'essaim
                </p>
              </div>
            </div>

            <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>5 Agents Connectés</span>
            </span>
          </div>

          <div className="font-mono text-xs text-slate-300 space-y-2 max-h-[340px] overflow-y-auto no-scrollbar p-3.5 rounded-xl bg-[#060A14] border border-white/5">
            {logs.length === 0 ? (
              <div className="text-slate-500 italic py-8 text-center">
                Aucun événement dans le flux. Cliquez sur « Activer Agent » ou lancez une mission autopilot.
              </div>
            ) : (
              logs.map((log: any, idx: number) => {
                const badgeColors: Record<string, string> = {
                  scout: '#10B981',
                  auditor: '#3B82F6',
                  architect: '#EA580C',
                  devops: '#F97316',
                  closer: '#8B5CF6',
                };

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition"
                  >
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0"
                      style={{
                        backgroundColor: `${badgeColors[log.agentRole] || '#EA580C'}25`,
                        color: badgeColors[log.agentRole] || '#EA580C',
                      }}
                    >
                      {log.agentName}
                    </span>
                    <span className="text-slate-500 text-[10px] shrink-0 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span
                      className={`leading-relaxed ${
                        log.type === 'tool_call'
                          ? 'text-amber-300 font-bold'
                          : log.type === 'output'
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </MotionReveal>
    </div>
  );
};

export default AntigravitySwarmPanel;
