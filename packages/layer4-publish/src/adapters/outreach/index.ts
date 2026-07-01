/**
 * Outreach adapter — handles `draft_outreach` actions in the execution
 * manifest.
 *
 * For every draft_outreach action it receives:
 *   1. Assembles a minimal RFC 822 email (To + Subject + body)
 *   2. Writes the draft to disk as `{outputDir}/outreach/{outreachType}/{actionId}.eml`
 *   3. Returns an ApplyResult with the file path — the email is never sent
 *
 * Sub-categorised by outreachType (backlink-request, guest-post-pitch, etc.)
 * so the human team can browse drafts by campaign type.
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createLogger } from "@rynk/core";
import type { DraftOutreachAction, ExecutionAction } from "@rynk/layer3-generate";
import type { ActionAdapter, ApplyResult } from "../types.js";

const log = createLogger("layer4.outreach");

export interface OutreachAdapterConfig {
  /** Root directory for drafted artifacts (e.g. runs/{domain}/publish). */
  outputDir: string;
}

function buildToHeader(action: DraftOutreachAction): string {
  const { recipientDomain, recipientName } = action.target;
  const email = `contact@${recipientDomain.replace(/^www\./, "")}`;
  return recipientName ? `To: ${recipientName} <${email}>` : `To: ${email}`;
}

function buildEmlContent(action: DraftOutreachAction): string {
  return `${buildToHeader(action)}\nSubject: ${action.payload.subject}\n\n${action.payload.body}`;
}

export function makeOutreachAdapter(config: OutreachAdapterConfig): ActionAdapter {
  const { outputDir } = config;

  return {
    adapterName: "outreach",
    channel: "outreach",

    canHandle(action: ExecutionAction): boolean {
      return action.type === "draft_outreach";
    },

    async apply(action: ExecutionAction): Promise<ApplyResult> {
      if (action.type !== "draft_outreach") {
        return { status: "skipped", message: "Not a draft_outreach action" };
      }

      const draft = action as DraftOutreachAction;
      const dir = join(outputDir, "outreach", draft.target.outreachType);
      const filePath = join(dir, `${draft.id}.eml`);

      try {
        await mkdir(dir, { recursive: true });
        await writeFile(filePath, buildEmlContent(draft), "utf8");

        log.info("outreach draft written", {
          actionId: draft.id,
          outreachType: draft.target.outreachType,
          filePath,
        });

        return {
          status: "applied",
          externalUrl: filePath,
          message: `Draft saved to ${filePath}. Email was NOT sent — open the .eml file in your mail client to review and send.`,
        };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.error("outreach draft failed", { actionId: draft.id, error: msg });
        return { status: "failed", error: msg };
      }
    },
  };
}
