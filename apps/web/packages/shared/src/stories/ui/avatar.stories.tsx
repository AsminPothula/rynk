import type { Meta, StoryObj } from '@storybook/react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../components/ui/avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const AllVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          With Image
        </h3>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=1" alt="User 1" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=2" alt="User 2" />
            <AvatarFallback>U2</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://i.pravatar.cc/150?u=3" alt="User 3" />
            <AvatarFallback>U3</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Fallback
        </h3>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="/broken-url.jpg" alt="Broken" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>ZZ</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Sizes
        </h3>
        <div className="flex items-end gap-4">
          <Avatar className="h-6 w-6">
            <AvatarImage src="https://i.pravatar.cc/150?u=4" alt="XS" />
            <AvatarFallback className="text-xs">XS</AvatarFallback>
          </Avatar>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://i.pravatar.cc/150?u=5" alt="SM" />
            <AvatarFallback className="text-xs">SM</AvatarFallback>
          </Avatar>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://i.pravatar.cc/150?u=6" alt="MD" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
          <Avatar className="h-14 w-14">
            <AvatarImage src="https://i.pravatar.cc/150?u=7" alt="LG" />
            <AvatarFallback>LG</AvatarFallback>
          </Avatar>
          <Avatar className="h-20 w-20">
            <AvatarImage src="https://i.pravatar.cc/150?u=8" alt="XL" />
            <AvatarFallback className="text-lg">XL</AvatarFallback>
          </Avatar>
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://i.pravatar.cc/150?u=9" alt="2XL" />
            <AvatarFallback className="text-xl">2X</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <h3 className="text-muted-foreground mb-3 text-sm font-medium">
          Stacked Group
        </h3>
        <div className="flex -space-x-3">
          {[10, 11, 12, 13, 14].map((id) => (
            <Avatar key={id} className="border-background border-2">
              <AvatarImage
                src={`https://i.pravatar.cc/150?u=${id}`}
                alt={`User ${id}`}
              />
              <AvatarFallback>U{id}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
    </div>
  ),
};
