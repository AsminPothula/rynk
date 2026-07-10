import { type SerpDelta } from "@rynk/layer5-monitor/schema";
import { createLogger, writeJson } from "@rynk/core/utils"
import { ClientContext } from "@rynk/core";
import { takeSerpSnapshot, takeRankSnapshot } from "../snapshots/serp-snapshot.js";
import { loadLastTwoSnapshots, computeSerpDelta } from "../diff/serp-diff.js"
import { maybeTriggerRestrategy } from "../triggers/restrategy-trigger.js";

const log = createLogger("layer5.serp-diff")

//runs the serp watch for a specific domain
export async function runSerpWatch(domain: string, clientContext: ClientContext, runsDir: string): Promise<{ deltas: SerpDelta[]; restrategiesTriggered: number }> {
    
    let allDeltas: SerpDelta[] = []
    let numRestrats = 0

    //let's loop through each keyword the client wants to target
    //doc says targetKeywords -- asuming seedKeywords is what it meant to say
    for(let keyword of clientContext.seedKeywords) { //for each keyword:

        //take the serp and rank snapshots for each keyword
        //should get top 10 for each keyword + rank of client's domain for each keyword
        const { serpSnapshot: serpSnapshot, location: serpSnapshotLocation } = await takeSerpSnapshot(domain, keyword, runsDir)
        const { rankSnapshot: rankSnapshot, location: rankSnapshotLocation } = await takeRankSnapshot(domain, keyword, runsDir)

        const lastTwoSnapshots = await loadLastTwoSnapshots(keyword, runsDir, domain) // tuple [older, newer]
        if(!lastTwoSnapshots) continue //if not enough snapshots on this keyword
        
        //if we have at least two snapshots, now we can compute delta
        const [previous, current] = lastTwoSnapshots
        const delta = computeSerpDelta(previous, current, domain)
        allDeltas.push(delta) //any deltas are stored here
        
        //save the delta
        writeJson(`runsDir/${domain}/monitor/delta/${new Date().toISOString()}.json`, delta)

        //maybe trigger restrategy
        //seems like overkill to run the restrategy after every keyword -- should figure out a better way
        const {triggered,runId} = await maybeTriggerRestrategy(delta, clientContext, runsDir)

        // if the delta leads to restrat, add to number of resetrats
        if(triggered) numRestrats += 1
    }
    return { deltas: allDeltas, restrategiesTriggered: numRestrats }
}