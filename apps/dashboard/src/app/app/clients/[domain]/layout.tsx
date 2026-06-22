/**
 * Client-scoped layout — renders the sticky client context bar above the
 * page content. Every route under /app/clients/[domain]/* uses this layout
 * (overview, execution, content, offsite, etc.).
 *
 * Fetches the client context once here so the context bar can show the
 * legal entity name + domain without each child page having to fetch it
 * independently.
 */

import { notFound } from "next/navigation";
import { getDataStore } from "@/lib/data-store";
import { ClientContextBar } from "@/components/app/client-context-bar";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}): Promise<React.JSX.Element> {
  const { domain } = await params;
  const store = getDataStore();
  const overview = await store.getClientOverview(domain);
  if (!overview) notFound();

  return (
    <>
      <ClientContextBar
        domain={overview.context.domain}
        legalEntity={overview.context.legalEntity || null}
      />
      {/*
       * Negative margin compensates for the top-level <main> padding so the
       * context bar sits flush under the top bar.
       */}
      <div className="-mx-6 -mt-8">
        <div className="mx-auto max-w-screen-2xl px-6 py-8">{children}</div>
      </div>
    </>
  );
}
