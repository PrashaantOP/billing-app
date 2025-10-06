import AppLayout from '@/layouts/app-layout'
import React, { useEffect, useState } from 'react'
import { Head, router } from '@inertiajs/react'
import Heading from '@/components/heading'
import { BreadcrumbItem } from '@/types'
import { OrderActionDropdown } from './OrderActionDropdown'
import dayjs from 'dayjs'
import { FilePlus, IndianRupee } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { OrderStatus } from './OrderStatus'
import PaymentStatus from './PaymentStatus'
import OrderDetailsDialog from '../payments/OrderDetailsModal'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Orders',
    href: '/orders-view',
  },
]

const OrderMain = ({ orders, filters }) => {
  const [search, setSearch] = useState(filters?.search || '')
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
      <OrderDetailsDialog open={dialogOpen} onOpenChange={setDialogOpen} order={selectedOrder} />
      <div className="px-4 py-6">
        <Heading title="Orders" description="Manage your orders" />
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
          {/* Search & New Order Button */}
          <div className="mb-4 flex flex-col sm:flex-row sm:justify-between gap-3">
            <Input
              type="text"
              placeholder="Search by customer name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:max-w-sm"
            />
            <button
              onClick={() => router.get('/newbill')}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
              <FilePlus className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>

          {/* MOBILE cards */}
          <div className="block md:hidden space-y-3">
  {orders.data.map((order) => (
    <div
      key={order.id}
      className="bg-white dark:bg-neutral-800 rounded-xl shadow-md border border-gray-100 dark:border-neutral-700 overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-neutral-700 dark:to-neutral-600 px-4 py-3 border-b border-gray-100 dark:border-neutral-600">
        <div className="flex justify-between items-center">
          <div 
            className="flex-1 cursor-pointer"
            
          >
            <div className="font-bold text-lg text-red-700 dark:text-red-400" onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}>
              #{order.order_number}
            </div>
            <div className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
              {dayjs(order.created_at).format('DD MMM YYYY, hh:mm A')}
            </div>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <OrderActionDropdown order={{ restaurant_id: order.restaurant_id, orderid: order.id }} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div 
        className="p-4 cursor-pointer"
        // onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}
      >
        <div className="space-y-3">
          {/* Customer Info */}
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-300 text-xs font-semibold">
                {order.customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-neutral-100">
                {order.customer.name}
              </div>
              <div className="text-sm text-gray-500 dark:text-neutral-400">
                {order.customer.phone}
              </div>
            </div>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                Order Type
              </div>
              <div className="mt-1">
                <OrderStatus
                  orderId={order.id}
                  ordertype={order.order_type}
                  dining_table_name={order.dining_table?.name}
                  order_status={order.status}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
                Payment
              </div>
              <div className="mt-1">
                <PaymentStatus orderId={order.id} paymentStatus={order.payment_status} />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Total Amount
              </span>
              <span className="flex items-center font-bold text-lg text-green-700 dark:text-green-400">
                <IndianRupee className="w-4 h-4 mr-1" />
                {order.total}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))}

  {/* Pagination on mobile */}
  {orders.total > orders.per_page && (
    <div className="flex flex-wrap gap-2 mt-6 px-2">
      {orders.links.map((link, index) => (
        <button
          key={index}
          disabled={!link.url}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200
            ${link.active 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700'
            }
            ${!link.url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={() => {
            if (link.url) {
              router.get(link.url, {}, { preserveState: true })
            }
          }}
          dangerouslySetInnerHTML={{ __html: link.label }}
        />
      ))}
    </div>
  )}
</div>


          {/* DESKTOP/TABLET TABLE */}
          <div className="hidden md:block relative min-h-[40vh] flex-1 rounded-xl">
            <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">#</th>
                    <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Order no</th>
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
                      <td
                        className="px-6 py-4 underline font-bold text-gray-700 cursor-pointer"
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
                        <div className="flex flex-row justify-start items-center gap-1">
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

              {/* Pagination for table */}
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
