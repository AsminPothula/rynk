/**
 * Execution manifest viewer - /app/clients/[domain]/execution
 *
 * Direct category navigation:
 *
 *   All . CMS . Content . Outreach . Social . Code . Documents
 *
 * Each category is purpose-based (not channel-based) so the team can
 * jump straight to the work that matters to their role:
 *
 *   - CMS        - schema, redirects, NAP, authors, profiles
 *   - Content    - new pages, page rewrites, images
 *   - Outreach   - email outreach (backlink, guest, HARO, etc.)
 *   - Social     - brand posts on LinkedIn / Reddit / Threads / etc.
 *   - Code       - GitHub pull requests for code-level fixes
 *   - Documents  - PDF / PPTX whitepapers and decks
 *
 * Inside each category, a sidebar sub-filter narrows to specific action
 * types (e.g. inside Content: New pages / Page rewrites / Images).
 *
 * Server-rendered. URL search params drive state:
 *   - view   = category (default "all")
 *   - filter = sub-type within view (default "all")
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDataStore } from "@/lib/data-store";
import { cn, formatCount } from "@/lib/utils";
import { ActionRow } from "./action-row";
import type { ExecutionAction } from "@rynk/layer3-generate";

export const dynamic = "force-dynamic";

// ── Category model ──────────────────────────────────────────────────────

type Category = "all" | "cms" | "content" | "outreach" | "social" | "code" | "documents";

interface CategoryDef {
  value: Category;
  label: string;
  /** Returns true if this action belongs in the category. */
  match: (a: ExecutionAction) => boolean;
  /** Sub-filters shown in the sidebar when this category is active. */
  subFilters: Array<{
    value: string;
    label: string;
    match: (a: ExecutionAction) => boolean;
  }>;
}

const CATEGORIES: CategoryDef[] = [
  {
    value: "all",
    label: "All",
    match: () => true,
    subFilters: [],
  },
  {
    value: "cms",
    label: "CMS",
    match: (a) =>
      a.type === "inject_schema" ||
      a.type === "add_redirect" ||
      a.type === "add_nap_block" ||
      a.type === "create_author" ||
      a.type === "assign_author" ||
      a.type === "update_offsite_profile",
    subFilters: [
      { value: "schema", label: "Schema", match: (a) => a.type === "inject_schema" },
      { value: "redirects", label: "Redirects", match: (a) => a.type === "add_redirect" },
      { value: "nap", label: "NAP", match: (a) => a.type === "add_nap_block" },
      {
        value: "authors",
        label: "Authors",
        match: (a) => a.type === "create_author" || a.type === "assign_author",
      },
      { value: "profiles", label: "Profiles", match: (a) => a.type === "update_offsite_profile" },
    ],
  },
  {
    value: "content",
    label: "Content",
    match: (a) =>
      a.type === "create_page" ||
      a.type === "update_page" ||
      a.type === "update_meta" ||
      a.type === "insert_internal_link" ||
      a.type === "create_image",
    subFilters: [
      {
        value: "new-pages",
        label: "New pages",
        match: (a) => a.type === "create_page" || a.type === "update_page",
      },
      {
        value: "rewrites",
        label: "Page rewrites",
        match: (a) => a.type === "update_meta" || a.type === "insert_internal_link",
      },
      { value: "images", label: "Images", match: (a) => a.type === "create_image" },
    ],
  },
  {
    value: "outreach",
    label: "Outreach",
    match: (a) => a.type === "draft_outreach",
    subFilters: [
      {
        value: "backlink",
        label: "Backlink",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "backlink-request",
      },
      {
        value: "guest",
        label: "Guest pitch",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "guest-post-pitch",
      },
      {
        value: "haro",
        label: "HARO",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "haro-response",
      },
      {
        value: "podcast",
        label: "Podcast",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "podcast-pitch",
      },
      {
        value: "press",
        label: "Press",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "press-pitch",
      },
      {
        value: "partnership",
        label: "Partnership",
        match: (a) => a.type === "draft_outreach" && a.target.outreachType === "partnership",
      },
    ],
  },
  {
    value: "social",
    label: "Social",
    match: (a) => a.type === "draft_brand_post",
    subFilters: [
      {
        value: "linkedin",
        label: "LinkedIn",
        match: (a) => a.type === "draft_brand_post" && a.target.platform === "linkedin",
      },
      {
        value: "reddit",
        label: "Reddit",
        match: (a) => a.type === "draft_brand_post" && a.target.platform === "reddit",
      },
      {
        value: "threads",
        label: "Threads",
        match: (a) => a.type === "draft_brand_post" && a.target.platform === "threads",
      },
      {
        value: "twitter",
        label: "Twitter",
        match: (a) => a.type === "draft_brand_post" && a.target.platform === "twitter",
      },
      {
        value: "blog",
        label: "Blog",
        match: (a) => a.type === "draft_brand_post" && a.target.platform === "blog",
      },
    ],
  },
  {
    value: "code",
    label: "Code",
    match: (a) => a.type === "propose_code_change",
    subFilters: [],
  },
  {
    value: "documents",
    label: "Documents",
    match: (a) => a.type === "create_document",
    subFilters: [
      {
        value: "pdf",
        label: "PDF",
        match: (a) => a.type === "create_document" && a.target.format === "pdf",
      },
      {
        value: "pptx",
        label: "PPTX",
        match: (a) => a.type === "create_document" && a.target.format === "pptx",
      },
    ],
  },
];

