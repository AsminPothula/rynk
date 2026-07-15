/**
 * /app/run/[domain] — the review → run → done flow for a triggered pipeline.
 * Thin server wrapper; the interactive experience is the RunFlow client
 * component.
 */

import { RunFlow } from "./RunFlow";

export default async function RunPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}): Promise<React.JSX.Element> {
  const { domain } = await params;
  return (
    <div className="min-h-screen bg-brand-ink text-brand-text">
      <RunFlow domain={decodeURIComponent(domain)} />
    </div>
  );
}
