/**
 * ActionRationale - small visual panel that shows "what this is" and
 * "why it helps the client" for a single ExecutionAction.
 *
 * Used inside expanded action rows on the Execution, Content, and
 * Outreach tabs so the team (and the client during a demo) can
 * understand the rationale without SEO jargon.
 */

import { Lightbulb, Target } from "lucide-react";
import type { ExecutionAction } from "@rynk/layer3-generate";
import { explainAction } from "@/lib/action-explanations";

interface ActionRationaleProps {
  action: ExecutionAction;
  /** Compact variant - smaller padding, used in tight lists. */
  compact?: boolean;
}

export function ActionRationale({ action, compact }: ActionRationaleProps): React.JSX.Element {
  const { what, whyItHelps } = explainAction(action);
  return (
    <div
      className={
        compact
          ? "rounded-md border border-border/60 bg-cream/40 p-3 space-y-2"
          : "rounded-md border border-border/60 bg-cream/40 p-4 space-y-3"
      }
    >
      <div className="flex items-start gap-2">
        <Target className="h-3.5 w-3.5 text-foreground/60 mt-0.5 shrink-0" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
            What this is
          </p>
          <p className="text-sm leading-relaxed">{what}</p>
        </div>
      </div>
      <div className="flex items-start gap-2">
        <Lightbulb className="h-3.5 w-3.5 text-foreground/60 mt-0.5 shrink-0" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
            Why this helps
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">{whyItHelps}</p>
        </div>
      </div>
    </div>
  );
}
