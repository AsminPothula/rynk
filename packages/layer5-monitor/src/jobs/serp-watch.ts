import { type SerpDelta } from "@rynk/layer5-monitor/schema";
import { createLogger, writeJson } from "@rynk/core/utils"
import { ClientContext } from "@rynk/core";
import { takeSerpSnapshot, takeRankSnapshot } from "../snapshots/serp-snapshot.js";
import { loadLastRankSnapshot, loadLastSerpSnapshot, computeSerpDelta } from "../diff/serp-diff.js"
import { maybeTriggerRestrategy } from "../triggers/restrategy-trigger.js";
import { KeyObject } from "crypto";

const log = createLogger("layer5.serp-diff")

//runs the serp watch for a specific domain
export async function runSerpWatch(domain: string, clientContext: ClientContext, runsDir: string, limitWatch: boolean = false): Promise<{ deltas: SerpDelta[]; restrategiesTriggered: number }> {
    
    let allDeltas: SerpDelta[] = []
    let numRestrats = 0

    //for testing
    if(limitWatch) {
        clientContext.seedKeywords = clientContext.seedKeywords.slice(0,2)
        log.info(`Limiting SERP Watch to the following keywords: ${clientContext.seedKeywords}`)
    }

    //let's loop through each keyword the client wants to target
    //doc says targetKeywords -- asuming seedKeywords is what it meant to say
    for(let keyword of clientContext.seedKeywords) { //for each keyword:
        let lastSerp
        let lastRank

        //try to get any previous snapshots
        try {
            lastSerp = await loadLastSerpSnapshot(keyword, runsDir, domain) 
            lastRank = await loadLastRankSnapshot(keyword, runsDir, domain)
        }
        catch(err) { //(maybe some "your analsyis not ready yet" screen)
            const error = err as NodeJS.ErrnoException;
            if(error.code === "ENOENT") { //file not found
                log.info(`No snapshot folder exists for keyword: "${keyword}". Making it now.`)
                await takeSerpSnapshot(domain, keyword, runsDir)
                await takeRankSnapshot(domain, keyword, runsDir)
                continue
            }
        }
        

        //take new serp and rank snapshots for each keyword
        //should get top 10 for this keyword + rank of client's domain for this keyword (if top 100)
        const { serpSnapshot: newSerp } = await takeSerpSnapshot(domain, keyword, runsDir)
        const { rankSnapshot: newRank } = await takeRankSnapshot(domain, keyword, runsDir)

        //before computing delta, see if we have at least 2 rank and serp snapshots
        //if it doesn't work we could have some type of "your analysis isn't yet ready" screen
        if(!lastSerp) continue

        if(!lastRank) continue 

        //if we have at least two serp and rank snapshots, now we can compute delta
        const delta = computeSerpDelta(lastSerp, newSerp, lastRank, newRank, domain)
        allDeltas.push(delta) //any deltas are stored here
        
        //save the delta under today's date
        const date = new Date().toISOString().split("T")[0];
        writeJson(`${runsDir}/${domain}/${date}/monitor/delta/${new Date().toISOString().replace(/:/g, "-")}.json`, delta)

    }

    // One re-strategy per run covering all the movement — not one per keyword
    // (each re-strategy is an expensive Layer 2 LLM call).
    const { triggered } = await maybeTriggerRestrategy(allDeltas, clientContext, runsDir)
    if (triggered) numRestrats++

    log.info("Finished Serp Watch")

    return { deltas: allDeltas, restrategiesTriggered: numRestrats }

}
