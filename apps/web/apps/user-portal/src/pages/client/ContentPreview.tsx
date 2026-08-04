/**
 * Content preview — shows a Content-tab draft as the full page it would publish
 * to the client's site: a mock browser window (traffic lights + the real URL)
 * wrapping the rendered page, light-themed so it reads like a live web page, not
 * the dashboard. This is the "fake URL that shows the whole page" view.
 *
 * Route: /preview/content/:id  (and /content/:id inside the app).
 * Sample-data driven via getArticle(); real drafts render the same shape.
 */
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getArticle, type ArticleBlock } from './sampleContent';

/** Labeled gradient placeholder standing in for a real image. */
function ImgPlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end overflow-hidden rounded-xl ${className}`}
      style={{ background: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 40%, #6d8dff 100%)' }}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #fff 0, transparent 40%)' }} />
      <span className="relative m-3 rounded-md bg-black/25 px-2 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

function Block({ b }: { b: ArticleBlock }) {
  switch (b.type) {
    case 'para':
      return <p className="mt-4 text-[15px] leading-[1.7] text-slate-700">{b.text}</p>;
    case 'h2':
      return <h2 className="mt-9 text-[22px] font-semibold tracking-tight text-slate-900">{b.text}</h2>;
    case 'image':
      return (
        <figure className="mt-6">
          <ImgPlaceholder label={b.label} className="h-64 w-full" />
          {b.caption && <figcaption className="mt-2 text-[13px] italic text-slate-500">{b.caption}</figcaption>}
        </figure>
      );
    case 'list':
      return (
        <ul className="mt-4 space-y-2">
          {b.items.map((it, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-[1.6] text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {it}
            </li>
          ))}
        </ul>
      );
    case 'cta':
      return (
        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-indigo-50 p-6 ring-1 ring-indigo-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[15px] font-medium text-slate-800">{b.text}</p>
          <span className="shrink-0 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white">{b.button}</span>
        </div>
      );
    case 'faq':
      return (
        <div className="mt-5 divide-y divide-slate-200 rounded-2xl ring-1 ring-slate-200">
          {b.items.map((f, i) => (
            <div key={i} className="p-5">
              <p className="text-[15px] font-semibold text-slate-900">{f.q}</p>
              <p className="mt-1.5 text-[14px] leading-[1.65] text-slate-600">{f.a}</p>
            </div>
          ))}
        </div>
      );
  }
}

export function ContentPreview() {
  const { id = '' } = useParams();
  const article = getArticle(id);

  if (!article) {
    return (
      <div className="min-h-screen bg-brand-ink px-6 py-16 text-center text-brand-textMute">
        <p>No preview available for this draft yet.</p>
        <Link to="/preview" className="mt-4 inline-block font-mono text-xs text-brand-blueSoft hover:text-brand-text">← back</Link>
      </div>
    );
  }

  const backHref = `/preview/${article.clientDomain}`;

  return (
    <div className="min-h-screen bg-brand-ink px-4 py-8 text-brand-text">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center justify-between">
          <Link
            to={backHref}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] text-brand-blueSoft transition-colors hover:text-brand-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back to dashboard
          </Link>
          <span className="rounded-full bg-white/5 px-2.5 py-1 font-mono text-[10px] text-brand-textMute ring-1 ring-white/10">
            preview · not yet published
          </span>
        </div>

        {/* Mock browser window */}
        <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl">
          {/* Chrome */}
          <div className="flex items-center gap-3 border-b border-black/10 bg-slate-100 px-4 py-2.5">
            <div className="flex gap-1.5">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 truncate rounded-md bg-white px-3 py-1 text-[12px] text-slate-500 ring-1 ring-slate-200">
              {article.url}
            </div>
          </div>

          {/* Rendered page (light theme, like the live site) */}
          <div className="bg-white">
            {/* Site nav */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-10">
              <span className="text-lg font-bold tracking-tight text-slate-900">{article.brand}</span>
              <nav className="hidden gap-6 text-sm text-slate-600 sm:flex">
                <span>Services</span><span>Gallery</span><span>About</span><span className="font-semibold text-indigo-600">Book</span>
              </nav>
            </div>

            <article className="mx-auto max-w-2xl px-6 py-10 sm:px-0">
              {/* SERP / meta preview — what Google shows */}
              <div className="mb-8 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">How this appears in Google</p>
                <p className="mt-2 text-[15px] font-medium leading-snug text-[#1a0dab]">{article.metaTitle}</p>
                <p className="text-[12px] text-[#006621]">{article.url}</p>
                <p className="mt-0.5 text-[13px] leading-snug text-slate-600">{article.metaDescription}</p>
              </div>

              <h1 className="text-[34px] font-bold leading-[1.1] tracking-tight text-slate-900">{article.h1}</h1>

              {/* AEO direct-answer lead */}
              <p className="mt-4 border-l-4 border-indigo-500 pl-4 text-[17px] font-medium leading-[1.6] text-slate-800">
                {article.lead}
              </p>

              <ImgPlaceholder label={article.hero} className="mt-7 h-72 w-full" />

              {article.blocks.map((b, i) => (
                <Block key={i} b={b} />
              ))}

              <footer className="mt-12 border-t border-slate-100 pt-6 text-[13px] text-slate-500">
                {article.brand} · Plano, TX · Open Tue–Sun · (972) 555-0142
              </footer>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