/** Dot color per category - matches the existing channel palette. */
const CATEGORY_DOT: Record<Exclude<Category, "all">, string> = {
  cms: "bg-channel-cms",
  content: "bg-channel-image",
  outreach: "bg-channel-outreach",
  social: "bg-channel-social",
  code: "bg-channel-code-pr",
  documents: "bg-channel-document",
};

// ── Page ────────────────────────────────────────────────────────────────

interface PageProps {
  params: Promise<{ domain: string }>;
  searchParams: Promise<{ view?: string; filter?: string }>;
}

export default async function ExecutionPage({
  params,
  searchParams,
}: PageProps): Promise<React.JSX.Element> {
  const { domain } = await params;
  const { view, filter } = await searchParams;

  const store = getDataStore();
  const overview = await store.getClientOverview(domain);
  if (!overview || !overview.latestManifest) return notFound();

  const manifest = overview.latestManifest;
  const allActions = manifest.actions;

  // Resolve active category.
  const activeView = (view as Category | undefined) ?? "all";
  const category = CATEGORIES.find((c) => c.value === activeView) ?? CATEGORIES[0]!;

  // Resolve active sub-filter.
  const activeFilter = filter ?? "all";
  const subFilter = category.subFilters.find((f) => f.value === activeFilter);

  // Filter actions.
  const categoryActions = allActions.filter(category.match);
  const visibleActions =
    activeFilter === "all" || !subFilter
      ? categoryActions
      : categoryActions.filter(subFilter.match);

  return (
    <div className="space-y-6 pt-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-medium tracking-tight">
          {formatCount(manifest.summary.totalActions)} planned actions
        </h1>
        <p className="mt-2 text-xs text-muted-foreground font-mono">
          {manifest.summary.automatable} automatable · {manifest.summary.totalActions - manifest.summary.automatable} need approval
        </p>
      </div>

      {/* Top category tabs - colored pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {CATEGORIES.map((cat) => {
          const count = allActions.filter(cat.match).length;
          const isActive = cat.value === activeView;
          const href =
            cat.value === "all"
              ? `/app/clients/${domain}/execution`
              : `/app/clients/${domain}/execution?view=${cat.value}`;
          return (
            <Link
              key={cat.value}
              href={href}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-md border px-3 text-sm transition-colors",
                isActive
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {cat.value !== "all" && (
                <span className={cn("h-1.5 w-1.5 rounded-full", CATEGORY_DOT[cat.value as Exclude<Category, "all">])} />
              )}
              {cat.label}
              <span
                className={cn(
                  "font-mono text-xs",
                  isActive ? "opacity-80" : "text-muted-foreground/70",
                )}
              >
                {formatCount(count)}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Two-column layout: sidebar filter + action list */}
      <div className={cn(
        "grid gap-6",
        category.subFilters.length > 0 ? "grid-cols-[180px_1fr]" : "grid-cols-1",
      )}>
        {/* Sidebar - only when category has sub-filters */}
        {category.subFilters.length > 0 && (
          <aside>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Filter
            </p>
            <nav className="flex flex-col gap-0.5">
              <SidebarLink
                domain={domain}
                view={category.value}
                filter="all"
                label="All"
                count={categoryActions.length}
                isActive={activeFilter === "all"}
              />
              {category.subFilters.map((sf) => {
                const count = categoryActions.filter(sf.match).length;
                return (
                  <SidebarLink
                    key={sf.value}
                    domain={domain}
                    view={category.value}
                    filter={sf.value}
                    label={sf.label}
                    count={count}
                    isActive={activeFilter === sf.value}
                  />
                );
              })}
            </nav>
          </aside>
        )}

        {/* Action list */}
        <section>
          {visibleActions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/20 p-12 text-center text-sm text-muted-foreground">
              No actions match the current filter.
            </div>
          ) : (
            <div className="rounded-lg border border-border/60 bg-card divide-y divide-border/60">
              {visibleActions.map((action) => (
                <ActionRow key={action.id} action={action} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ── Sidebar link ────────────────────────────────────────────────────────

function SidebarLink({
  domain,
  view,
  filter,
  label,
  count,
  isActive,
}: {
  domain: string;
  view: Category;
  filter: string;
  label: string;
  count: number;
  isActive: boolean;
}): React.JSX.Element {
  const href =
    filter === "all"
      ? view === "all"
        ? `/app/clients/${domain}/execution`
        : `/app/clients/${domain}/execution?view=${view}`
      : `/app/clients/${domain}/execution?view=${view}&filter=${filter}`;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
        isActive
          ? "bg-accent text-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
      )}
    >
      <span>{label}</span>
      <span className="font-mono text-[11px] text-muted-foreground">{formatCount(count)}</span>
    </Link>
  );
}
