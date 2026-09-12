import { AgentRole, AgentState, AgentActionLog, AgentStatusInfo } from './types.js';
import { ScoutAgent } from './ScoutAgent.js';
import { AuditorAgent } from './AuditorAgent.js';
import { ArchitectAgent } from './ArchitectAgent.js';
import { DevOpsAgent } from './DevOpsAgent.js';
import { CloserAgent } from './CloserAgent.js';

class AntigravitySwarmOrchestrator {
  private logs: AgentActionLog[] = [];
  private agentsInfo: Record<AgentRole, AgentStatusInfo> = {
    scout: {
      role: 'scout',
      name: ScoutAgent.name,
      title: ScoutAgent.title,
      description: ScoutAgent.description,
      avatarColor: '#10B981', // emerald
      state: 'IDLE',
      tools: ScoutAgent.tools,
      tasksCompleted: 14
    },
    auditor: {
      role: 'auditor',
      name: AuditorAgent.name,
      title: AuditorAgent.title,
      description: AuditorAgent.description,
      avatarColor: '#3B82F6', // blue
      state: 'IDLE',
      tools: AuditorAgent.tools,
      tasksCompleted: 11
    },
    architect: {
      role: 'architect',
      name: ArchitectAgent.name,
      title: ArchitectAgent.title,
      description: ArchitectAgent.description,
      avatarColor: '#C41641', // crimson (signature)
      state: 'IDLE',
      tools: ArchitectAgent.tools,
      tasksCompleted: 8
    },
    devops: {
      role: 'devops',
      name: DevOpsAgent.name,
      title: DevOpsAgent.title,
      description: DevOpsAgent.description,
      avatarColor: '#F97316', // orange (cloudflare)
      state: 'IDLE',
      tools: DevOpsAgent.tools,
      tasksCompleted: 8
    },
    closer: {
      role: 'closer',
      name: CloserAgent.name,
      title: CloserAgent.title,
      description: CloserAgent.description,
      avatarColor: '#8B5CF6', // purple
      state: 'IDLE',
      tools: CloserAgent.tools,
      tasksCompleted: 6
    }
  };

  private addLog(log: AgentActionLog) {
    this.logs.unshift(log);
    if (this.logs.length > 200) this.logs.pop();
  }

  getAgentsStatus(): AgentStatusInfo[] {
    return Object.values(this.agentsInfo);
  }

  getRecentLogs(limit = 40): AgentActionLog[] {
    return this.logs.slice(0, limit);
  }

  setAgentState(role: AgentRole, state: AgentState, currentTask?: string) {
    if (this.agentsInfo[role]) {
      this.agentsInfo[role].state = state;
      this.agentsInfo[role].currentTask = currentTask;
      if (state === 'COMPLETED') {
        this.agentsInfo[role].tasksCompleted += 1;
      }
    }
  }

  /**
   * Déléguer une tâche spécifique à un agent IA autonome
   */
  async dispatchTask(role: AgentRole, payload: any): Promise<any> {
    const logCallback = (log: AgentActionLog) => this.addLog(log);

    this.setAgentState(role, 'THINKING', payload.title || 'Exécution de tâche');
    this.addLog({
      id: `log-${Date.now()}-init`,
      agentRole: role,
      agentName: this.agentsInfo[role].name,
      timestamp: new Date().toISOString(),
      type: 'system',
      message: `[Antigravity Swarm] Tâche confiée à l'agent ${this.agentsInfo[role].name}.`
    });

    try {
      let result;
      switch (role) {
        case 'scout':
          result = await ScoutAgent.execute({
            query: payload.query || 'artisan',
            location: payload.location || 'Parakou',
            logFn: logCallback
          });
          break;
        case 'auditor':
          result = await AuditorAgent.execute({
            leadId: payload.leadId,
            logFn: logCallback
          });
          break;
        case 'architect':
          result = await ArchitectAgent.execute({
            leadId: payload.leadId,
            logFn: logCallback
          });
          break;
        case 'devops':
          result = await DevOpsAgent.execute({
            leadId: payload.leadId,
            customDomain: payload.customDomain,
            logFn: logCallback
          });
          break;
        case 'closer':
          result = await CloserAgent.execute({
            leadId: payload.leadId,
            action: payload.action || 'pitch',
            phoneNumber: payload.phoneNumber,
            network: payload.network,
            logFn: logCallback
          });
          break;
      }

      this.setAgentState(role, 'COMPLETED');
      return result;
    } catch (err: any) {
      this.setAgentState(role, 'ERROR');
      this.addLog({
        id: `log-${Date.now()}-err`,
        agentRole: role,
        agentName: this.agentsInfo[role].name,
        timestamp: new Date().toISOString(),
        type: 'system',
        message: `Erreur d'exécution : ${err.message}`
      });
      throw err;
    }
  }
}

export const SwarmOrchestrator = new AntigravitySwarmOrchestrator();
