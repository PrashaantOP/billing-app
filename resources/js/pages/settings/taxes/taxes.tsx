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
import toast from 'react-hot-toast';
import EditTaxes from './editTaxes';
import AddNewTax from './addTaxes';
import DeleteTaxButton from './deleteTax';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tax Settings',
        href: '/settings/taxes',
    },
];

// type TaxForm = {
//     name: string;
//     rate: string;
//     rate_type: 'percent' | 'amount';
//     is_inclusive: boolean;
// };

export default function TaxManagement() {
    const { taxes } = usePage<SharedData & { taxes: any[] }>().props;


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tax Settings" />

            <SettingsLayout>
                <div className="space-y-6 max-w-xl ">
                  <div className="flex flex-row items-center justify-between">
                      <div className="flex w-1/2">
                      <HeadingSmall title="Manage Taxes" description="Add or update your taxes" />
                      </div>
                      <div className="flex w-1/2 justify-end">
                      <AddNewTax varient={'destructive'} size={'lg'} />
                      </div>
                  </div>


                    {/* Add / Update Form */}


{/* table start  */}
<div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 block">
<div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
    <thead className="bg-gray-50 dark:bg-neutral-700 hidden md:table-header-group">
      <tr>
        {["Name", "Rate", "Status", "Action"].map((heading) => (
          <th
            key={heading}
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ${
              heading === "Action" ? "text-end" : ""
            }`}
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {taxes.length > 0 ? (
        taxes.map((tax) => (
        <tr key={tax.id} className="md:table-row block md:table-row border-b md:border-0 p-4 md:p-0">
          <td className="block md:table-cell px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
            <span className="md:hidden font-semibold">Name: </span>
            {tax.name}
          </td>
          <td className="block md:table-cell px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
            <span className="md:hidden font-semibold">Rate: </span>
            {tax.rate_type === 'percent' ? `${tax.rate}%` : `₹${tax.rate}`}
          </td>
          <td className="block md:table-cell px-6 py-4 text-sm font-medium">
            <span className="md:hidden font-semibold">Status: </span>
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
          <td className="block md:table-cell px-6 py-4 text-end text-sm font-medium">
            <div className="flex md:justify-end gap-x-3 mt-2 md:mt-0">
              <EditTaxes taxes={tax} />
              <DeleteTaxButton id={tax.id} />
            </div>
          </td>
        </tr>
      ))): (
        <tr>
    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400">
      No taxes available
    </td>
  </tr>
    )}
    </tbody>
  </table>
</div>

    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
