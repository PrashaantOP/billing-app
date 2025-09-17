import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function OrderDetailsDialog({ open, onOpenChange, order }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full p-0">
        <div className="flex items-center justify-between px-6 pt-5">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {/* <Button size="icon" variant="ghost" onClick={() => onOpenChange(false)}>
            <X className="w-6 h-6" />
          </Button> */}
        </div>
        <div className="px-6 pb-5 pt-2">
          {order ? (
            <>
              <div className="grid grid-cols-2 text-sm gap-y-1">
                <div>
                  <span className="text-neutral-500 font-medium">Order No:</span>
                  <span className="ml-2 text-neutral-900 dark:text-neutral-100">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Type:</span>
                  <span className="ml-2 capitalize">{order.order_type}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Status:</span>
                  <span className="ml-2">{order.status}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Total:</span>
                  <span className="ml-2">₹{order.total}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Customer ID:</span>
                  <span className="ml-2">{order.customer_id}</span>
                </div>
                <div>
                  <span className="text-neutral-500 font-medium">Dining Table:</span>
                  <span className="ml-2">{order.dining_table_id ?? 'N/A'}</span>
                </div>
              </div>

              <div className="my-4">
                <h3 className="font-semibold text-base mb-2">Order Items</h3>
                {order.items && order.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full border text-xs">
                      <thead>
                        <tr className="bg-gray-50 dark:bg-neutral-800 text-gray-500">
                          <th className="px-2 py-1 text-left font-medium">Item</th>
                          <th className="px-2 py-1 text-center font-medium">Qty</th>
                          <th className="px-2 py-1 text-center font-medium">Price</th>
                          <th className="px-2 py-1 text-center font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-2 py-1">{item.menu_item?.name || '-'}</td>
                            <td className="px-2 py-1 text-center">{item.quantity}</td>
                            <td className="px-2 py-1 text-center">₹{Number(item.price).toLocaleString()}</td>
                            <td className="px-2 py-1 text-center">₹{Number(item.total_price).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-400 italic mb-2">No items found</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-gray-500 italic py-8 text-center">No order details available.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
