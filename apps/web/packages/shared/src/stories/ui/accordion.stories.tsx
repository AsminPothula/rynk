import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
} as Meta;

export default meta;
type Story = StoryObj;

const faqItems = [
  {
    q: 'Is it accessible?',
    a: 'Yes. It adheres to the WAI-ARIA design pattern.',
  },
  {
    q: 'Is it styled?',
    a: 'Yes. It comes with default styles that match the other components.',
  },
  {
    q: 'Is it animated?',
    a: 'Yes. It is animated by default, but you can disable it if you prefer.',
  },
  {
    q: 'Can I customize it?',
    a: 'Yes. You can customize the styles using Tailwind CSS classes.',
  },
];

export const AllVariations: Story = {
  render: () => (
    <div className="max-w-lg space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Single Collapsible
        </h3>
        <Accordion type="single" collapsible>
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`single-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Multiple
        </h3>
        <Accordion type="multiple">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`multi-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Default Open
        </h3>
        <Accordion type="single" collapsible defaultValue="open-0">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`open-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  ),
};
