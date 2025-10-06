import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';

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
    logo: File | null;
};

export default function StoreEdit() {
    const { auth, store } = usePage<SharedData & { store: any }>().props;
    const [logoPreview, setLogoPreview] = useState<string | null>(
        store?.logo ? `/assets/images/logos/${store.logo}` : null
    );
    const [removeLogoFlag, setRemoveLogoFlag] = useState(false);

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<StoreForm>({
        store_name: store?.name || '',
        store_email: store?.email || '',
        store_phone: store?.phone || '',
        store_address: store?.address || '',
        store_gst_no: store?.gst_no || '',
        logo: null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setLogoPreview(previewUrl);
        }
    };

    const removeLogo = () => {
    setData('logo', null);
    setLogoPreview(null);
    setRemoveLogoFlag(true); // marking for backend
    // Reset file input
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
};

    const submit: FormEventHandler = (e) => {
    e.preventDefault();
    
    // Create FormData manually to handle file uploads with PATCH
    const formData = new FormData();
    formData.append('store_name', data.store_name);
    formData.append('store_email', data.store_email);
    formData.append('store_phone', data.store_phone);
    formData.append('store_address', data.store_address);
    formData.append('store_gst_no', data.store_gst_no);
    formData.append('_method', 'PATCH'); // Method spoofing
    
    if (data.logo) {
        formData.append('logo', data.logo);
    }

    if (removeLogoFlag) {
        formData.append('remove_logo', '1');
    }

    // Use post with FormData
    router.post(route('store.update'), formData, {
        preserveScroll: true,
        onSuccess: () => {
            setRemoveLogoFlag(false); // reset flag
            router.visit('/settings/store'); // redirect after success
        }
    });
};


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Store Settings" />

            <SettingsLayout>
                <div className="space-y-6 max-w-xl">
                    <HeadingSmall title="Store Information" description="Update your store details" />

                    <form onSubmit={submit} className="space-y-6">
                        {/* Logo Upload Section */}
                        <div className="grid gap-4">
                            <Label htmlFor="logo">Store Logo</Label>
                            
                            {/* Logo Preview/Upload Area */}
                            <div className="flex items-center gap-4">
                                {/* Preview Container */}
                                <div className="relative">
                                    {logoPreview ? (
                                        <div className="relative">
                                            <img
                                                src={logoPreview}
                                                alt="Store Logo"
                                                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-neutral-800">
                                            <Camera className="w-8 h-8 text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button */}
                                <div className="flex-1">
                                    <label
                                        htmlFor="logo"
                                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md font-semibold text-xs text-gray-700 dark:text-neutral-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-25 transition ease-in-out duration-150 cursor-pointer"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {logoPreview ? 'Change Logo' : 'Upload Logo'}
                                    </label>
                                    <input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
                                        PNG, JPG, GIF up to 500KB
                                    </p>
                                </div>
                            </div>
                            <InputError className="mt-2" message={errors.logo} />
                        </div>

                        {/* Store Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="store_name">Store Name</Label>
                            <Input 
                                id="store_name" 
                                value={data.store_name} 
                                onChange={(e) => setData('store_name', e.target.value)} 
                                required 
                            />
                            <InputError className="mt-2" message={errors.store_name} />
                        </div>

                        {/* Store Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="store_email">Store Email</Label>
                            <Input 
                                id="store_email" 
                                type="email" 
                                value={data.store_email} 
                                onChange={(e) => setData('store_email', e.target.value)} 
                            />
                            <InputError className="mt-2" message={errors.store_email} />
                        </div>

                        {/* Store Phone */}
                        <div className="grid gap-2">
                            <Label htmlFor="store_phone">Store Phone</Label>
                            <Input 
                                id="store_phone" 
                                value={data.store_phone} 
                                onChange={(e) => setData('store_phone', e.target.value)} 
                            />
                            <InputError className="mt-2" message={errors.store_phone} />
                        </div>

                        {/* Store Address */}
                        <div className="grid gap-2">
                            <Label htmlFor="store_address">Store Address</Label>
                            <Input 
                                id="store_address" 
                                value={data.store_address} 
                                onChange={(e) => setData('store_address', e.target.value)} 
                            />
                            <InputError className="mt-2" message={errors.store_address} />
                        </div>

                        {/* GST Number */}
                        <div className="grid gap-2">
                            <Label htmlFor="store_gst_no">GST Number</Label>
                            <Input 
                                id="store_gst_no" 
                                value={data.store_gst_no} 
                                onChange={(e) => setData('store_gst_no', e.target.value)} 
                            />
                            <InputError className="mt-2" message={errors.store_gst_no} />
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved Successfully!</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
