import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import OrderTypeSelector from "./components/OrderTypeSelecter";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

type Props = {
    orderId: number;
  ordertype: string;
  dining_table_name?: string;
  order_status: string;
};

const statusColorMap: Record<string, string> = {
  pending: 'text-yellow-500',
  preparing: 'text-blue-500',
  served: 'text-purple-500',
  completed: 'text-green-600',
  cancelled: 'text-red-500',
};

const ORDER_STATUSES = ['pending', 'preparing', 'served', 'completed', 'cancelled'];

export function OrderStatus({ orderId, ordertype, dining_table_name, order_status }: Props) {
    const [open, setOpen] = useState(false);
  const [type, setType] = useState(ordertype);
  const [status, setStatus] = useState(order_status);

  const handleSave = () => {
    router.patch(`/orders-type/${orderId}`, {
      order_type: type,
      status: status,
    }, {
      onSuccess: () => {
        setOpen(false);
        toast.success("Order updated successfully!");
      },
      onError: (errors) => {
        toast.error("Failed to update order.");
        console.error(errors);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-left capitalize">
        {ordertype}
        <br />
        <span className="text-xs font-extralight">
            {dining_table_name ? `${dining_table_name} | ` : ""}
            <span className={statusColorMap[order_status] || 'text-gray-500'}>
            {order_status}
            </span>
        </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Order</DialogTitle>
          <DialogDescription>You can change order type and status.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            {/* <Label>Order Type</Label> */}
            <OrderTypeSelector value={type} onChange={setType} />
          </div>

          {dining_table_name && (
            <div>
              <Label>Dining Table</Label>
              <input
                className="w-full border border-gray-300 rounded px-2 py-2 dark:bg-neutral-800 dark:text-white"
                value={dining_table_name}
                readOnly
              />
            </div>
          )}

          <div>
            <Label>Status</Label>
            <select
              className="w-full border border-gray-300 rounded px-2 py-2 dark:bg-neutral-800 dark:text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
