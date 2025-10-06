import React from 'react'
import SearchAddUpdateSelectCustomer from '../../customers/searchAddUpdateCustomer'

export default function CustomerInfo({ activeBill }) {
  return (
    <li className="pt-4 pb-1 border-t border-gray-200 dark:border-neutral-700">
      <h6 className="text-dark dark:text-white font-bold my-3">Customer Details</h6>
      <SearchAddUpdateSelectCustomer />
      {activeBill?.customer ? (
        <div className="mb-2 p-2 bg-gray-100 dark:bg-neutral-800 rounded">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">Customer</div>
          <div className="text-sm text-gray-800 dark:text-gray-100">
            {activeBill.customer.name} ({activeBill.customer.phone})
          </div>
        </div>
      ) : (
        <div className="mb-2 p-2 bg-gray-50 dark:bg-neutral-800 rounded text-sm text-gray-500 dark:text-gray-400">
          No customer
        </div>
      )}
    </li>
  )
}
