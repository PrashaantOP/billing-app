import AppLayout from '@/layouts/app-layout'
import React from 'react'
import { Head } from '@inertiajs/react'
import Heading from '@/components/heading'
import { BreadcrumbItem } from '@/types'
import { OrderActionDropdown } from './OrderActionDropdown'
import dayjs from 'dayjs'
import { IndianRupee, ReceiptIndianRupee } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Orders',
        href: '/orders-view',
    },
];

const OrderMain = ({orders}) => {
  console.log(orders);
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Our orders" />
            <div className="px-4 py-6">
              <Heading title="Orders" description="Manage your orders" />
                  <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 ">
                  <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
      <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
  <thead className="bg-gray-50 dark:bg-neutral-700">
    <tr>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">
        #
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">
        Order no
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
        Customer Details
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">
        Order type
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">
        Total Price
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
        Payment Status
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
        Created at
      </th>
      <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">
        Action
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
    {orders.map((order, index) => (
      <tr key={order.id}>
        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
          {index + 1}
        </td>
        <td className="px-6 py-4 hidden md:table-cell">
          {order.order_number}
        </td>
        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
          {order.customer.name}
          <br />
          <span className="text-xs font-extralight">
            {order.customer.phone}
          </span>
        </td>
        <td className="px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200 hidden lg:table-cell capitalize">
          {order.order_type}
          <br />
          <span className='text-xs font-extralight '>
            {order.dining_table_id !== null ? `${order.dining_table.name} | ` : ''} <span className={`${order.status == 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span>
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">
          <div className="flex flex-row justify-start align-items gap-1">
         <IndianRupee className='w-3 h-full' height={40} /> {order.total}
         </div>
        </td>
        <td className="px-6 py-4 text-sm font-medium capitalize">
          <span className={`px-3 py-1 text-xs font-medium ${order.payment_status == 'paid' ? 'bg-green-100 text-green-700 rounded-full dark:bg-green-900 dark:text-green-300' : 'px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900 dark:text-yellow-300'} `}>
          {order.payment_status}
                        </span>
          
        </td>
        <td className="px-6 py-4 text-sm font-medium">
          {dayjs(order.created_at).format('DD MMM YYYY, hh:mm A')}
        </td>
        <td className="px-6 py-4 text-end text-sm font-medium">
          {/* <div className="flex gap-x-3 justify-end">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <Eye className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <Pencil className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
            >
              <Trash className="w-4 h-4" />
            </a>
          </div> */}
          <OrderActionDropdown order={{restaurant_id: order.restaurant_id, orderid: order.id}} />
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
    </div>
                            </div>
                        </div>
    </AppLayout>
  )
}

export default OrderMain
