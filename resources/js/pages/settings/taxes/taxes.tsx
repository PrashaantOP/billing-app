import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import HeadingSmall from '@/components/heading-small';
import EditTaxes from './editTaxes';
import AddNewTax from './addTaxes';
import DeleteTaxButton from './deleteTax';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tax Settings', href: '/settings/taxes' },
];

type Tax = {
  id: number;
  name: string;
  rate: number | string;
  rate_type: 'percent' | 'amount';
  is_inclusive: number | boolean;
  created_at?: string;
  updated_at?: string;
};

export default function TaxManagement() {
  const { taxes } = usePage<SharedData & { taxes: Tax[] }>().props as { taxes: Tax[] };

  const hasItems = (taxes?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tax Settings" />

      <SettingsLayout>
        <div className="max-w-xl space-y-6">
          {/* Header + CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <HeadingSmall title="Manage Taxes" description="Add or update your taxes" />
            </div>
            <div className="shrink-0">
              <AddNewTax varient="destructive" size="lg" />
            </div>
          </div>

          {/* Empty State (no thead when empty) */}
          {!hasItems && (
            <div className="w-full">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
                <img
                  src="/assets/images/fixedlogos/empty.png"
                  alt="No taxes"
                  className="mb-4 h-44 w-44 object-contain"
                />
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-neutral-100">
                  No Taxes Found
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  You have not added any taxes yet. Click the button to add your first tax.
                </p>
                <div className="mt-4">
                  <AddNewTax varient="destructive" size="lg" />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Cards (<= md) */}
          {hasItems && (
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {taxes.map((tax) => {
                const active = Number(tax.is_inclusive) === 1;
                return (
                  <div
                    key={tax.id}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-gray-900 dark:text-neutral-100">
                          {tax.name}
                        </p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
                          Rate: {tax.rate_type === 'percent' ? `${tax.rate}%` : `₹${tax.rate}`}
                        </p>
                        <span
                          className={[
                            'mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium',
                            active
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
                          ].join(' ')}
                        >
                          {active ? 'Active' : 'Not Active'}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-start gap-2">
                        <EditTaxes taxes={tax} />
                        <DeleteTaxButton id={tax.id} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Desktop Table (>= md) — thead hidden if empty */}
          {hasItems && (
            <div className="hidden md:block">
              <div className="block overflow-hidden rounded-lg border border-gray-200 dark:border-neutral-700">
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-neutral-700">
                    {/* thead only when there are items */}
                    <thead className="bg-gray-50 dark:bg-neutral-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                          Rate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-neutral-400">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                      {taxes.map((tax) => {
                        const active = Number(tax.is_inclusive) === 1;
                        return (
                          <tr key={tax.id} className="bg-white dark:bg-neutral-900">
                            <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                              {tax.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                              {tax.rate_type === 'percent' ? `${tax.rate}%` : `₹${tax.rate}`}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium">
                              <span
                                className={[
                                  'rounded-full px-3 py-1 text-xs font-medium',
                                  active
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                                ].join(' ')}
                              >
                                {active ? 'Active' : 'Not Active'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right text-sm font-medium">
                              <div className="flex justify-end gap-x-3">
                                <EditTaxes taxes={tax} />
                                <DeleteTaxButton id={tax.id} />
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
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
