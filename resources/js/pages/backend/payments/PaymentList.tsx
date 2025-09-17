import React, { useState } from 'react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import OrderDetailsDialog from './OrderDetailsModal';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Payments', href: '/payments' },
];

export default function PaymentList({ payments }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Payments" />
      <OrderDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selectedOrder} />
      <div className="px-2 pt-4 sm:px-6 lg:px-10 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 w-full">
          <Heading title="Payments" description="All transaction records" />
        </div>
        <div className="w-full">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow border border-gray-200 dark:border-neutral-800 w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-[15px]">
              <thead>
                <tr className="bg-gray-100 dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-800">
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400">Order Number</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400">Amount</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400">Method</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400">Status</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400 hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3 text-left font-semibold uppercase text-xs tracking-wider text-gray-500 dark:text-neutral-400 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {payments.data.length > 0 ? (
                  payments.data.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
                    >
                      <td
                        className="px-5 py-4 font-bold text-gray-700 underline cursor-pointer"
                        onClick={() => {
                          if (payment.order) {
                            setSelectedOrder(payment.order);
                            setDialogOpen(true);
                          }
                        }}
                      >
                        {payment.order?.order_number || 'N/A'}
                      </td>
                      <td className="px-5 py-4 text-gray-800 dark:text-neutral-200">
                        ₹{Number(payment.amount_paid).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4 text-gray-700 dark:text-neutral-300">{payment.payment_method}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold
                          ${payment.status === 'paid'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'}
                        `}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-gray-800 dark:text-neutral-200">
                        {new Date(payment.created_at).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-gray-700 dark:text-neutral-300">
                        {payment.notes || <span className="text-gray-400 italic">---</span>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-7 text-center text-base text-gray-400 dark:text-neutral-500 font-medium">
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-wrap gap-2 mt-6 items-center justify-center">
            {payments.data.length > 0 &&
              payments.links.map((link, idx) => (
                <button
                  key={idx}
                  disabled={!link.url}
                  className={`px-3 py-1 text-sm border rounded font-medium transition
                    ${link.active ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-800 hover:bg-blue-100'}
                    ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                  onClick={() => link.url && router.visit(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
