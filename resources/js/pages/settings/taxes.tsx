import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tax Settings',
        href: '/settings/taxes',
    },
];

type TaxForm = {
    name: string;
    rate: string;
    rate_type: 'percent' | 'amount';
    is_inclusive: boolean;
};

export default function TaxManagement() {
    const { taxes } = usePage<SharedData & { taxes: any[] }>().props;

    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm<TaxForm>({
        name: '',
        rate: '',
        rate_type: 'percent',
        is_inclusive: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // If editing an existing tax, use patch
        post(route('taxes.store'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Manage Taxes" description="Add or update your taxes" />

                    {/* Add / Update Form */}
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Tax Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rate">Rate</Label>
                            <Input
                                id="rate"
                                type="number"
                                step="0.01"
                                value={data.rate}
                                onChange={(e) => setData('rate', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.rate} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rate_type">Rate Type</Label>
                            <select
                                id="rate_type"
                                value={data.rate_type}
                                onChange={(e) => setData('rate_type', e.target.value as 'percent' | 'amount')}
                                className="border rounded px-3 py-2 text-sm"
                            >
                                <option value="percent">Percent (%)</option>
                                <option value="amount">Fixed Amount (₹)</option>
                            </select>
                            <InputError className="mt-2" message={errors.rate_type} />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_inclusive"
                                checked={data.is_inclusive}
                                onChange={(e) => setData('is_inclusive', e.target.checked)}
                            />
                            <Label htmlFor="is_inclusive" className="text-sm">Inclusive Tax?</Label>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>

                    {/* Existing Taxes */}
                    <div className="space-y-4 pt-8">
                        <h3 className="text-lg font-semibold">Existing Taxes</h3>
                        <ul className="divide-y">
                            {taxes.map((tax) => (
                                <li key={tax.id} className="py-2 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{tax.name}</p>
                                        <p className="text-sm text-neutral-500">
                                            {tax.rate_type === 'percent' ? `${tax.rate}%` : `₹${tax.rate}`} {tax.is_inclusive ? '(Inclusive)' : ''}
                                        </p>
                                    </div>
                                    {/* Future: Add Edit/Delete buttons here */}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
