import React, { useState } from 'react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import OrderDetailsDialog from './OrderDetailsModal';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payments', href: '/payments' },
];

type Payment = {
  id: number;
  amount_paid: number | string;
  payment_method: string;
  status: 'paid' | 'pending' | 'failed' | string;
  notes?: string | null;
  created_at: string;
  order?: { order_number: string; /* include other props if used in modal */ };
};

type Props = {
  payments: {
    data: Payment[];
    total?: number;
    per_page?: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
};

export default function PaymentList({ payments }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Payment['order'] | null>(null);

  const hasItems = (payments?.data?.length ?? 0) > 0;

  const formatAmount = (amt: Payment['amount_paid']) =>
    `₹${Number(amt).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  const statusPill = (status: string) => {
    const s = status?.toLowerCase();
    const base = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold';
    if (s === 'paid') return `${base} bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200`;
    if (s === 'failed') return `${base} bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200`;
    return `${base} bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200`;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payments" />
      <OrderDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selectedOrder} />

      <div className="w-full px-3 pt-4 sm:px-6 lg:px-4">
        {/* Header */}
        <div className="mb-4 flex w-full flex-col gap-2 sm:flex-row sm:items-center">
          <Heading title="Payments" description="All transaction records" />
        </div>

        {/* Empty State */}
        {!hasItems && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
              <img
                src="/assets/images/fixedlogos/empty.png"
                alt="No payments"
                className="mb-4 h-44 w-44 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                No payments found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Payments will appear here once orders are settled.
              </p>
              <div className="mt-4">
                <a
                  href="/orders-view"
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  View Orders
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cards (<= md) */}
        {hasItems && (
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {payments.data.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        className="truncate text-base font-semibold text-red-700 underline dark:text-red-400"
                        onClick={() => {
                          if (p.order) {
                            setSelectedOrder(p.order);
                            setDialogOpen(true);
                          }
                        }}
                      >
                        #{p.order?.order_number || 'N/A'}
                      </button>
                      <span className={statusPill(p.status)}>{p.status}</span>
                    </div>
                    <div className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      {new Date(p.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-base font-bold text-gray-900 dark:text-neutral-100">
                      {formatAmount(p.amount_paid)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-neutral-400">
                      {p.payment_method}
                    </div>
                  </div>
                </div>

                {p.notes && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {p.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Desktop Table (>= md) */}
        {hasItems && (
          <div className="hidden md:block">
            <div className="w-full overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow dark:border-neutral-800 dark:bg-neutral-900">
              <table className="w-full min-w-[700px] table-auto text-[15px]">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-100 dark:border-neutral-800 dark:bg-neutral-800">
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                      Order Number
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                      Amount
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                      Method
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                      Status
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400 sm:table-cell">
                      Date
                    </th>
                    <th className="hidden px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400 md:table-cell">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.data.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
                    >
                      <td
                        className="px-5 py-4 font-bold text-gray-700 underline hover:text-red-700 dark:text-neutral-200 dark:hover:text-red-400 cursor-pointer"
                        onClick={() => {
                          if (p.order) {
                            setSelectedOrder(p.order);
                            setDialogOpen(true);
                          }
                        }}
                      >
                        {p.order?.order_number || 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-gray-800 dark:text-neutral-200">
                        {formatAmount(p.amount_paid)}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">{p.payment_method}</td>
                      <td className="px-5 py-4">
                        <span className={statusPill(p.status)}>{p.status}</span>
                      </td>
                      <td className="hidden px-5 py-4 text-gray-800 dark:text-neutral-200 sm:table-cell">
                        {new Date(p.created_at).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="hidden px-5 py-4 text-gray-700 dark:text-neutral-300 md:table-cell">
                        {p.notes || <span className="italic text-gray-400">---</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {hasItems &&
            payments.links.map((link, idx) => (
              <button
                key={idx}
                disabled={!link.url}
                className={[
                  'px-3 py-1 text-sm rounded font-medium transition',
                  link.active
                    ? 'bg-red-600 text-white shadow'
                    : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700',
                  !link.url ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                ].join(' ')}
                onClick={() => link.url && router.visit(link.url)}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
