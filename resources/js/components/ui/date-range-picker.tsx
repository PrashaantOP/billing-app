'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DateRangePickerProps {
    value: { from: string; to: string };
    onChange: (range: { from: string; to: string }) => void;
    className?: string;
    placeholder?: string;
}

function toDate(str: string): Date | undefined {
    if (!str) return undefined;
    const d = new Date(str + 'T00:00:00');
    return isNaN(d.getTime()) ? undefined : d;
}

function toStr(d: Date | undefined): string {
    if (!d) return '';
    return format(d, 'yyyy-MM-dd');
}

export function DateRangePicker({ value, onChange, className, placeholder = 'Pick a date range' }: DateRangePickerProps) {
    const [open, setOpen] = useState(false);

    const selected: DateRange = {
        from: toDate(value.from),
        to: toDate(value.to),
    };

    const handleSelect = (range: DateRange | undefined) => {
        onChange({
            from: toStr(range?.from),
            to: toStr(range?.to),
        });
    };

    const hasRange = value.from || value.to;

    const displayText = hasRange
        ? [
            value.from ? format(new Date(value.from + 'T00:00:00'), 'dd MMM yyyy') : 'Start',
            '→',
            value.to ? format(new Date(value.to + 'T00:00:00'), 'dd MMM yyyy') : 'End',
          ].join('  ')
        : placeholder;

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'w-full justify-start text-left font-normal',
                            !hasRange && 'text-muted-foreground',
                        )}
                    >
                        <CalendarDays className="mr-2 h-4 w-4 shrink-0" />
                        {displayText}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={selected}
                        onSelect={handleSelect}
                        numberOfMonths={2}
                    />

                    {/* Quick presets */}
                    <div className="border-t border-border px-4 py-3">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Select</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                {
                                    label: 'Today',
                                    fn: () => {
                                        const d = format(new Date(), 'yyyy-MM-dd');
                                        onChange({ from: d, to: d });
                                        setOpen(false);
                                    },
                                },
                                {
                                    label: 'This Week',
                                    fn: () => {
                                        const now = new Date();
                                        const day = now.getDay();
                                        const mon = new Date(now);
                                        mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
                                        onChange({ from: format(mon, 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') });
                                        setOpen(false);
                                    },
                                },
                                {
                                    label: 'This Month',
                                    fn: () => {
                                        const now = new Date();
                                        const first = new Date(now.getFullYear(), now.getMonth(), 1);
                                        onChange({ from: format(first, 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') });
                                        setOpen(false);
                                    },
                                },
                                {
                                    label: 'Last Month',
                                    fn: () => {
                                        const now = new Date();
                                        const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                        const last = new Date(now.getFullYear(), now.getMonth(), 0);
                                        onChange({ from: format(first, 'yyyy-MM-dd'), to: format(last, 'yyyy-MM-dd') });
                                        setOpen(false);
                                    },
                                },
                                {
                                    label: 'Last 7 Days',
                                    fn: () => {
                                        const now = new Date();
                                        const past = new Date(now);
                                        past.setDate(now.getDate() - 6);
                                        onChange({ from: format(past, 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') });
                                        setOpen(false);
                                    },
                                },
                                {
                                    label: 'Last 30 Days',
                                    fn: () => {
                                        const now = new Date();
                                        const past = new Date(now);
                                        past.setDate(now.getDate() - 29);
                                        onChange({ from: format(past, 'yyyy-MM-dd'), to: format(now, 'yyyy-MM-dd') });
                                        setOpen(false);
                                    },
                                },
                            ].map(({ label, fn }) => (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={fn}
                                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {hasRange && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => { onChange({ from: '', to: '' }); setOpen(false); }}
                            >
                                Clear selection
                            </Button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
