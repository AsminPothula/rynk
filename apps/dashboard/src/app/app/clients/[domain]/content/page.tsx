/**
 * /app/content — content drafts browser.
 *
 * Lists every `create_page` action from the manifest with title, slug,
 * page type, body length, image link count. Expanding a row reveals the
 * full markdown body (rendered as a plain prose-like block — no
 * markdown-to-HTML conversion yet; that's a future polish).
 *
 * Page-type filter pills in the URL search params.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { cn, formatCount } from "@/lib/utils";
import type {
  CreatePageAction,
  ExecutionAction,
} from "@rynk/layer3-generate";

export const dynamic = "force-dynamic";

const PAGE_TYPES = ["pillar", "spoke", "blog", "landing", "policy", "author"] as const;
type PageType = (typeof PAGE_TYPES)[number] | "all";

interface PageProps {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function ContentPage({ params, searchParams }: PageProps): Promise<React.JSX.Element> {
  const { domain } = await params;
  const { type } = await searchParams;

  const store = getDataStore();
  const overview = await store.getClientOverview(domain);
  if (!overview || !overview.latestManifest) return notFound();

  const pages = overview.latestManifest.actions.filter(isCreatePage);

  const activeType: PageType = (type as PageType | undefined) ?? "all";
  const visible = activeType === "all" ? pages : pages.filter((p) => p.target.pageType === activeType);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Content
        </p>
        <h1 className="mt-1 text-3xl font-medium tracking-tight">
          {formatCount(pages.length)} pages planned
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ready for review before publishing.
        </p>
      </div>

      {/* Page-type filter */}
      <div className="flex flex-wrap items-center gap-1.5 -mt-2">
        <TypeTab domain={domain} type="all" label="All" count={pages.length} isActive={activeType === "all"} />
        {PAGE_TYPES.map((t) => {
          const count = pages.filter((p) => p.target.pageType === t).length;
          if (count === 0) return null;
          return (
            <TypeTab
              key={t}
              domain={domain}
              type={t}
              label={t}
              count={count}
              isActive={activeType === t}
            />
          );
        })}
      </div>

      {/* Pages list */}
      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center text-sm text-muted-foreground">
          No content drafts in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((page) => (
            <PageCard key={page.id} page={page} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Type guard ──────────────────────────────────────────────────────────

function isCreatePage(a: ExecutionAction): a is CreatePageAction {
  return a.type === "create_page";
}

// ── Tab pill ────────────────────────────────────────────────────────────

function TypeTab({
  domain,
  type,
  label,
  count,
  isActive,
}: {
  domain: string;
  type: PageType;
  label: string;
  count: number;
  isActive: boolean;
}): React.JSX.Element {
  const href =
    type === "all"
      ? `/app/clients/${domain}/content`
      : `/app/clients/${domain}/content?type=${type}`;
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm capitalize transition-colors",
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
      )}
    >
      {label}
      <span className={cn("font-mono text-xs", isActive ? "opacity-80" : "text-muted-foreground/70")}>
        {formatCount(count)}
      </span>
    </Link>
  );
}

// ── Page card ───────────────────────────────────────────────────────────

function PageCard({ page }: { page: CreatePageAction }): React.JSX.Element {
  const wordCount = estimateWordCount(page.payload.bodyMarkdown);
  const isSkeleton = page.payload.bodyMarkdown.includes("**Outline only.**");

  return (
    <details className="group rounded-lg border border-border/60 overflow-hidden">
      <summary className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <PageTypeChip type={page.target.pageType} />
            <span className="font-mono text-[11px] text-muted-foreground truncate">
              {page.target.slug}
            </span>
          </div>
          <h3 className="font-medium text-base truncate">{page.payload.title}</h3>
          {page.payload.metaDescription && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
              {page.payload.metaDescription}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 whitespace-nowrap">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-muted-foreground">{formatCount(wordCount)} words</span>
            {page.payload.imageActionIds.length > 0 && (
              <span className="text-muted-foreground">{page.payload.imageActionIds.length} images</span>
            )}
          </div>
          {isSkeleton && (
            <span className="rounded-full bg-status-pending/15 text-status-pending px-2 py-0.5 text-[10px] font-medium">
              outline only
            </span>
          )}
        </div>
      </summary>

      {/* Expanded body */}
      <div className="border-t border-border/60 bg-muted/20 px-5 py-5 space-y-5">
        {page.payload.outline && page.payload.outline.length > 0 && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Outline
            </div>
            <ol className="space-y-1.5 text-sm">
              {page.payload.outline.map((section, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-muted-foreground select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="font-medium">{section.heading}</div>
                    <div className="text-xs text-muted-foreground">{section.purpose}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Body markdown
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {formatCount(page.payload.bodyMarkdown.length)} chars
            </span>
          </div>
          <pre className="rounded-md border border-border/60 bg-background p-4 font-mono text-[11px] leading-relaxed text-foreground/90 max-h-96 overflow-auto whitespace-pre-wrap">
            {page.payload.bodyMarkdown}
          </pre>
        </div>

        {page.payload.imageActionIds.length > 0 && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Linked images
            </div>
            <div className="flex flex-wrap gap-1.5">
              {page.payload.imageActionIds.map((id) => (
                <span
                  key={id}
                  className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}

function PageTypeChip({ type }: { type: CreatePageAction["target"]["pageType"] }): React.JSX.Element {
  return (
    <span className="rounded-full bg-channel-cms/15 text-channel-cms px-2 py-0.5 text-[10px] font-medium capitalize">
      {type}
    </span>
  );
}

function estimateWordCount(markdown: string): number {
  return markdown
    .replace(/[#>`*_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}
