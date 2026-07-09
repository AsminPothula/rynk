export interface RankSnapshot {
  domain: string;
  keyword: string;
  takenAt: string;
  rank: number | null;
  ai_engine: "google" | "chatgpt" | "perplexity";
}

export async function takeRankSnapshot(
  domain: string,
  keywords: string[],
  runsDir: string,
): Promise<RankSnapshot[]> {
  void runsDir;
  void keywords;
  return [];
}
