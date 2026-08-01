import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from './button';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { ScrollArea } from './scroll-area';
import { cn } from '../../lib/utils';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

export const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    const query = search.toLowerCase();
    return options
      .filter((x) => x.value)
      .filter(
        (option) =>
          !query ||
          option.label.toLowerCase().includes(query) ||
          `+${RPNInput.getCountryCallingCode(option.value)}`.includes(query),
      );
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={'outline'}
          className={cn('flex gap-1 rounded-e-none rounded-s-lg pl-3 pr-1')}
          disabled={disabled}>
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn(
              'h-4 w-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[99] w-[300px] p-0">
        <div className="p-2">
          <Input
            placeholder="Search country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
        </div>
        <ScrollArea className="h-[300px]">
          {filteredOptions.length === 0 && (
            <p className="py-6 text-center text-sm">No country found.</p>
          )}
          {filteredOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm"
              onClick={() => {
                onChange(option.value);
                setSearch('');
                setOpen(false);
              }}>
              <FlagComponent
                country={option.value}
                countryName={option.label}
              />
              <span className="flex-1 text-left text-sm">{option.label}</span>
              <span className="text-foreground/50 text-sm">
                {`+${RPNInput.getCountryCallingCode(option.value)}`}
              </span>
              <CheckIcon
                className={cn(
                  'ml-auto h-4 w-4',
                  option.value === value ? 'opacity-100' : 'opacity-0',
                )}
              />
            </button>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};
FlagComponent.displayName = 'FlagComponent';
