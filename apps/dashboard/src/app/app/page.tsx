/**
 * App home — currently shows the clients list since we don't have auth
 * yet (no "current user" to focus on). When auth + multi-tenancy lands,
 * this route becomes the user's own dashboard and the list moves to
 * /admin/clients.
 */

import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCount, formatDate } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppHomePage(): Promise<React.JSX.Element> {
  const store = getDataStore();
  const clients = await store.listClients();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {clients.length === 0
            ? "No clients yet. Run the pipeline against a domain to create one."
            : `${clients.length} ${clients.length === 1 ? "client" : "clients"} onboarded.`}
        </p>
      </div>

      {clients.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link key={client.domain} href={`/app/clients/${client.domain}`} className="group">
              <Card className="transition-colors hover:border-foreground/20">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{client.legalEntity ?? client.domain}</CardTitle>
                      <CardDescription className="font-mono text-xs">{client.domain}</CardDescription>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {client.industry && (
                      <Badge variant="secondary">{client.industry}</Badge>
                    )}
                    {client.latestDAScore !== null && (
                      <Badge variant="outline">DA {client.latestDAScore}</Badge>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <Stat label="Latest run" value={formatDate(client.latestRunDate)} />
                    <Stat
                      label="Actions"
                      value={
                        client.latestActionCount !== null
                          ? formatCount(client.latestActionCount)
                          : "—"
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 font-mono">{value}</div>
    </div>
  );
}
