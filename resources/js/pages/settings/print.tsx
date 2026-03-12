import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FileText, Printer, Receipt, Save } from 'lucide-react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Print Settings', href: '/settings/print' },
];

type PrintSettings = {
    print_type: 'bill_only' | 'kot_bill';
    paper_size: '58mm' | '80mm' | 'A4' | 'A5';
    header_text: string;
    footer_text: string;
    show_logo: boolean;
    show_tax_details: boolean;
    show_customer_info: boolean;
    show_order_type: boolean;
    font_size: 'small' | 'medium' | 'large';
};

export default function PrintSettingsPage() {
    const { settings } = usePage<{ settings: PrintSettings }>().props;

    const { data, setData, put, processing, recentlySuccessful } = useForm<PrintSettings>({
        print_type:         settings.print_type ?? 'bill_only',
        paper_size:         settings.paper_size ?? '80mm',
        header_text:        settings.header_text ?? '',
        footer_text:        settings.footer_text ?? 'Thank you for visiting!',
        show_logo:          settings.show_logo ?? true,
        show_tax_details:   settings.show_tax_details ?? true,
        show_customer_info: settings.show_customer_info ?? true,
        show_order_type:    settings.show_order_type ?? true,
        font_size:          settings.font_size ?? 'medium',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/print');
    };

    const SelectRow = ({
        label, value, onChange, options,
    }: { label: string; value: string; onChange: (v: string) => void; options: { label: string; value: string; icon?: React.ReactNode; desc?: string }[] }) => (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:items-start">
            <Label className="pt-3 text-sm font-medium">{label}</Label>
            <div className="sm:col-span-2">
                <div className="flex flex-wrap gap-3">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={[
                                'flex flex-col items-start rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all min-w-35',
                                value === opt.value
                                    ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500 shadow-sm'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
                            ].join(' ')}
                        >
                            <div className="flex items-center gap-2 font-semibold">
                                {opt.icon}
                                {opt.label}
                            </div>
                            {opt.desc && <p className="mt-1 text-xs font-normal opacity-70">{opt.desc}</p>}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const ToggleRow = ({
        label, description, checked, onChange,
    }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/50">
            <div>
                <p className="text-sm font-medium text-gray-800 dark:text-neutral-100">{label}</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">{description}</p>
            </div>
            <Switch checked={checked} onCheckedChange={onChange} />
        </div>
    );

    const isThermal = ['58mm', '80mm'].includes(data.paper_size);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Print Settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Print Settings"
                        description="Configure how KOT and invoices are printed for your restaurant."
                    />

                    <form onSubmit={submit} className="space-y-6">

                        {/* Print Mode */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <h3 className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-neutral-100">
                                <Printer className="h-4 w-4 text-red-500" /> Print Mode
                            </h3>
                            <p className="mb-4 text-xs text-gray-500 dark:text-neutral-400">
                                Choose what to print when an order is saved with the "Save &amp; Print" action.
                            </p>
                            <SelectRow
                                label="Print Mode"
                                value={data.print_type}
                                onChange={v => setData('print_type', v as 'bill_only' | 'kot_bill')}
                                options={[
                                    {
                                        label: 'Only Bill',
                                        value: 'bill_only',
                                        icon: <FileText className="h-4 w-4 text-green-600" />,
                                        desc: 'Prints customer bill / invoice only',
                                    },
                                    {
                                        label: 'KOT + Bill',
                                        value: 'kot_bill',
                                        icon: <Receipt className="h-4 w-4 text-blue-600" />,
                                        desc: 'Prints kitchen KOT + customer bill',
                                    },
                                ]}
                            />
                        </div>

                        {/* Paper Size & Font */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-neutral-100">Paper &amp; Font</h3>
                            <div className="space-y-4">
                                <SelectRow
                                    label="Paper Size"
                                    value={data.paper_size}
                                    onChange={v => setData('paper_size', v as '58mm' | '80mm' | 'A4' | 'A5')}
                                    options={[
                                        { label: '58 mm', value: '58mm', desc: 'Narrow thermal' },
                                        { label: '80 mm', value: '80mm', desc: 'Standard thermal' },
                                        { label: 'A4', value: 'A4', desc: 'Full page' },
                                        { label: 'A5', value: 'A5', desc: 'Half page' },
                                    ]}
                                />
                                <SelectRow
                                    label="Font Size"
                                    value={data.font_size}
                                    onChange={v => setData('font_size', v as 'small' | 'medium' | 'large')}
                                    options={[
                                        { label: 'Small', value: 'small' },
                                        { label: 'Medium', value: 'medium' },
                                        { label: 'Large', value: 'large' },
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Header / Footer */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-neutral-100">Header &amp; Footer Text</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label className="mb-1.5 block text-sm">Header Text</Label>
                                    <Input
                                        value={data.header_text}
                                        onChange={e => setData('header_text', e.target.value)}
                                        placeholder="e.g. Restaurant tagline, welcome message…"
                                        maxLength={500}
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Shown below restaurant name on every printout</p>
                                </div>
                                <div>
                                    <Label className="mb-1.5 block text-sm">Footer Text</Label>
                                    <Input
                                        value={data.footer_text}
                                        onChange={e => setData('footer_text', e.target.value)}
                                        placeholder="e.g. Thank you for visiting!"
                                        maxLength={500}
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Shown at the bottom of every printout</p>
                                </div>
                            </div>
                        </div>

                        {/* Visibility Toggles */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-neutral-100">Show / Hide Sections</h3>
                            <div className="space-y-2">
                                <ToggleRow label="Show Logo" description="Print restaurant logo on the ticket" checked={data.show_logo} onChange={v => setData('show_logo', v)} />
                                <ToggleRow label="Show Customer Info" description="Print customer name &amp; phone" checked={data.show_customer_info} onChange={v => setData('show_customer_info', v)} />
                                <ToggleRow label="Show Order Type" description="Print dine-in / takeaway / delivery" checked={data.show_order_type} onChange={v => setData('show_order_type', v)} />
                                <ToggleRow label="Show Tax Details" description="Print GST / tax breakdown" checked={data.show_tax_details} onChange={v => setData('show_tax_details', v)} />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 dark:border-neutral-700 dark:bg-neutral-800/40">
                            <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-neutral-300">Preview</h3>
                            <div
                                className="mx-auto rounded border border-gray-200 bg-white p-4 font-mono shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                                style={{
                                    maxWidth: isThermal ? (data.paper_size === '58mm' ? '200px' : '280px') : '420px',
                                    fontSize: data.font_size === 'small' ? '10px' : data.font_size === 'large' ? '14px' : '12px',
                                }}
                            >
                                {data.show_logo && <p className="text-center text-xs text-gray-400">[Logo]</p>}
                                <p className="text-center font-bold">Restaurant Name</p>
                                {data.header_text && <p className="text-center">{data.header_text}</p>}
                                <p className="text-center">- - - - - - - - - - - - - -</p>
                                {data.print_type === 'kot_bill' && <p className="text-center font-bold">★ KOT ★</p>}
                                <p className="text-center font-bold">ORDER #12345</p>
                                <p className="text-center">- - - - - - - - - - - - - -</p>
                                {data.show_customer_info && <p>Customer: John Doe</p>}
                                {data.show_order_type && <p>Type: Dine In</p>}
                                <p className="text-center">- - - - - - - - - - - - - -</p>
                                <p>2x Butter Chicken  ₹360</p>
                                <p>1x Naan            ₹40</p>
                                <p className="text-center">- - - - - - - - - - - - - -</p>
                                {data.show_tax_details && <p>GST (5%):          ₹20</p>}
                                <p className="font-bold">TOTAL:            ₹420</p>
                                <p className="text-center">- - - - - - - - - - - - - -</p>
                                {data.footer_text && <p className="text-center">{data.footer_text}</p>}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={processing} className="bg-red-600 hover:bg-red-700 text-white">
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving…' : 'Save Settings'}
                            </Button>
                            {recentlySuccessful && (
                                <p className="text-sm text-green-600 dark:text-green-400">Settings saved!</p>
                            )}
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
