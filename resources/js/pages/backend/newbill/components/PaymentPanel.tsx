import React from 'react'
import { HandCoins, Landmark, WalletCards } from 'lucide-react'

interface PaymentPanelProps {
  isPaid: boolean;
  paymentMethod: string;
  transactionId: string;
  handleIsPaidChange: (isPaid: boolean) => void;
  handlePaymentMethodChange: (method: string) => void;
  handleTransactionIdChange: (id: string) => void;
}

export default function PaymentPanel({
  isPaid,
  paymentMethod,
  transactionId,
  handleIsPaidChange,
  handlePaymentMethodChange,
  handleTransactionIdChange,
}: PaymentPanelProps) {
  return (
    <>
      <li className="flex flex-wrap gap-2 pt-2 items-center justify-end">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isPaid}
            onChange={(e) => handleIsPaidChange(e.target.checked)}
            className="w-5 h-5 text-green-600 accent-green-600"
          />
          <span
            className={`${isPaid ? 'text-green-600' : 'text-red-500'} font-medium`}
          >
            Received
          </span>
        </label>
      </li>

      {isPaid && (
        <>
          <li className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => handlePaymentMethodChange('cash')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
                paymentMethod === 'cash' ? 'bg-green-200 text-green-600' : 'bg-gray-200'
              }`}
            >
              <HandCoins className="w-4 h-4" /> Cash
            </button>
            <button
              onClick={() => handlePaymentMethodChange('bank')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
                paymentMethod === 'bank' ? 'bg-blue-200 text-blue-600' : 'bg-gray-200'
              }`}
            >
              <Landmark className="w-4 h-4" /> Bank/UPI
            </button>
            <button
              onClick={() => handlePaymentMethodChange('cheque')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
                paymentMethod === 'cheque' ? 'bg-purple-200 text-purple-600' : 'bg-gray-200'
              }`}
            >
              <WalletCards className="w-4 h-4" /> Cheque
            </button>
          </li>

          {(paymentMethod === 'bank' || paymentMethod === 'cheque') && (
            <li className="pt-2 w-full">
              <label className="text-xs">
                {paymentMethod === 'bank' ? 'Transaction ID' : 'Cheque Number'}
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => handleTransactionIdChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder={paymentMethod === 'bank' ? 'Enter Transaction ID' : 'Enter Cheque Number'}
              />
            </li>
          )}
        </>
      )}
    </>
  )
}