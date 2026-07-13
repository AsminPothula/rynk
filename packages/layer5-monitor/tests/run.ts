import { runSerpWatch } from "../src/jobs/serp-watch.js"
import { readJson, ClientContext } from "@rynk/core"


const DOMAIN = "itechdata.ai"
const RUNS_DIR = "../../runs"

const CLIENT_CONTEXT = readJson<ClientContext>(`${RUNS_DIR}/${DOMAIN}/client.json`)


runSerpWatch(DOMAIN, CLIENT_CONTEXT, RUNS_DIR, true)
