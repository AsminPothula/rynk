/**
 * Lightweight Markdown -> HTML converter for WordPress publishing.
 *
 * WordPress posts and pages accept raw HTML in the `content` field, so the
 * adapter converts the LLM-generated markdown bodies into clean HTML before
 * sending. This keeps us off any per-site markdown plugin and ensures the
 * rendered output is portable.
 *
 * Scope: covers the common subset that Layer 3 generators produce:
 *
 *   - ATX headings    # ## ### ####
 *   - Paragraphs (blank-line separated)
 *   - Bullet lists    - item   or   * item
 *   - Numbered lists  1. item
 *   - Bold            **text**
 *   - Italic          *text* or _text_
 *   - Inline code     `code`
 *   - Code blocks     ```lang\n...\n```
 *   - Links           [text](url)
 *   - Horizontal rules ---
 *
 * Not handled (yet, deliberately):
 *   - Tables, footnotes, definition lists, embedded HTML, blockquotes
 *
 * If we ever need GFM-level features, swap to `marked` - the function
 * signature stays the same.
 */

export function markdownToHtml(md: string): string {
  if (!md || md.trim().length === 0) return "";

  // Normalize line endings.
  const text = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  // Extract fenced code blocks first, replace with placeholders so the
  // paragraph/list pass doesn't touch their content.
  const codeBlocks: string[] = [];
  const withCodePlaceholders = text.replace(/```([\w-]*)\n([\s\S]*?)```/g, (_m, lang: string, code: string) => {
    const langClass = lang ? ` class="language-${escapeHtml(lang)}"` : "";
    codeBlocks.push(`<pre><code${langClass}>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`);
    return `\x00CODEBLOCK${codeBlocks.length - 1}\x00`;
  });

  // Split into blocks by blank lines, transform each, then re-join.
  const blocks = withCodePlaceholders.split(/\n{2,}/).map(transformBlock);

  // Re-insert code blocks.
  let html = blocks.join("\n\n");
  html = html.replace(/\x00CODEBLOCK(\d+)\x00/g, (_m, idx: string) => codeBlocks[parseInt(idx, 10)] ?? "");

  return html.trim();
}

/** Process one logical block (paragraph, list, heading, hr, or code placeholder). */
function transformBlock(block: string): string {
  const trimmed = block.trim();
  if (!trimmed) return "";

  // Code-block placeholder - already HTML, pass through untouched.
  if (/^\x00CODEBLOCK\d+\x00$/.test(trimmed)) return trimmed;

  // Horizontal rule.
  if (/^---+$/.test(trimmed)) return "<hr />";

  // Heading (#, ##, ###, ####).
  const headingMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
  if (headingMatch) {
    const level = headingMatch[1]!.length;
    const text = inlineFormat(headingMatch[2]!.trim());
    return `<h${level}>${text}</h${level}>`;
  }

  // Bullet list - all lines start with `- ` or `* `.
  if (/^([-*])\s+/.test(trimmed) && trimmed.split("\n").every((l) => /^([-*])\s+/.test(l))) {
    const items = trimmed
      .split("\n")
      .map((l) => l.replace(/^([-*])\s+/, ""))
      .map((l) => `  <li>${inlineFormat(l.trim())}</li>`)
      .join("\n");
    return `<ul>\n${items}\n</ul>`;
  }

  // Numbered list - all lines start with `n. `.
  if (/^\d+\.\s+/.test(trimmed) && trimmed.split("\n").every((l) => /^\d+\.\s+/.test(l))) {
    const items = trimmed
      .split("\n")
      .map((l) => l.replace(/^\d+\.\s+/, ""))
      .map((l) => `  <li>${inlineFormat(l.trim())}</li>`)
      .join("\n");
    return `<ol>\n${items}\n</ol>`;
  }

  // Default: paragraph - inline formatting only, joins multi-line wrap.
  const oneLine = trimmed.replace(/\n/g, " ");
  return `<p>${inlineFormat(oneLine)}</p>`;
}

/** Inline transforms applied within paragraphs, list items, and headings. */
function inlineFormat(text: string): string {
  let out = text;

  // Inline code FIRST so the literal backtick content isn't mutated by
  // later regexes (e.g. ** inside `**` would otherwise be treated as bold).
  const codeSpans: string[] = [];
  out = out.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${escapeHtml(code)}</code>`);
    return `\x01CODESPAN${codeSpans.length - 1}\x01`;
  });

  // Escape any raw < > & that aren't inside our placeholders.
  out = escapeHtml(out);

  // Links: [text](url) - allow http(s), mailto, root-relative paths.
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const safeUrl = url.replace(/"/g, "&quot;");
    return `<a href="${safeUrl}">${label}</a>`;
  });

  // Bold (**...**) - must run before italic so we don't eat the inner *.
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic (*...* or _..._).
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

  // Re-insert code spans.
  out = out.replace(/\x01CODESPAN(\d+)\x01/g, (_m, idx: string) => codeSpans[parseInt(idx, 10)] ?? "");

  return out;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
