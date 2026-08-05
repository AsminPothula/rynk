/**
 * Editable dashboard toolkit — the Profile and Settings tabs are edit-in-place.
 *
 * EditProvider holds a working copy (draft) of everything editable for one
 * client, tracks whether it differs from the last-saved snapshot (`dirty`), and
 * exposes save/discard. A single sticky SaveBar (rendered once at the dashboard
 * level) shows whenever there are unsaved changes; the tab switcher + a
 * beforeunload handler guard against losing them.
 *
 * On save it (for now) simulates persistence + a re-strategy "recompute" so the
 * UX is complete; the real hook is PATCH /client/:id/profile followed by kicking
 * a strategy run — marked with a TODO below.
 */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Check, Loader2, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ClientData, ClientProfile } from './sampleData';

export interface EditDraft {
  profile: ClientProfile;
  business: { name: string; industry: string; location: string };
  /**
   * Per-content-type auto-publish choices for the CONFIGURABLE (visible)
   * actions, keyed by type. Absent/false = manual approval (the default).
   * Technical actions are always automatic and not represented here.
   */
  autoPublish: Record<string, boolean>;
}

type Status = 'idle' | 'saving' | 'recomputing' | 'saved';

interface EditContextValue {
  draft: EditDraft;
  update: (fn: (d: EditDraft) => void) => void;
  dirty: boolean;
  discard: () => void;
  save: () => void;
  status: Status;
}

const EditContext = createContext<EditContextValue | null>(null);

export function useEdit(): EditContextValue {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error('useEdit must be used within an EditProvider');
  return ctx;
}

export function EditProvider({ client, children }: { client: ClientData; children: React.ReactNode }) {
  const initial = useMemo<EditDraft>(
    () => ({
      profile: structuredClone(client.profile),
      business: { name: client.name, industry: client.industry, location: client.location ?? '' },
      // Empty = every configurable type starts on manual approval (the default
      // for new clients). Toggling a type on stores true.
      autoPublish: {},
    }),
    [client],
  );

  const [draft, setDraft] = useState<EditDraft>(initial);
  const [saved, setSaved] = useState<EditDraft>(initial);
  const [status, setStatus] = useState<Status>('idle');

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  const update = useCallback((fn: (d: EditDraft) => void) => {
    setDraft((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });
  }, []);

  const discard = useCallback(() => setDraft(saved), [saved]);

  const save = useCallback(() => {
    setStatus('saving');
    // Real wiring (lands with the dashboard→API connection): call
    //   PATCH /client/:id/profile  with the changed fields.
    // The backend already persists the context AND kicks a background
    // re-strategy run (EditClientProfileUseCase → startLayersDetached), so the
    // edits flow into the audit + plan automatically — the frontend just needs
    // to fire that request here. Simulated below until the API layer is wired.
    window.setTimeout(() => {
      setSaved(draft);
      setStatus('recomputing');
      window.setTimeout(() => {
        setStatus('saved');
        window.setTimeout(() => setStatus('idle'), 2500);
      }, 1200);
    }, 700);
  }, [draft]);

  return (
    <EditContext.Provider value={{ draft, update, dirty, discard, save, status }}>
      {children}
    </EditContext.Provider>
  );
}

// ── Sticky save bar ──────────────────────────────────────────────────────────

export function SaveBar() {
  const { dirty, discard, save, status } = useEdit();
  if (!dirty && status === 'idle') return null;

  const busy = status === 'saving' || status === 'recomputing';
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-ink/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-4 px-6 py-3">
        <p className="flex items-center gap-2 text-sm text-brand-text">
          {status === 'recomputing' ? (
            <><Loader2 className="h-4 w-4 animate-spin text-brand-blueSoft" /> Saved — rynk is updating your plan…</>
          ) : status === 'saved' ? (
            <><Check className="h-4 w-4 text-brand-emeraldSoft" /> Saved. Your changes are now steering the plan.</>
          ) : (
            <><span className="h-2 w-2 rounded-full bg-brand-highlight" /> You have unsaved changes.</>
          )}
        </p>
        {dirty && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={discard}
              disabled={busy}
              className="rounded-full px-4 py-1.5 font-serif text-sm text-brand-textMute ring-1 ring-white/12 transition-colors hover:text-brand-text disabled:opacity-50"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-1.5 font-serif text-sm font-medium text-brand-ink transition-all hover:shadow-[0_10px_28px_-10px_rgba(255,255,255,0.4)] disabled:opacity-60"
            >
              {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {status === 'saving' ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Editable primitives ──────────────────────────────────────────────────────

const inputCls =
  'w-full rounded-md bg-transparent px-2 py-1 text-sm leading-relaxed text-brand-text/90 outline-none ring-1 ring-transparent transition placeholder:text-brand-textMute/50 hover:ring-white/10 focus:bg-white/[0.04] focus:ring-brand-blue/40';

export function EText({
  value,
  onChange,
  placeholder = 'Not set yet',
  multiline,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cn(inputCls, 'resize-y')}
      />
    );
  }
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />;
}

export function EField({
  label,
  value,
  onChange,
  multiline,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="mt-3 first:mt-0">
      {label && <p className="mb-0.5 text-[11px] text-brand-textMute">{label}</p>}
      <EText value={value} onChange={onChange} multiline={multiline} placeholder={placeholder} />
    </div>
  );
}

export function EChips({
  items,
  onChange,
  tone,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  tone?: 'warn';
}) {
  const [input, setInput] = useState('');
  function add() {
    const v = input.trim();
    if (!v) return;
    onChange([...items, v]);
    setInput('');
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((x, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] ring-1',
            tone === 'warn'
              ? 'bg-brand-highlight/10 text-brand-highlight ring-brand-highlight/25'
              : 'bg-white/5 text-brand-text/90 ring-white/10',
          )}
        >
          {x}
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="opacity-50 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder="add +"
        className="w-16 bg-transparent text-[12px] text-brand-text outline-none placeholder:text-brand-textMute/50"
      />
    </div>
  );
}

/** Add/remove row wrapper — used for personas, products, hours, services. */
export function ERowList<T>({
  rows,
  onChange,
  blank,
  addLabel,
  render,
}: {
  rows: T[];
  onChange: (rows: T[]) => void;
  blank: () => T;
  addLabel: string;
  render: (row: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      {rows.map((row, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="min-w-0 flex-1">{render(row, (patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r))))}</div>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="mt-1 shrink-0 text-brand-textMute/60 transition-colors hover:text-brand-highlight"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, blank()])}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-blueSoft transition-colors hover:text-brand-text"
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </button>
    </div>
  );
}
