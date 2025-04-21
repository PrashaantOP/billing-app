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
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Store settings',
        href: '/settings/store',
    },
];

// type StoreForm = {
//     store_name: string;
//     store_email: string;
//     store_phone: string;
//     store_address: string;
//     store_gst_no: string;
// };

type CreateNewBillProps = {
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
}


export default function CreateNewBill({ categories }: CreateNewBillProps) {
    // const { auth, store } = usePage<SharedData & { store: any }>().props;

    // const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<StoreForm>({
    //     store_name: store?.name || '',
    //     store_email: store?.email || '',
    //     store_phone: store?.phone || '',
    //     store_address: store?.address || '',
    //     store_gst_no: store?.gst_no || '',
    // });

    // const submit: FormEventHandler = (e) => {
    //     e.preventDefault();

    //     patch(route('store.update'), {
    //         preserveScroll: true,
    //     });
    // };
    console.log(categories);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Settings" />

            <NewBillLayout categories={categories}>
                <div className="space-y-6">
                    <HeadingSmall title="Store Information" description="Update your store details" />

                    
                </div>
            </NewBillLayout>
        </AppLayout>
    );
}
