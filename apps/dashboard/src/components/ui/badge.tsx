/**
 * Badge — compact label used everywhere: status chips, channel chips,
 * risk indicators, count indicators.
 *
 * Variants cover the colors defined in our token palette:
 *   - status: success / pending / failed / skipped
 *   - channel: cms / image / outreach / social / code-pr / document / offsite
 *   - generic: default / outline / secondary
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground",

        // Status
        success: "border-transparent bg-status-success/15 text-status-success",
        pending: "border-transparent bg-status-pending/15 text-status-pending",
        failed: "border-transparent bg-status-failed/15 text-status-failed",
        skipped: "border-transparent bg-status-skipped/15 text-status-skipped",

        // Channel chips
        "channel-cms": "border-transparent bg-channel-cms/15 text-channel-cms",
        "channel-image": "border-transparent bg-channel-image/15 text-channel-image",
        "channel-outreach": "border-transparent bg-channel-outreach/15 text-channel-outreach",
        "channel-social": "border-transparent bg-channel-social/15 text-channel-social",
        "channel-code-pr": "border-transparent bg-channel-code-pr/15 text-channel-code-pr",
        "channel-document": "border-transparent bg-channel-document/15 text-channel-document",
        "channel-offsite": "border-transparent bg-channel-offsite/15 text-channel-offsite",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps): React.JSX.Element {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
