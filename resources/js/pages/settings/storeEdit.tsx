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
        title: 'Store settings',
        href: '/settings/store',
    },
];

type StoreForm = {
    store_name: string;
    store_email: string;
    store_phone: string;
    store_address: string;
    store_gst_no: string;
};

export default function StoreEdit() {
    const { auth, store } = usePage<SharedData & { store: any }>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<StoreForm>({
        store_name: store?.name || '',
        store_email: store?.email || '',
        store_phone: store?.phone || '',
        store_address: store?.address || '',
        store_gst_no: store?.gst_no || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('store.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Store Information" description="Update your store details" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="store_name">Store Name</Label>
                            <Input id="store_name" value={data.store_name} onChange={(e) => setData('store_name', e.target.value)} required />
                            <InputError className="mt-2" message={errors.store_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="store_email">Store Email</Label>
                            <Input id="store_email" type="email" value={data.store_email} onChange={(e) => setData('store_email', e.target.value)} />
                            <InputError className="mt-2" message={errors.store_email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="store_phone">Store Phone</Label>
                            <Input id="store_phone" value={data.store_phone} onChange={(e) => setData('store_phone', e.target.value)} />
                            <InputError className="mt-2" message={errors.store_phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="store_address">Store Address</Label>
                            <Input id="store_address" value={data.store_address} onChange={(e) => setData('store_address', e.target.value)} />
                            <InputError className="mt-2" message={errors.store_address} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="store_gst_no">GST Number</Label>
                            <Input id="store_gst_no" value={data.store_gst_no} onChange={(e) => setData('store_gst_no', e.target.value)} />
                            <InputError className="mt-2" message={errors.store_gst_no} />
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
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
