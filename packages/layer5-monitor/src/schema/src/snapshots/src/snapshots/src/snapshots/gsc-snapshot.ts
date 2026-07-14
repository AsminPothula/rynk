// Create a GscSnapshot interface that represents the data structure for a GSC snapshot.
export interface GscSnapshot {
  domain: string;
  weekStarting: string;
  impressions: number;
  clicks: number;
  avgPosition: number | null;
  topQueries: Array<{
    query: string;
    impressions: number;
    clicks: number;
    position: number | null;
  }>;
}

// Create a function that takes a domain, week starting date, and runs directory and returns a GscSnapshot.
export async function takeGscSnapshot(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<GscSnapshot> {
  void runsDir;
  return {
    domain,
    weekStarting,
    impressions: 0,
    clicks: 0,
    avgPosition: null,
    topQueries: [],
  };
}
