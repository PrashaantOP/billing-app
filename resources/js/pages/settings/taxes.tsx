import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Trash, Pencil, Circle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

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
    const [dataa, setDataa] = useState({ is_inclusive: false });

    const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm<TaxForm>({
        name: '',
        rate: '',
        rate_type: 'percent',
        is_inclusive: false,
    });

    const [rateType, setRateType] = useState({
        rate_type: 'percent' as 'percent' | 'amount',
        rate: '',
      });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // If editing an existing tax, use patch
        post(route('taxes.store'), {
            preserveScroll: true,
        });
    };

    const label = rateType.rate_type === 'amount' ? 'Amount (₹)' : 'Rate (%)';
  const placeholder = rateType.rate_type === 'amount' ? 'Enter amount in ₹' : 'Enter rate in %';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Manage Taxes" description="Add or update your taxes" />

                    {/* Add / Update Form */}
                    {/* <form onSubmit={submit} className="space-y-6">
                    </form> */}
                        <div className="">
                            <Label htmlFor="name">Tax Name</Label>
                            <Input
                                id="name"
                                value={rateType.name}
                                onChange={(e) => setRateType('name', e.target.value)}
                                required
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        <div className="flex flex-col items-start justify-start w-full gap-6">
                            <div className='w-full'>
                            <Label htmlFor="rate_type">Rate Type</Label>
                                <select
                                id="rate_type"
                                value={rateType.rate_type}
                                onChange={(e) => setRateType(prev => ({ ...prev, rate_type: e.target.value as 'percent' | 'amount' }))}
                                className="border rounded px-3 py-2 mt-1 text-sm w-full"
                                >
                                <option value="percent">Percent (%)</option>
                                <option value="amount">Fixed Amount (₹)</option>
                                </select>
                                <InputError className="mt-2" message={errors.rate_type} />
                            </div>

                            <div className='w-full'>
                            <Label htmlFor="rate">{label}</Label>

                            {rateType.rate_type === 'percent' ? (
                                <select
                                id="rate"
                                value={rateType.rate}
                                onChange={(e) => setRateType(prev => ({ ...prev, rate: e.target.value }))}
                                required
                                className="border rounded px-3 py-2 text-sm w-full"
                                >
                                <option value="">Select a value</option>
                                {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                    {num}%
                                    </option>
                                ))}
                                </select>
                            ) : (
                                <Input
                                id="rate"
                                type="number"
                                step="0.01"
                                value={rateType.rate}
                                onChange={(e) => setRateType(prev => ({ ...prev, rate: e.target.value }))}
                                placeholder={placeholder}
                                required
                                />
                            )}

                            <InputError className="mt-2" message={errors.rate} />
                            </div>

                        </div>


                        <div className="flex items-center gap-3">
                            <div className="relative w-7 h-7">
                                <input
                                type="checkbox"
                                id="is_inclusive"
                                checked={dataa.is_inclusive}
                                onChange={(e) => setDataa({ is_inclusive: e.target.checked })}
                                className="peer sr-only"
                                />
                                <motion.div
                                className="w-full h-full flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-inner"
                                animate={{
                                    backgroundColor: dataa.is_inclusive ? '#22c55e' : '#ffffff',
                                    borderColor: dataa.is_inclusive ? '#22c55e' : '#d1d5db',
                                    transition: { type: 'spring', stiffness: 300, damping: 20 }
                                }}
                                >
                                <AnimatePresence mode="wait">
                                    {dataa.is_inclusive ? (
                                    <motion.div
                                        key="checked"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    >
                                        <CheckCircle2 size={20} className="text-white" />
                                    </motion.div>
                                    ) : (
                                    <motion.div
                                        key="unchecked"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    >
                                        <Circle size={20} className="text-gray-400" />
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                                </motion.div>
                            </div>
                            <Label htmlFor="is_inclusive" className="text-sm font-medium cursor-pointer">
                                Status
                            </Label>
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
                    {/* </form> */}

{/* table start  */}
<h3 className="text-lg font-semibold mt-10">Existing Taxes</h3>
<div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 hidden sm:block">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
        <thead className="bg-gray-50 dark:bg-neutral-700">
          <tr>
            {["Name", "Rate", "Status", "Action"].map((heading) => (
              <th
                key={heading}
                className={`px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ${
                  heading === "Action" ? "text-end" : ""
                }`}
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {taxes.map((tax) => (
            <tr key={tax.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                {tax.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                {tax.rate_type === 'percent' ? `${tax.rate}%` : `₹${tax.rate}`}
              </td>



              <td className="px-6 py-4 text-sm font-medium">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    tax.is_inclusive === 1
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {tax.is_inclusive ? 'Active' : 'Not Active'}
                </span>
              </td>
              <td className="px-6 py-4 text-end text-sm font-medium">
                <div className="flex gap-x-3 justify-end">
                  {/* <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
                    <Eye className="w-4 h-4" />
                  </a> */}
                  <a href="#" className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
                    <Pencil className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                    <Trash className="w-4 h-4" />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
