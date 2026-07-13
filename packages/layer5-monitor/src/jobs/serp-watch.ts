import { type SerpDelta } from "@rynk/layer5-monitor/schema";
import { createLogger, writeJson } from "@rynk/core/utils"
import { ClientContext } from "@rynk/core";
import { takeSerpSnapshot, takeRankSnapshot } from "../snapshots/serp-snapshot.js";
import { loadLastRankSnapshot, loadLastSerpSnapshot, computeSerpDelta } from "../diff/serp-diff.js"
import { maybeTriggerRestrategy } from "../triggers/restrategy-trigger.js";

const log = createLogger("layer5.serp-diff")

//runs the serp watch for a specific domain
export async function runSerpWatch(domain: string, clientContext: ClientContext, runsDir: string): Promise<{ deltas: SerpDelta[]; restrategiesTriggered: number }> {
    
    let allDeltas: SerpDelta[] = []
    let numRestrats = 0

    //let's loop through each keyword the client wants to target
    //doc says targetKeywords -- asuming seedKeywords is what it meant to say
    for(let keyword of clientContext.seedKeywords) { //for each keyword:

        //try to get any previous snapshots
        //(maybe some "your analsyis not ready yet" screen)
        const lastSerp = await loadLastSerpSnapshot(keyword, runsDir, domain) 
        const lastRank = await loadLastRankSnapshot(keyword, runsDir, domain)
        

        //take new serp and rank snapshots for each keyword
        //should get top 10 for this keyword + rank of client's domain for this keyword (if top 100)
        const { serpSnapshot: newSerp, location: serpSnapshotLocation } = await takeSerpSnapshot(domain, keyword, runsDir)
        const { rankSnapshot: newRank, location: rankSnapshotLocation } = await takeRankSnapshot(domain, keyword, runsDir)


        //before computing delta, see if we have at leasat 2 rank and serp snapshots
        //if it doesn't work we could have some type of "your analysis isn't yet ready" screen
        if(!lastSerp) continue //if not enough snapshots on this keyword
        if(!lastRank) continue //if not enough rank snapshots

        //if we have at least two serp and rank snapshots, now we can compute delta
        const delta = computeSerpDelta(lastSerp, newSerp, lastRank, newRank, domain)
        allDeltas.push(delta) //any deltas are stored here
        
        //save the delta
        writeJson(`runsDir/${domain}/monitor/delta/${new Date().toISOString().replace(/:/g, "-")}.json`, delta)

        //maybe trigger restrategy
        //seems like overkill to run the restrategy after every keyword -- should figure out a better way
        const {triggered,runId} = await maybeTriggerRestrategy(delta, clientContext, runsDir)

        // if the delta leads to restrategy, add to number of resetrats
        if(triggered) numRestrats++
    }
    return { deltas: allDeltas, restrategiesTriggered: numRestrats }
}