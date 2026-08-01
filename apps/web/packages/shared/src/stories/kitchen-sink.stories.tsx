import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';

// UI components
import { Button } from '../components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { PasswordInput } from '../components/ui/password-input';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Calendar } from '../components/ui/calendar';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../components/ui/sheet';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '../components/ui/drawer';
import { BackgroundGradient } from '../components/ui/background-gradient';
import { ModeToggle } from '../components/mode-toggle';

// Common components
import DataCard from '../components/common/data-card';
import SalesCard from '../components/common/sales-card';
import PageTitle from '../components/common/page-title';
import { PleaseWaitLoadText } from '../components/common/please-wait-load-text';
import { EmptyState } from '../components/common/empty-state';
import { ErrorState } from '../components/common/error-state';
import { SectionLoader } from '../components/common/section-loader';
import { ConfirmActionAlert } from '../components/common/confirm-action-alert';
import { DashboardOverview } from '../components/common/dashboard-overview';
import { DashboardSales } from '../components/common/dashboard-sales';
import LineChart from '../components/common/line-chart';
import PieChart from '../components/common/pie-chart';
import { InactivityWarningDialog } from '../components/common/inactivity-warning-dialog';

import {
  Mail,
  Loader2,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Search,
  DollarSign,
  Users,
  CreditCard,
  Activity,
} from 'lucide-react';

