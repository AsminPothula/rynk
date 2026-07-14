import { runSerpWatch } from "../src/jobs/serp-watch.js"
import { readJson, ClientContext, createLogger } from "@rynk/core"
import { Logger } from "@rynk/core"
import { RankSnapshot, SerpSnapshot } from "../src/schema/index.js"


const log = createLogger('layer5.run.ts')

const DOMAIN = "itechdata.ai"
const RUNS_DIR = "../../runs"

const CLIENT_CONTEXT = readJson<ClientContext>(`${RUNS_DIR}/${DOMAIN}/client.json`)


await runSerpWatch(DOMAIN, CLIENT_CONTEXT, RUNS_DIR, true)
