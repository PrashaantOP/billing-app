import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Our Restaurants', href: '/restaurants/view' },
];

type Restaurant = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  restaurants: {
    data: Restaurant[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  current_restaurant_id: number | null;
};

export default function RestaurantsMain({ restaurants, current_restaurant_id }: Props) {
  const hasItems = (restaurants?.data?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Restaurants" />

      {/* Header */}
      <div className="w-full px-4 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Heading
            title="Our Restaurants"
            description="Manage our restaurants — create and edit"
          />
          <div className="flex justify-end">
            {/* Add button or filters if needed */}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Empty State */}
        {!hasItems && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
              <img
                src="/assets/images/fixedlogos/empty.png"
                alt="No restaurants"
                className="mb-4 h-40 w-40 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                No restaurants found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Create a restaurant to get started and manage your store details.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Cards (<= md) */}
        {hasItems && (
          <div className="space-y-3 md:hidden">
            {restaurants.data.map((r) => {
              const created = new Date(r.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isCurrent = r.id === current_restaurant_id;

              return (
                <div
                  key={r.id}
                  className={[
                    'rounded-xl border p-4 shadow-sm',
                    'border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900',
                    isCurrent ? 'ring-2 ring-red-500/40' : '',
                  ].join(' ')}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-base font-semibold text-gray-900 dark:text-neutral-100">
                          {r.name}
                        </p>
                        {isCurrent && (
                          <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                            current
                          </span>
                        )}
                      </div>

                      <div className="mt-1 space-y-1 text-sm">
                        <p className="text-gray-700 dark:text-neutral-300">
                          {r.phone || '—'}
                        </p>
                        {r.email && (
                          <p className="truncate text-gray-500 dark:text-neutral-400">
                            {r.email}
                          </p>
                        )}
                        {r.address && (
                          <p className="line-clamp-2 text-gray-500 dark:text-neutral-400">
                            {r.address}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-start gap-2">
                      {isCurrent ? (
                        <Link
                          href="/settings/store"
                          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                          aria-label="Edit current restaurant"
                        >
                          <Pencil className="mr-1 h-4 w-4" />
                          Edit
                        </Link>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
                    <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-neutral-800">
                      {created}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table (>= md) */}
        {hasItems && (
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Mobile
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {restaurants.data.map((r) => {
                      const created = new Date(r.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const isCurrent = r.id === current_restaurant_id;

                      return (
                        <tr
                          key={r.id}
                          className={[
                            'bg-white dark:bg-neutral-900',
                            isCurrent ? 'outline outline-1 -outline-offset-0 outline-red-300/60 dark:outline-red-800/50' : '',
                          ].join(' ')}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {r.name} {isCurrent && <span className="text-red-600">(current)</span>}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {r.phone || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {r.email || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {r.address || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-neutral-300">
                            {created}
                          </td>
                          <td className="px-4 py-4 text-right text-sm">
                            <div className="flex items-center justify-end gap-2">
                              {isCurrent ? (
                                <Link
                                  href="/settings/store"
                                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                  aria-label="Edit current restaurant"
                                >
                                  <Pencil className="mr-1 h-4 w-4" />
                                  Edit
                                </Link>
                              ) : (
                                <span className="text-gray-400">—</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {hasItems && (
          <div className="sticky bottom-2 mt-4 flex w-full items-center justify-center gap-2 px-1">
            <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              {restaurants.links.map((link, index) => {
                const isDisabled = !link.url;
                const isActive = link.active;
                const isEllipsis =
                  typeof link.label === 'string' && link.label.includes('...');

                return (
                  <button
                    key={index}
                    disabled={isDisabled}
                    onClick={() => {
                      if (link.url) router.visit(link.url);
                    }}
                    className={[
                      'min-w-8 px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                      isEllipsis ? 'pointer-events-none' : '',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
