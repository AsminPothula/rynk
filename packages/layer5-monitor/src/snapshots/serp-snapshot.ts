import { SerpSnapshotSchema, RankSnapshotSchema, type SerpSnapshot, type RankSnapshot, } from "@rynk/layer5-monitor/schema";
import { makeSerpApiClient } from "@rynk/layer1-audit"
import { writeJson, createLogger } from "@rynk/core/utils"

const log = createLogger("layer5.serp-snapshot")


//make the client
const client = makeSerpApiClient(process.env.SERPAPI_API_KEY);


//Returns in format of SerpSnapshotSchema 
//format:
export async function takeSerpSnapshot(domain: string, keyword: string, runsDir: string): Promise<SerpSnapshot> {
  const result = await client.search(keyword);

  const raw = {
    domain: domain,
    keyword: keyword,
    takenAt: new Date().toISOString(),
    results: result.topResults,
  };

  const serpSnapshot = SerpSnapshotSchema.parse(raw);

  const fileName = `${raw.takenAt.replace(/:/g, "-")}.json`;
  writeJson(`${runsDir}/${domain}/monitor/serp/${keyword}/${fileName}`, serpSnapshot);

  return serpSnapshot;
}

//Returns in format of RankSnapshotSchema
//the user's domain format needs to www.name.extension -- Eg: www.itechdata.ai
//returns null if the domain name isn't in the top 100
export async function takeRankSnapshot(keyword: string, domain: string, runsDir: string): Promise<RankSnapshot> {
  const result = await client.search(keyword, undefined, 100);

  const position =
    result.topResults.find(r => {
      const resultDomain = new URL(r.url).hostname;
      return resultDomain === domain;
    })?.position ?? null;

  const raw = {
    keyword,
    takenAt: new Date().toISOString(),
    rank: position,
    ai_engine: "google",
  };

  const rankSnapshot = RankSnapshotSchema.parse(raw);

  const fileName = `${raw.takenAt.replace(/:/g, "-")}.json`;
  writeJson(`${runsDir}/${domain}/monitor/rank/${fileName}`, rankSnapshot);

  return rankSnapshot;
}


