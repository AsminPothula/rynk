export interface GaSnapshot {
  domain: string;
  weekStarting: string;
  sessions: number;
  conversions: number;
  topPages: Array<{
    url: string;
    sessions: number;
    conversions: number;
  }>;
}

export async function takeGaSnapshot(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<GaSnapshot> {
  void runsDir;
  return {
    domain,
    weekStarting,
    sessions: 0,
    conversions: 0,
    topPages: [],
  };
}
