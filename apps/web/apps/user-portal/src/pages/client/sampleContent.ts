/**
 * Sample rendered content — the full page/article behind a Content-tab draft.
 *
 * This is what a client sees when they click "Preview page": the whole thing
 * laid out with images exactly as it would publish to their site, at a fake
 * published URL. Sample-data only for now; real drafts render the same shape.
 *
 * Copy is intentionally realistic and structured for SEO + AEO (a direct-answer
 * lead paragraph, question subheads, an FAQ block) so the preview demonstrates
 * what rynk actually produces.
 */

export type ArticleBlock =
  | { type: 'para'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'image'; label: string; caption?: string }
  | { type: 'list'; items: string[] }
  | { type: 'faq'; items: { q: string; a: string }[] }
  | { type: 'cta'; text: string; button: string };

export interface Article {
  draftId: string;
  clientDomain: string;
  /** Fake published URL shown in the preview's browser chrome. */
  url: string;
  metaTitle: string;
  metaDescription: string;
  brand: string;
  h1: string;
  /** Hero image label (rendered as a placeholder block). */
  hero: string;
  /** AEO direct-answer opener — the extractable summary. */
  lead: string;
  blocks: ArticleBlock[];
}

export const SAMPLE_ARTICLES: Record<string, Article> = {
  // Fade Lab Barbers — local service page (draft d2).
  d2: {
    draftId: 'd2',
    clientDomain: 'fadelabbarbers.com',
    url: 'https://fadelabbarbers.com/services/kids-haircuts-plano',
    metaTitle: "Kids Haircuts in Plano, TX | Gentle, Fast Cuts — Fade Lab Barbers",
    metaDescription:
      'Friendly, low-stress kids haircuts in Plano. Walk-ins welcome, patient barbers, and cuts kids actually sit still for. Book online in seconds.',
    brand: 'Fade Lab Barbers',
    h1: 'Kids Haircuts in Plano, TX',
    hero: 'Young child smiling in a barber chair getting a fresh haircut',
    lead:
      'Fade Lab Barbers offers gentle, low-stress kids haircuts in Plano, TX — from first cuts to school-ready fades. Walk-ins are welcome, most cuts take 15–20 minutes, and our barbers are used to wiggly customers. Kids’ cuts start at $22.',
    blocks: [
      {
        type: 'para',
        text: "Getting a little one’s hair cut shouldn’t be a battle. Our Plano barbers keep it quick, calm, and fun — a booster seat, a favorite show on the screen, and a barber who’s cut hundreds of first-timers. Parents wait comfortably a few feet away.",
      },
      { type: 'h2', text: 'What makes a good kids’ haircut?' },
      {
        type: 'para',
        text: 'A good kids’ haircut is fast, patient, and safe. We use quiet clippers, take breaks when a child needs one, and always confirm the length with the parent before we start. The goal is a clean cut and a kid who’s happy to come back.',
      },
      {
        type: 'image',
        label: 'Barber giving a young boy a fade with clippers',
        caption: 'Quiet clippers and a patient hand — most kids’ cuts are done in under 20 minutes.',
      },
      { type: 'h2', text: 'Popular kids’ cuts in Plano' },
      {
        type: 'list',
        items: [
          'Classic taper — clean on the sides, natural on top. Great for school.',
          'Low / mid fade — a sharper look for older kids and teens.',
          'Scissor trim — for longer styles and first haircuts.',
          'Buzz cut — easy, low-maintenance, and beat the Texas heat.',
        ],
      },
      { type: 'h2', text: 'How much do kids’ haircuts cost?' },
      {
        type: 'para',
        text: 'Kids’ haircuts (ages 12 and under) start at $22. Teen cuts are $28. First haircuts include a keepsake photo on us. Walk-ins are welcome, but booking ahead means little-to-no wait.',
      },
      {
        type: 'cta',
        text: 'Book a kids’ cut in under a minute — pick a time that works around nap and school schedules.',
        button: 'Book online',
      },
      { type: 'h2', text: 'Frequently asked questions' },
      {
        type: 'faq',
        items: [
          {
            q: 'Do you take walk-ins for kids’ haircuts?',
            a: 'Yes — walk-ins are welcome Tuesday through Sunday. Booking online guarantees a spot with little to no wait, which most parents prefer for younger kids.',
          },
          {
            q: 'What age do you cut hair for?',
            a: 'All ages, including first haircuts. Our barbers regularly cut hair for toddlers, school-age kids, and teens.',
          },
          {
            q: 'How long does a kids’ haircut take?',
            a: 'Most kids’ haircuts take 15–20 minutes. First cuts or longer styles can take a little longer since we go at the child’s pace.',
          },
          {
            q: 'Where are you located?',
            a: 'We’re in Plano, TX, and serve nearby Frisco, Allen, and North Dallas. Free parking is available right outside.',
          },
        ],
      },
    ],
  },
};

export function getArticle(draftId: string): Article | null {
  return SAMPLE_ARTICLES[draftId] ?? null;
}
