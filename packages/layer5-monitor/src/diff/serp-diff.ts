import {SerpDeltaSchema, type SerpDelta, type SerpSnapshot, } from "@rynk/layer5-monitor/schema";
import { readJson, createLogger } from "@rynk/core/utils"

import { readdir } from "node:fs/promises";
import path from "node:path";

const log = createLogger("layer5.serp-diff")

//added domain as an arg
//needs to be in format www.<domain name>.<extension>
export function computeSerpDelta(previous: SerpSnapshot, current: SerpSnapshot, domain: string): SerpDelta {

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
  
  
  const posChanges = current.results //take the current results
      .filter(curr =>
        previous.results.some(prev => prev.url === curr.url) //filter to get only the results that are in BOTH 
      )
      .map(curr => { //for each shared result in the current results
        const prev = previous.results.find(p => p.url === curr.url)! //get the previous posiiton

        return { //return the url, with the current and previous positions
          url: curr.url,
          from: prev.position,
          to: curr.position,
        }
      })
      .filter(change => change.from !== change.to) //get rid of all the shared results that did not change position

  
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
    let domainDrop = (currentPosition - prevPosition) >=3
    if(domainDrop) triggerReason = `Domain position dropped by ${currentPosition - prevPosition} `
  }

  if(brandNewInT3) triggerReason += "New URL in top 3."

  const raw = {
    keyword: previous.keyword,
    from: previous.takenAt,
    to: current.takenAt,
    newInTopTen: newInT10,
    droppedFromTopTen: droppedfromT10,
    positionChanges: posChanges, //only counts position changes within the top 10 -- probably an issue
    triggerRestrategy: (brandNewInT3 || domainDrop), //either true or false
    triggerReason: triggerReason //either a string or null
  }

  const serpDelta = SerpDeltaSchema.parse(raw)
  return serpDelta
}

//get the latest two objects
async function loadLastTwoSnapshots(keyword: string, runsDir: string): Promise<SerpSnapshot[]> { //returns 2 serpSnapshots
  const keywordDir = path.join(runsDir, keyword);

  const latestTwo = (await readdir(keywordDir)) //go through directory for runs/keyword
    .sort((a, b) => b.localeCompare(a)) // newest first
    .slice(0, 2);

  const latestTwoObjects = await Promise.all( //iterate through the two filefs
    latestTwo.map(file =>
      readJson<SerpSnapshot>(path.join(keywordDir, file)) //turn the JSON string into object of type Serp Snapshot
    )
  );

  return latestTwoObjects;
}