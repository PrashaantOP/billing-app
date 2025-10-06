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
            className="w-5 h-5 text-green-600 accent-green-600 dark:accent-green-400"
          />
          <span
            className={`${isPaid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'} font-medium`}
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
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors ${
                paymentMethod === 'cash' 
                  ? 'bg-green-200 dark:bg-green-800/30 text-green-600 dark:text-green-400' 
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              <HandCoins className="w-4 h-4" /> Cash
            </button>
            <button
              onClick={() => handlePaymentMethodChange('bank')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors ${
                paymentMethod === 'bank' 
                  ? 'bg-blue-200 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              <Landmark className="w-4 h-4" /> Bank/UPI
            </button>
            <button
              onClick={() => handlePaymentMethodChange('cheque')}
              className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer transition-colors ${
                paymentMethod === 'cheque' 
                  ? 'bg-purple-200 dark:bg-purple-800/30 text-purple-600 dark:text-purple-400' 
                  : 'bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-600'
              }`}
            >
              <WalletCards className="w-4 h-4" /> Cheque
            </button>
          </li>

          {(paymentMethod === 'bank' || paymentMethod === 'cheque') && (
            <li className="pt-2 w-full">
              <label className="text-xs text-gray-600 dark:text-gray-300">
                {paymentMethod === 'bank' ? 'Transaction ID' : 'Cheque Number'}
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => handleTransactionIdChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder={paymentMethod === 'bank' ? 'Enter Transaction ID' : 'Enter Cheque Number'}
              />
            </li>
          )}
          <hr className="my-8 w-full border-gray-200 dark:border-neutral-700" />
        </>
      )}
    </>
  )
}
