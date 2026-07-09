export interface WeeklyDigest {
  domain: string;
  weekStarting: string;
  rankGains: string[];
  rankLosses: string[];
  newCompetitors: string[];
  gscTrend: "up" | "down" | "flat";
  gaTrend: "up" | "down" | "flat";
  daChange: number | null;
  backlinkChange: { gained: number; lost: number };
  actionsRecommended: string[];
}

export async function buildWeeklyDigest(
  domain: string,
  weekStarting: string,
  runsDir: string,
): Promise<WeeklyDigest> {
  void runsDir;
  return {
    domain,
    weekStarting,
    rankGains: [],
    rankLosses: [],
    newCompetitors: [],
    gscTrend: "flat",
    gaTrend: "flat",
    daChange: null,
    backlinkChange: { gained: 0, lost: 0 },
    actionsRecommended: [],
  };
}
