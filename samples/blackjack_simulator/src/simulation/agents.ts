export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  playerThreshold?: number;
}

export const defaultAgents: AgentConfig[] = [
  {
    id: 'fixed_20',
    name: 'Hit until 20',
    type: 'fixed_threshold',
    playerThreshold: 20
  }
];
