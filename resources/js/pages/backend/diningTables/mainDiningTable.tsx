import React from 'react';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddTableModal from './AddTableModal';
import EditTableModal from './EditTableModal';

const breadcrumbs = [
  { title: 'Menu Items', href: '/menu/items' },
];

type Restaurant = {
  id: number;
  name: string;
};
type DiningTable = {
  id: number;
  restaurant_id: number;
  name: string;
  capacity: number;
  created_at: string;
  updated_at: string;
  restaurant: Restaurant;
  is_reserved?: boolean;
  current_dinein_order?: { order_number: string };
};

type Props = PageProps & {
  tables: DiningTable[];
};

export default function MainDiningTable({ tables, restaurantId, restaurantName }: Props) {

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Menu Items" />
      <div className="px-2 pt-4 sm:px-6 lg:px-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 w-full">
          <h1 className="text-2xl font-bold">Dining Tables</h1>
          <div className="flex-grow" />
          <AddTableModal restaurantName={restaurantName} restaurantId={restaurantId} />
        </div>
        <div className="w-full">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-gray-200 dark:border-neutral-800 w-full overflow-x-auto">
            <table className="min-w-[640px] w-full text-[15px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800">
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide text-gray-500 dark:text-neutral-400">Table Name</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide text-gray-500 dark:text-neutral-400">Capacity</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide text-gray-500 dark:text-neutral-400 hidden md:table-cell">Restaurant</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide text-gray-500 dark:text-neutral-400">Status</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wide text-gray-500 dark:text-neutral-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <tr key={table.id}
                        className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-neutral-100">{table.name}</td>
                      <td className="px-5 py-4 text-gray-800 dark:text-neutral-200">{table.capacity}</td>
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300 hidden md:table-cell">{table.restaurant.name}</td>
                      <td className="px-5 py-4">
                        {table.is_reserved && table.current_dinein_order ? (
                          <span
                            className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 cursor-pointer"
                            onClick={() =>
                              router.get(`/orders-view?search=${table.current_dinein_order.order_number}`)
                            }
                          >
                            Reserved
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <EditTableModal table={table} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-7 text-center text-base text-gray-400 dark:text-neutral-500 font-medium">
                      No dining tables found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
