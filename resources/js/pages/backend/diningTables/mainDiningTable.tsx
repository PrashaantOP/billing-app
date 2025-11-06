import React from 'react';
import { PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import AddTableModal from './AddTableModal';
import EditTableModal from './EditTableModal';
import Heading from '@/components/heading';

const breadcrumbs = [
  { title: 'Dining Tables', href: '/menu/items' },
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
  restaurantId: number;
  restaurantName: string;
};

export default function MainDiningTable({ tables, restaurantId, restaurantName }: Props) {
  const hasItems = (tables?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dining Tables" />

      <div className="w-full px-3 pt-4 sm:px-6 lg:px-4">
        {/* Header */}
        <div className="mb-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Heading title="Dinings Tables" description="Manage dining tables" />
          <div className="flex-grow" />
          <AddTableModal restaurantName={restaurantName} restaurantId={restaurantId} />
        </div>

        {/* Empty State */}
        {!hasItems && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
              <img
                src="/assets/images/fixedlogos/empty.png"
                alt="No dining tables"
                className="mb-4 h-44 w-44 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                No dining tables found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Add a new table to start assigning dine-in orders.
              </p>
              <div className="mt-4">
                <AddTableModal restaurantName={restaurantName} restaurantId={restaurantId} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cards (<= md) */}
        {hasItems && (
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {tables.map((table) => {
              const isReserved = !!table.is_reserved && !!table.current_dinein_order;
              return (
                <div
                  key={table.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-semibold text-gray-900 dark:text-neutral-100">
                          {table.name}
                        </p>
                        <span
                          className={[
                            'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium',
                            isReserved
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
                          ].join(' ')}
                          onClick={() => {
                            if (isReserved) {
                              router.get(`/orders-view?search=${table.current_dinein_order!.order_number}`);
                            }
                          }}
                          role="button"
                        >
                          {isReserved ? 'Reserved' : 'Available'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                        <span>Seats: {table.capacity}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-neutral-600" />
                        <span className="truncate">{table.restaurant?.name}</span>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start">
                      <EditTableModal table={table} />
                    </div>
                  </div>

                  {isReserved && (
                    <button
                      className="mt-3 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                      onClick={() => router.get(`/orders-view?search=${table.current_dinein_order!.order_number}`)}
                    >
                      View Order #{table.current_dinein_order!.order_number}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table (>= md) */}
        {hasItems && (
          <div className="hidden md:block">
            <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow dark:border-neutral-800 dark:bg-neutral-900">
              <table className="w-full min-w-[640px] table-auto text-[15px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                      Table Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                      Capacity
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400 md:table-cell">
                      Restaurant
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tables.map((table) => {
                    const isReserved = !!table.is_reserved && !!table.current_dinein_order;
                    return (
                      <tr
                        key={table.id}
                        className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-neutral-100">
                          {table.name}
                        </td>
                        <td className="px-5 py-4 text-gray-800 dark:text-neutral-200">{table.capacity}</td>
                        <td className="hidden px-5 py-4 text-gray-700 dark:text-neutral-300 md:table-cell">
                          {table.restaurant.name}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={[
                              'inline-block rounded-full px-3 py-1 text-xs font-bold',
                              isReserved
                                ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
                            ].join(' ')}
                            onClick={() => {
                              if (isReserved) {
                                router.get(`/orders-view?search=${table.current_dinein_order!.order_number}`);
                              }
                            }}
                            role="button"
                          >
                            {isReserved ? 'Reserved' : 'Available'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <EditTableModal table={table} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
