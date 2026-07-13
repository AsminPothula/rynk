import {SerpDeltaSchema, type SerpDelta, type SerpSnapshot, type RankSnapshot } from "@rynk/layer5-monitor/schema";
import { readJson, createLogger } from "@rynk/core/utils"

import { readdir } from "node:fs/promises";
import path from "node:path";

const log = createLogger("layer5.serp-diff")

//added domain as an arg
//needs to be in format www.<domain name>.<extension>
export function computeSerpDelta(previous: SerpSnapshot, current: SerpSnapshot, previousRankSnapshot: RankSnapshot, currentRankSnapshot: RankSnapshot, domain: string): SerpDelta {

  //filter all the current results and find results that were not in previous results
  const newInT10 = current.results
      .filter(result =>
        !previous.results.some(prev => prev.url === result.url)
      )
      .map(result => ({
        url: result.url,
        position: result.position,
      }))
  
  //filter all the previous results and find results that are not in current results
  const droppedfromT10 = previous.results
      .filter(result =>
        !current.results.some(curr => curr.url === result.url)
      )
      .map(result => ({
        url: result.url,
        position: result.position,
      }))
  
  //take the current results, track whether domain ranks have changed or not by comparing the lists
  const posChanges = current.results
  .filter(currentResult =>
    previous.results.some(
      previousResult => previousResult.url === currentResult.url,
    ),
  )
  .map(currentResult => {
    const previousResult = previous.results.find(
      result => result.url === currentResult.url,
    )!;

    return {
      url: currentResult.url,
      from: previousResult.position,
      to: currentResult.position,
    };
  })
  .filter(change => change.from !== change.to);

  //track the change in ranking for our domain (if both times our domain was in top 100)
  //Should be some logic in hre for entering the top 100. Maybe add later.
  let domainPosChange
  if(currentRankSnapshot.rank && previousRankSnapshot.rank) domainPosChange = currentRankSnapshot.rank - previousRankSnapshot.rank
  else domainPosChange = null

  
  //TRIGGER RESTRATEGY
  // //true if (a) a brand new URL is now in top 3, OR (b) our own domain dropped 3+ positions. 
  const newURLs = newInT10.map(newResult => newResult.url) 
  const brandNewInT3 = current.results.slice(0,3).some(result => newURLs.includes(result.url))
  
  //previous and current position of our domain - either numbers or null
  // only returns the first, edge case is that a domain may be on the SERP multiple times
  const prevPosition = previous.results.find(result => result.domain === domain)?.position ?? null
  const currentPosition = current.results.find(result => result.domain === domain)?.position ?? null

  let domainDrop = false
  let triggerReason = null

  if(prevPosition && currentPosition) {
    domainDrop = (currentPosition - prevPosition) >=3
    if(domainDrop) triggerReason = `Domain position dropped by ${currentPosition - prevPosition} `
  }

  if(brandNewInT3) triggerReason += "New URL in top 3."

  const raw = {
    keyword: previous.keyword,
    from: previous.takenAt,
    to: current.takenAt,
    newInTop10: newInT10,
    droppedFromTop10: droppedfromT10,
    positionChanges: posChanges, //pos changes of the top 10 URLs (if any)
    domainPositionChange: domainPosChange, //this is for our domain - //only counts if website was in top 100 before and after -- might be a problem
    triggerRestrategy: (brandNewInT3 || domainDrop), //either true or false
    triggerReason: triggerReason //either a string or null
  }

  const serpDelta = SerpDeltaSchema.parse(raw)
  return serpDelta
}

//get the latest serpSnapshot for this domain and this keyword
//if no previous serp snap shot (edge case), returns null
export async function loadLastSerpSnapshot(keyword: string,runsDir: string, domain: string,): Promise<SerpSnapshot | null> {
  const keywordDir = path.join(runsDir, domain, "monitor", "serp", keyword);

  const latest = (await readdir(keywordDir))
    .sort((a, b) => b.localeCompare(a)) // newest first
    .at(0);

  if (!latest) return null;

  return readJson<SerpSnapshot>(
    path.join(keywordDir, latest),
  );
}

//get the latest rankSnapshot for this domain and this keyword
//if no previous rank snap shot (edge case), returns null
export async function loadLastRankSnapshot(keyword: string,runsDir: string, domain: string,): Promise<RankSnapshot | null> {
  const keywordDir = path.join(runsDir, domain, "monitor", "rank", keyword);

  const latest = (await readdir(keywordDir))
    .sort((a, b) => b.localeCompare(a)) // newest first
    .at(0);

  if (!latest) return null;

  return readJson<RankSnapshot>(
    path.join(keywordDir, latest),
  );
}