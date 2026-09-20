import { useState, useEffect } from 'react';
import type { BusinessProfile } from '../types';
import { api } from '../api/client';
import { Bot, Terminal, Play, RefreshCw, Zap, MapPin, Search } from 'lucide-react';

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
        api.getAgentLogs()
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

      const leadToProcess = (discovered && discovered.length > 0) ? discovered[0] : selectedLead;
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
    <div className="space-y-8">
      {/* Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E0E3EF] shadow-card relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <p className="section-label">
            ANTIGRAVITY MULTI-AGENT SWARM ORCHESTRATOR
          </p>

          <h2 className="text-2xl sm:text-4xl font-outfit font-black text-[#1A2550] tracking-tight uppercase italic">
            Essaim d'Agents IA <span className="text-[#C41641]">Autonomes</span>
          </h2>

          <p className="text-sm text-[#6B7299] max-w-3xl leading-relaxed">
            Chaque phase du cycle de vie de l'agence est déléguée à un agent IA spécialisé : <strong>Scout</strong> (détection OSM/Maps en direct), <strong>Auditor</strong> (audit vision & UX), <strong>Architect</strong> (code React modulaire), <strong>DevOps</strong> (Cloudflare Anycast) et <strong>Closer</strong> (pitch WhatsApp & FeexPay).
          </p>
        </div>

        {/* Autopilot Mission Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 bg-[#F4F2EE] p-3 rounded-2xl border border-[#E0E3EF] w-full lg:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0E3EF] text-xs">
              <MapPin className="w-3.5 h-3.5 text-[#C41641]" />
              <select
                value={targetCity}
                onChange={(e) => setTargetCity(e.target.value)}
                className="bg-transparent font-outfit font-bold text-[#1A2550] focus:outline-none cursor-pointer"
              >
                <option value="Parakou">Parakou</option>
                <option value="Cotonou">Cotonou</option>
                <option value="Porto-Novo">Porto-Novo</option>
                <option value="Abidjan">Abidjan</option>
                <option value="Dakar">Dakar</option>
                <option value="Lomé">Lomé</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E0E3EF] text-xs">
              <Search className="w-3.5 h-3.5 text-[#1A2550]" />
              <select
                value={targetQuery}
                onChange={(e) => setTargetQuery(e.target.value)}
                className="bg-transparent font-outfit font-bold text-[#1A2550] focus:outline-none cursor-pointer"
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
            className="btn-primary text-xs !py-3 !px-5 !rounded-xl flex items-center justify-center gap-2 shrink-0 shadow-lg w-full sm:w-auto cursor-pointer"
            title="Détecter en direct puis exécuter le cycle complet (Scout ➔ Closer)"
          >
            {isRunningAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>{isRunningAll ? 'Mission en cours...' : 'Lancer Mission Autopilot'}</span>
          </button>

          {selectedLead && (
            <button
              onClick={handleRunAutonomousPipeline}
              disabled={isRunningAll}
              className="px-4 py-3 rounded-xl bg-white hover:bg-[#FAF9F6] border border-[#E0E3EF] text-[#1A2550] font-outfit font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer w-full sm:w-auto"
              title={`Exécuter les 4 phases sur le prospect actif : ${selectedLead.title}`}
            >
              <Play className="w-3.5 h-3.5 text-[#C41641]" />
              <span className="truncate max-w-[160px]">Pipeline : {selectedLead.title}</span>
            </button>
          )}
        </div>
      </div>

      {/* Agents Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agent: any) => {
          const isBusy = agent.state === 'THINKING' || agent.state === 'EXECUTING_TOOL';
          return (
            <div
              key={agent.role}
              className="p-5 rounded-3xl bg-white border border-[#E0E3EF] shadow-card space-y-4 hover:-translate-y-1 transition duration-300"
            >
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
                      ? 'bg-amber-100 text-amber-700 animate-pulse'
                      : agent.state === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-zinc-100 text-zinc-600'
                  }`}
                >
                  {agent.state}
                </span>
              </div>

              <div>
                <h4 className="font-outfit font-black text-sm text-[#1A2550] uppercase leading-tight">
                  {agent.name}
                </h4>
                <p className="text-[10px] text-[#C41641] font-mono font-bold mt-0.5">
                  {agent.title}
                </p>
                <p className="text-[11px] text-[#6B7299] line-clamp-2 mt-1.5 leading-relaxed">
                  {agent.description}
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0F1F5] flex items-center justify-between text-[10px] font-mono text-[#6B7299]">
                <span>Outils : {agent.tools.length}</span>
                <span className="font-bold text-[#1A2550]">{agent.tasksCompleted} tâches</span>
              </div>

              {/* Action button */}
              <button
                onClick={() => {
                  if (agent.role === 'scout') {
                    handleDispatch('scout', { query: 'peintre', location: 'Parakou' });
                  } else if (selectedLead) {
                    handleDispatch(agent.role, { leadId: selectedLead.id });
                  }
                }}
                className="w-full py-2 rounded-xl bg-[#F4F2EE] hover:bg-[#1A2550] hover:text-white text-[#1A2550] font-outfit font-bold text-[11px] uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3" />
                <span>Activer l'Agent</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Thinking Stream & Tools Console */}
      <div className="p-8 rounded-3xl bg-[#0F163A] border border-white/10 text-white space-y-4 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#C41641]" />
            </div>
            <div>
              <h4 className="font-outfit font-black text-sm uppercase text-white tracking-tight">
                Flux d'Exécution & Raisonnement (Live Agent Stream)
              </h4>
              <p className="text-[11px] font-mono text-zinc-400">
                Interception en temps réel des pensées, appels d'outils et sorties de l'essaim
              </p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5 Agents Connectés</span>
          </span>
        </div>

        <div className="font-mono text-xs text-zinc-300 space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar p-4 rounded-2xl bg-black/40 border border-white/5">
          {logs.length === 0 ? (
            <div className="text-zinc-500 italic py-8 text-center">
              Aucun événement dans le flux. Cliquez sur "Activer l'Agent" ou lancez le pipeline autonome.
            </div>
          ) : (
            logs.map((log: any, idx: number) => {
              const badgeColors: Record<string, string> = {
                scout: '#10B981',
                auditor: '#3B82F6',
                architect: '#C41641',
                devops: '#F97316',
                closer: '#8B5CF6'
              };

              return (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0"
                    style={{ backgroundColor: `${badgeColors[log.agentRole] || '#C41641'}25`, color: badgeColors[log.agentRole] || '#C41641' }}
                  >
                    {log.agentName}
                  </span>
                  <span className="text-zinc-400 text-[10px] shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  <span className={`leading-relaxed ${
                    log.type === 'tool_call' ? 'text-amber-300 font-bold' : log.type === 'output' ? 'text-emerald-400 font-bold' : 'text-zinc-200'
                  }`}>
                    {log.message}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
