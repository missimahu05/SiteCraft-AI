export type AgentRole = 'scout' | 'auditor' | 'architect' | 'devops' | 'closer';

export type AgentState = 'IDLE' | 'THINKING' | 'EXECUTING_TOOL' | 'COMPLETED' | 'ERROR';

export interface AgentActionLog {
  id: string;
  agentRole: AgentRole;
  agentName: string;
  timestamp: string;
  type: 'thought' | 'tool_call' | 'tool_result' | 'system' | 'output';
  message: string;
  metadata?: Record<string, any>;
}

export interface AgentStatusInfo {
  role: AgentRole;
  name: string;
  title: string;
  description: string;
  avatarColor: string;
  state: AgentState;
  currentTask?: string;
  tools: string[];
  tasksCompleted: number;
}
