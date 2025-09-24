import AppLayout from '@/layouts/app-layout'
import React, { useEffect, useState } from 'react'
import { Head, usePage, router } from '@inertiajs/react'
import Heading from '@/components/heading'
import { BreadcrumbItem } from '@/types'
import { OrderActionDropdown } from './OrderActionDropdown'
import dayjs from 'dayjs'
import { IndianRupee } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { OrderStatus } from './OrderStatus'
import PaymentStatus from './PaymentStatus'
import OrderDetailsDialog from '../payments/OrderDetailsModal'

// --- Add the Dialog import ---
// import OrderDetailsDialog from './OrderDetailsModal'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orders',
    href: '/orders-view',
  },
]

const OrderMain = ({ orders, filters }) => {
  const [search, setSearch] = useState(filters?.search || '')
  // MODAL STATE
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      router.get('/orders-view', { search }, { preserveState: true, replace: true })
    }, 500)
    return () => clearTimeout(delayDebounce)
  }, [search])

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Our orders" />

      {/* Order Details Modal */}
      <OrderDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selectedOrder} />

      <div className="px-4 py-6">
        <Heading title="Orders" description="Manage your orders" />

        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 ">
          <div className="mb-4 flex justify-between items-center">
            <Input
              type="text"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
          </div>
          <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
            <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">#</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Order no</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Customer Details</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Order type</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Total Price</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Payment Status</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Created at</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {orders.data.map((order, index) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                        {orders.from + index}
                      </td>
                      {/* ----- MODAL TRIGGER HERE ----- */}
                      <td
                        className="px-6 py-4 hidden md:table-cell underline font-bold text-gray-700 cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order)
                          setDialogOpen(true)
                        }}
                      >
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                        {order.customer.name}<br />
                        <span className="text-xs font-extralight">{order.customer.phone}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200 hidden lg:table-cell capitalize">
                        <OrderStatus
                          orderId={order.id}
                          ordertype={order.order_type}
                          dining_table_name={order.dining_table?.name}
                          order_status={order.status}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
                        <div className="flex flex-row justify-start align-items gap-1">
                          <IndianRupee className='w-3 h-full' height={40} /> {order.total}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium capitalize">
                        <PaymentStatus
                          orderId={order.id}
                          paymentStatus={order.payment_status}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {dayjs(order.created_at).format('DD MMM YYYY, hh:mm A')}
                      </td>
                      <td className="px-6 py-4 text-end text-sm font-medium">
                        <OrderActionDropdown order={{ restaurant_id: order.restaurant_id, orderid: order.id }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.total > orders.per_page && (
                <div className="flex space-x-2 mt-4 p-4 justify-start">
                  {orders.links.map((link, index) => (
                    <button
                      key={index}
                      disabled={!link.url}
                      className={`px-3 py-1 text-sm border rounded cursor-pointer
                        ${link.active ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600'}
                        ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => {
                        if (link.url) {
                          router.get(link.url, {}, { preserveState: true });
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default OrderMain
