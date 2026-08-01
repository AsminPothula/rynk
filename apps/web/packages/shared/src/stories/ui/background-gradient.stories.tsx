import type { Meta, StoryObj } from '@storybook/react';
import { BackgroundGradient } from '../../components/ui/background-gradient';

const meta: Meta<typeof BackgroundGradient> = {
  title: 'UI/BackgroundGradient',
  component: BackgroundGradient,
};

export default meta;
type Story = StoryObj<typeof BackgroundGradient>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Animated
        </h3>
        <BackgroundGradient className="rounded-[22px] bg-white p-4 sm:p-10 dark:bg-zinc-900">
          <p className="mb-2 text-base text-black sm:text-xl dark:text-neutral-200">
            Animated Gradient Card
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            This card has an animated gradient border that moves continuously.
          </p>
        </BackgroundGradient>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Static
        </h3>
        <BackgroundGradient
          animate={false}
          className="rounded-[22px] bg-white p-4 sm:p-10 dark:bg-zinc-900">
          <p className="mb-2 text-base text-black sm:text-xl dark:text-neutral-200">
            Static Gradient Card
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            This card has a static gradient border without animation.
          </p>
        </BackgroundGradient>
      </div>
    </div>
  ),
};