const meta = {
  title: 'Kitchen Sink',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h2 className="border-b pb-2 text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}

const barData = [
  { name: 'Jan', total: 1200 },
  { name: 'Feb', total: 2100 },
  { name: 'Mar', total: 800 },
  { name: 'Apr', total: 3200 },
  { name: 'May', total: 2800 },
  { name: 'Jun', total: 1900 },
];

const lineData = [
  { label: 'January', desktop: 186, mobile: 80 },
  { label: 'February', desktop: 305, mobile: 200 },
  { label: 'March', desktop: 237, mobile: 120 },
  { label: 'April', desktop: 73, mobile: 190 },
  { label: 'May', desktop: 209, mobile: 130 },
  { label: 'June', desktop: 214, mobile: 140 },
];

const lineSeries = [
  { dataKey: 'desktop', color: 'hsl(221.2 83.2% 53.3%)', label: 'Desktop' },
  { dataKey: 'mobile', color: 'hsl(212 95% 68%)', label: 'Mobile' },
];

const pieData = [
  {
    name: 'chrome',
    value: 275,
    color: 'hsl(221.2 83.2% 53.3%)',
    label: 'Chrome',
  },
  { name: 'safari', value: 200, color: 'hsl(212 95% 68%)', label: 'Safari' },
  { name: 'firefox', value: 187, color: 'hsl(216 92% 60%)', label: 'Firefox' },
  { name: 'edge', value: 173, color: 'hsl(210 98% 78%)', label: 'Edge' },
  { name: 'other', value: 90, color: 'hsl(220 14% 46%)', label: 'Other' },
];

const salesData = [
  { name: 'John Doe', email: 'john@example.com', saleAmount: '+$1,999.00' },
  { name: 'Jane Smith', email: 'jane@company.co', saleAmount: '+$39.00' },
  { name: 'Alex Johnson', email: 'alex@startup.io', saleAmount: '+$299.00' },
];

function KitchenSinkContent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [inactivityOpen, setInactivityOpen] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(120);

  useEffect(() => {
    if (!inactivityOpen) return;
    const id = setInterval(() => {
      setInactivitySeconds((s) => {
        if (s <= 1) {
          setInactivityOpen(false);
          return 120;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [inactivityOpen]);

  return (
    <TooltipProvider>
      <div className="max-w-5xl space-y-12">
        {/* Theme Toggle */}
        <Section title="Theme">
          <div className="flex items-center gap-4">
            <ModeToggle />
            <span className="text-muted-foreground text-sm">
              Toggle dark / light / system
            </span>
          </div>
        </Section>

        {/* Page Title */}
        <Section title="PageTitle">
          <div className="space-y-2">
            <PageTitle title="Dashboard Overview" />
            <PageTitle title="Custom Styled" className="text-primary" />
          </div>
        </Section>

        {/* Buttons */}
        <Section title="Button">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button>Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <Mail className="mr-2 h-4 w-4" /> With Icon
              </Button>
              <Button variant="outline">
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading
              </Button>
            </div>
          </div>
        </Section>

        {/* Inputs */}
        <Section title="Input, Label & PasswordInput">
          <div className="grid max-w-2xl grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="ks-email">Email</Label>
              <Input
                id="ks-email"
                type="email"
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ks-pw">Password</Label>
              <PasswordInput id="ks-pw" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ks-disabled">Disabled</Label>
              <Input id="ks-disabled" disabled placeholder="Can't edit" />
            </div>
            <div className="space-y-2">
              <Label>With Button</Label>
              <div className="flex gap-2">
                <Input placeholder="Search..." />
                <Button size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Error State</Label>
              <Input
                defaultValue="invalid-email"
                className="border-destructive focus-visible:ring-destructive"
              />
              <p className="text-destructive text-xs">
                Please enter a valid email address.
              </p>
            </div>
            <div className="space-y-1">
              <Label>Success State</Label>
              <Input
                defaultValue="johndoe"
                className="border-green-500 focus-visible:ring-green-500"
              />
              <p className="text-xs text-green-600">Username is available.</p>
            </div>
          </div>
        </Section>

        {/* Cards */}
        <Section title="Card">
          <div className="flex flex-wrap gap-6">
            <Card className="w-[280px]">
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card example.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Content area.</p>
              </CardContent>
            </Card>
            <Card className="w-[280px]">
              <CardHeader>
                <CardTitle>With Actions</CardTitle>
                <CardDescription>Has footer buttons.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Some content here.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
            <Card className="w-[280px]">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>3 unread</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Call confirmed', 'New message', 'Sub expiring'].map(
                  (m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded border p-2 text-sm">
                      <div className="bg-primary h-2 w-2 rounded-full" />
                      {m}
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </div>
        </Section>

        {/* DataCard */}
        <Section title="DataCard">
          <div className="grid max-w-3xl grid-cols-2 gap-4 lg:grid-cols-4">
            <DataCard
              label="Total Revenue"
              amount="$45,231.89"
              description="+20.1% from last month"
              icon={DollarSign}
            />
            <DataCard
              label="Subscriptions"
              amount="+2350"
              description="+180.1% from last month"
              icon={Users}
            />
            <DataCard
              label="Sales"
              amount="+12,234"
              description="+19% from last month"
              icon={CreditCard}
            />
            <DataCard
              label="Active Now"
              amount="+573"
              description="+201 since last hour"
              icon={Activity}
            />
          </div>
        </Section>

        {/* Dashboard Overview & Sales */}
        <Section title="Dashboard Overview & Sales">
          <div className="grid max-w-4xl grid-cols-2 gap-6">
            <DashboardOverview barData={barData} isLoading={false} />
            <DashboardSales
              salesData={salesData}
              isLoading={false}
              subtitle="You made 265 sales this month."
            />
          </div>
        </Section>

        {/* Charts */}
        <Section title="LineChart & PieChart">
          <div className="grid max-w-4xl grid-cols-2 gap-6">
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Line Chart</p>
              <LineChart data={lineData} series={lineSeries} />
            </div>
            <div className="rounded-lg border p-4">
              <p className="mb-2 text-sm font-medium">Pie Chart</p>
              <PieChart data={pieData} centerLabel="Visitors" />
            </div>
          </div>
        </Section>

        {/* SalesCard */}
        <Section title="SalesCard">
          <div className="flex max-w-md flex-col gap-3">
            {salesData.map((s, i) => (
              <SalesCard key={i} {...s} />
            ))}
          </div>
        </Section>

        {/* States: Loading, Empty, Error */}
        <Section title="State Components">
          <div className="grid max-w-4xl grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SectionLoader</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-around">
                  <SectionLoader isLoading size="sm" />
                  <SectionLoader isLoading size="md" />
                  <SectionLoader isLoading size="lg" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">EmptyState</CardTitle>
              </CardHeader>
              <CardContent>
                <EmptyState title="No items" message="Try adding something." />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">ErrorState</CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorState
                  title="Load failed"
                  message="Could not fetch data."
                  onRetry={() => alert('Retry clicked')}
                />
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Button disabled>
              <PleaseWaitLoadText text="Submitting..." />
            </Button>
            <Button variant="outline" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </Button>
          </div>
        </Section>

        {/* ConfirmActionAlert */}
        <Section title="ConfirmActionAlert">
          <div className="flex gap-4">
            <ConfirmActionAlert
              triggerLabel="Delete Item"
              triggerVariant="destructive"
              title="Delete this item?"
              description="This action cannot be undone."
              cancelText="Cancel"
              confirmText="Delete"
              onConfirm={() => alert('Deleted!')}
            />
            <ConfirmActionAlert
              triggerLabel="Archive"
              triggerVariant="outline"
              title="Archive this item?"
              description="You can restore it later."
              cancelText="No"
              confirmText="Yes, archive"
              onConfirm={() => alert('Archived!')}
            />
          </div>
        </Section>

        {/* Avatar */}
        <Section title="Avatar">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/150?u=1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">S</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">LG</AvatarFallback>
            </Avatar>
            <div className="ml-4 flex -space-x-3">
              {[10, 11, 12, 13].map((i) => (
                <Avatar key={i} className="border-background border-2">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              ))}
              <Avatar className="border-background border-2">
                <AvatarFallback className="text-xs">+5</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </Section>

        {/* Skeleton */}
        <Section title="Skeleton">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </Section>

        {/* Separator */}
        <Section title="Separator">
          <div className="flex h-5 items-center space-x-4 text-sm">
            <div>Blog</div>
            <Separator orientation="vertical" />
            <div>Docs</div>
            <Separator orientation="vertical" />
            <div>Source</div>
          </div>
        </Section>

        {/* Accordion */}
        <Section title="Accordion">
          <Accordion type="single" collapsible className="w-full max-w-lg">
            <AccordionItem value="a1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. Comes with default styles matching other components.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="a3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. Animated by default, but can be disabled.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Calendar */}
        <Section title="Calendar">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-fit rounded-md border"
          />
        </Section>

        {/* Tooltip */}
        <Section title="Tooltip">
          <div className="flex items-center gap-4">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="capitalize">
                    {side}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>
                  <p>Tooltip on {side}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add item</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </Section>

        {/* DropdownMenu */}
        <Section title="DropdownMenu">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        {/* ScrollArea */}
        <Section title="ScrollArea">
          <ScrollArea className="h-48 w-64 rounded-md border">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium">Scroll Items</h4>
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="py-1.5 text-sm">
                  Item {i + 1}
                  {i < 29 && <Separator className="mt-1.5" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </Section>

        {/* Overlays */}
        <Section title="Overlays (AlertDialog, Sheet, Drawer)">
          <div className="flex flex-wrap gap-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Sheet (right)</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Panel</SheetTitle>
                  <SheetDescription>Side panel content.</SheetDescription>
                </SheetHeader>
                <div className="space-y-3 py-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input placeholder="Your name" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button>Drawer (bottom)</Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Bottom Drawer</DrawerTitle>
                    <DrawerDescription>
                      Slides up from the bottom.
                    </DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <Button>Save</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </Section>

        {/* Inactivity Warning Dialog */}
        <Section title="InactivityWarningDialog">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setInactivitySeconds(120);
                setInactivityOpen(true);
              }}>
              Show Inactivity Warning
            </Button>
            <span className="text-muted-foreground text-sm">
              Opens the session timeout warning with a live countdown
            </span>
          </div>
          <InactivityWarningDialog
            open={inactivityOpen}
            secondsRemaining={inactivitySeconds}
            onStayLoggedIn={() => {
              setInactivityOpen(false);
              setInactivitySeconds(120);
            }}
            onLogout={() => {
              setInactivityOpen(false);
              setInactivitySeconds(120);
              alert('Logged out');
            }}
          />
        </Section>

        {/* BackgroundGradient */}
        <Section title="BackgroundGradient">
          <div className="flex gap-6">
            <BackgroundGradient className="rounded-[22px] bg-white p-6 dark:bg-zinc-900">
              <h4 className="text-lg font-bold">Animated</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                Gradient border effect.
              </p>
            </BackgroundGradient>
            <BackgroundGradient
              animate={false}
              className="rounded-[22px] bg-white p-6 dark:bg-zinc-900">
              <h4 className="text-lg font-bold">Static</h4>
              <p className="text-muted-foreground mt-1 text-sm">
                No animation.
              </p>
            </BackgroundGradient>
          </div>
        </Section>
      </div>
    </TooltipProvider>
  );
}

export const AllComponents: Story = {
  render: () => <KitchenSinkContent />,
};
