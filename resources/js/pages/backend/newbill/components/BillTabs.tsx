// components/Billing/BillTabs.tsx
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Bill } from '@/types' // adjust path if needed

type Props = {
  bills: Bill[]
  activeBillId: number | null
  switchBill: (id: number) => void
  removeBill: (id: number) => void
  addNewBill: () => void
}

export default function BillTabs({ bills, activeBillId, switchBill, removeBill, addNewBill }: Props) {
  return (
    <div className="flex gap-2 mb-4 flex-wrap bg-gray-100 p-1 rounded-md w-fit">
      <AnimatePresence initial={false}>
        {bills.map((bill) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => switchBill(bill.id)}
            className={`flex items-center rounded-md px-3 py-1 cursor-default ${
              bill.id === activeBillId ? 'bg-white text-black shadow' : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            <span className="text-red font-bold mr-2">{bill.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeBill(bill.id)
              }}
              className="ml-1 text-sm hover:text-red-600 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={addNewBill}
        className="px-3 py-1 rounded text-black hover:bg-gray-200 font-bold"
      >
        +
      </motion.button>
    </div>
  )
}
