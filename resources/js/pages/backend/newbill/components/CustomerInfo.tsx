import React from 'react'
import SearchAddUpdateSelectCustomer from '../../customers/searchAddUpdateCustomer'

export default function CustomerInfo({ activeBill }) {
  return (
    <li className="pt-4 pb-1 border-t">
      <h6 className="text-dark font-bold my-3">Customer Details</h6>
      <SearchAddUpdateSelectCustomer />
      {activeBill?.customer ? (
        <div className="mb-2 p-2 bg-gray-100 rounded">
          <div className="text-sm font-semibold text-gray-700">Customer</div>
          <div className="text-sm text-gray-800">
            {activeBill.customer.name} ({activeBill.customer.phone})
          </div>
        </div>
      ) : (
        <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-500">
          No customer
        </div>
      )}
    </li>
  )
}
