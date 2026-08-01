export interface InactivityTimerConfig {
  /** Total inactivity duration before auto-logout (ms) */
  timeoutMs: number;
  /** How long before logout the warning popup appears (ms) */
  warningMs: number;
  /** DOM events that count as user activity */
  activityEvents?: string[];
  /** Set false to disable the entire feature */
  enabled?: boolean;
}
