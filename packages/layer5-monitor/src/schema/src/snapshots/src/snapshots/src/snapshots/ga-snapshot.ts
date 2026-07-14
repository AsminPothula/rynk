// Create a GaSnapshot interface that represents the data structure for a GA snapshot.
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

//Create a function that takes a domain, week starting date, and runs directory and returns a GaSnapshot.
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
