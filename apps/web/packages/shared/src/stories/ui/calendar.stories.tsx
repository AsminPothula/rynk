import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from '../../components/ui/calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Calendar',
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Single Date
        </h3>
        <div className="w-fit rounded-md border">
          <Calendar mode="single" selected={date} onSelect={setDate} />
        </div>
        <p className="text-muted-foreground mt-2 text-sm">
          Selected: {date ? date.toLocaleDateString() : 'None'}
        </p>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Disabled Past Dates
        </h3>
        <div className="w-fit rounded-md border">
          <Calendar mode="single" disabled={{ before: new Date() }} />
        </div>
      </div>
    </div>
  );
}

export const AllVariations: Story = {
  render: () => <CalendarDemo />,
};
