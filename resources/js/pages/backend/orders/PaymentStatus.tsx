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
import { router } from "@inertiajs/react";

type Props = {
  orderId: number;
  paymentStatus: 'pending' | 'paid' | 'partial';
};

const PAYMENT_STATUSES = ['pending', 'paid', 'partial'];
const statusStyleMap: Record<string, string> = {
  pending:
    'bg-yellow-100 text-yellow-700 rounded-full dark:bg-yellow-900 dark:text-yellow-300',
  paid:
    'bg-green-100 text-green-700 rounded-full dark:bg-green-900 dark:text-green-300',
  partial:
    'bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900 dark:text-blue-300',
};

export default function PaymentStatus({ orderId, paymentStatus }: Props) {
  const [status, setStatus] = useState(paymentStatus);

  const handleSave = () => {
    router.put(`/orders/${orderId}/update-payment-status`, { payment_status: status }, {
      onSuccess: () => {
        // Optionally close dialog or show toast
        document.getElementById(`close-payment-dialog-${orderId}`)?.click();
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to update payment status.');
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`px-3 py-1 text-xs font-medium capitalize ${statusStyleMap[paymentStatus]}`}
        >
          {paymentStatus}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Status</DialogTitle>
          <DialogDescription>Select the updated payment status for this order.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div>
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'paid' | 'partial')}
              className="w-full px-3 py-2 border rounded dark:bg-neutral-800 dark:text-white dark:border-neutral-600"
            >
              {PAYMENT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="sm:justify-start mt-4">
          <Button onClick={handleSave}>Save</Button>
          <DialogClose asChild>
            <Button
              id={`close-payment-dialog-${orderId}`}
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
