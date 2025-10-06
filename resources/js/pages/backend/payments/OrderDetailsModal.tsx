import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function OrderDetailsDialog({ open, onOpenChange, order }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl w-full p-0">
        <div className="flex items-center justify-between px-6 pt-5">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {/* Close button */}
         
        </div>
        <div className="px-6 pb-5 pt-2">
          {order ? (
            <>
              {/* Order Meta */}
              <div className="space-y-4">
  {/* Header Section */}
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-neutral-800 dark:to-neutral-700 rounded-lg p-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Order No.</span>
        <span className="font-bold text-blue-700 dark:text-blue-400 text-lg">
          #{order.order_number}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
          {order.created_at
            ? new Date(order.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            : "-"}
        </span>
      </div>
    </div>
  </div>

  {/* Order Details Grid */}
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        Order Type
      </div>
      <div className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
        {order.order_type}
      </div>
    </div>

    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        Status
      </div>
      <div className={`font-semibold capitalize inline-flex items-center px-2 py-1 rounded-full text-xs
        ${order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
        ${order.status === 'preparing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
      `}>
        {order.status}
      </div>
    </div>

    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        Payment
      </div>
      <div className={`font-semibold capitalize inline-flex items-center px-2 py-1 rounded-full text-xs
        ${order.payment_status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
        ${order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
        ${order.payment_status === 'unpaid' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
      `}>
        {order.payment_status}
      </div>
    </div>

    <div className="bg-white dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        Table
      </div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {order.dining_table_id ? `Table ${order.dining_table_id}` : "Takeaway"}
      </div>
    </div>
  </div>
</div>


              {/* Note display */}
              {order.items && order.items.length > 0 && order.items.some(i => i.note) && (
                <div className="my-3 p-3 rounded bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-100 dark:border-yellow-900 text-sm text-yellow-800 dark:text-yellow-200">
                  {order.items
                    .map(i => i.note)
                    .filter(Boolean)
                    .join(", ")}
                </div>
              )}

              {/* Order Items */}
              <div className="my-4">
                <h3 className="font-semibold text-base mb-2">Order Items</h3>
                {order.items && order.items.length > 0 ? (
                  <div className="overflow-x-auto rounded">
                    <table className="min-w-full border text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-800 text-gray-500">
                          <th className="px-2 py-1 text-left font-medium">
                            Item
                          </th>
                          
                          <th className="px-2 py-1 text-center font-medium">
                            Qty
                          </th>
                          <th className="px-2 py-1 text-center font-medium">
                            Price
                          </th>
                          <th className="px-2 py-1 text-center font-medium">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-2 py-1">
                              {item.menu_item?.name || "-"}
                            </td>
                            
                            <td className="px-2 py-1 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-2 py-1 text-center">
                              ₹{Number(item.price).toLocaleString()}
                            </td>
                            <td className="px-2 py-1 text-center">
                              ₹{Number(item.total_price).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400 italic mb-2">No items found</div>
                )}
              </div>

              {/* Amounts & Taxes */}
              <div className="border-t pt-6 mt-6">
  <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-gray-100">
    Order Summary
  </h3>
  
  <div className="space-y-3">
    {/* Subtotal & Tax Row */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Subtotal
        </div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">
          ₹{order.subtotal ? Number(order.subtotal).toLocaleString() : "0"}
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3 border border-gray-200 dark:border-neutral-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          Tax
        </div>
        <div className="font-semibold text-gray-900 dark:text-gray-100 text-base">
          {order.tax ? `₹${Number(order.tax).toLocaleString()}` : "₹0"}
        </div>
      </div>
    </div>

    {/* Total Amount - Featured */}
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-green-800 dark:text-green-300 uppercase tracking-wide">
            Total Amount
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-400 mt-1">
            ₹{order.total ? Number(order.total).toLocaleString() : "0"}
          </div>
        </div>
        <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
      </div>
    </div>

    {/* Payment Info (if needed later) */}
    {/* 
    <div className="grid grid-cols-2 gap-3 pt-2">
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <div className="text-xs text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
          Amount Paid
        </div>
        <div className="font-semibold text-blue-700 dark:text-blue-300">
          {order.payment_status === 'paid' ? `₹${Number(order.amount_paid || order.total).toLocaleString()}` : 'Not paid'}
        </div>
      </div>
      
      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
        <div className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">
          Due Amount
        </div>
        <div className="font-semibold text-orange-700 dark:text-orange-300">
          {order.due_amount ? `₹${Number(order.due_amount).toLocaleString()}` : (order.payment_status === 'paid' ? "₹0" : "-")}
        </div>
      </div>
    </div>
    */}
  </div>
</div>

            </>
          ) : (
            <div className="text-gray-500 italic py-8 text-center">
              No order details available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
