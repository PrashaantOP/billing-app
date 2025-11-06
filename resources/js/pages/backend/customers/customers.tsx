import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import NewCustomer from './newCustomer';
import EditCustomer from './editCustomer';
import DeleteCustomerButton from './deleteCustomer';
import SearchAddUpdateSelectCustomer from './searchAddUpdateCustomer';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Customers', href: '/customers' },
];

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  customers: {
    data: Customer[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
};

export default function Customers({ customers }: Props) {
  const hasItems = (customers?.data?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customers" />

      {/* Header */}
      <div className="w-full px-4 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Heading title="Our Customers" description="Manage our customers" />
          <div className="flex items-center gap-2 justify-end">
            <SearchAddUpdateSelectCustomer />
            {/* Optional quick add: */}
            {/* <NewCustomer /> */}
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
                alt="No customers"
                className="mb-4 h-40 w-40 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                No customers found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Add your first customer or import from your records.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <NewCustomer />
                {/* <SearchAddUpdateSelectCustomer /> */}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cards (<= md) */}
        {hasItems && (
          <div className="space-y-3 md:hidden">
            {customers.data.map((c) => {
              const created = new Date(c.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={c.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-gray-900 dark:text-neutral-100">
                        {c.name}
                      </p>
                      <div className="mt-1 space-y-1 text-sm">
                        <p className="text-gray-700 dark:text-neutral-300">
                          {c.phone || '—'}
                        </p>
                        {c.email && (
                          <p className="truncate text-gray-500 dark:text-neutral-400">
                            {c.email}
                          </p>
                        )}
                        {c.address && (
                          <p className="line-clamp-2 text-gray-500 dark:text-neutral-400">
                            {c.address}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start gap-2">
                      <EditCustomer key={c.id + '-' + c.updated_at} customer={c} />
                      <DeleteCustomerButton id={c.id} />
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
                    {customers.data.map((c) => {
                      const created = new Date(c.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <tr key={c.id} className="bg-white dark:bg-neutral-900">
                          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {c.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {c.phone || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {c.email || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">
                            {c.address || '—'}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-neutral-300">
                            {created}
                          </td>
                          <td className="px-4 py-4 text-right text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <EditCustomer
                                key={c.id + '-' + c.updated_at}
                                customer={c}
                              />
                              <DeleteCustomerButton id={c.id} />
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
              {customers.links.map((link, index) => {
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
