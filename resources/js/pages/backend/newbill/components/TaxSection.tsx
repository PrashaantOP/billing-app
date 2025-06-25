import EditTaxes from '@/pages/settings/taxes/editTaxes'
import React from 'react'

export default function TaxSection({ taxes, discountedTotal }) {
  return (
    <>
      {taxes.map((item) => {
        const rate = parseFloat(item.rate)
        const taxAmount =
          item.rate_type === 'percent'
            ? (discountedTotal * rate) / 100
            : rate

        return (
          <li key={item.id} className="flex justify-between gap-4 items-center">
            <div className="flex flex-row items-center justify-center">
              <span className="text-xs">{item.name}</span>
              <span className="text-xs ml-2 flex flex-row items-center justify-center gap-2">
                ({item.rate_type === 'percent' ? `${rate}%` : `₹${rate}`})
                {/* <EditTaxes taxes={item} /> */}
              </span>
            </div>
            <span className="text-xs font-semibold text-green-600">
              + ₹{taxAmount.toFixed(2)}
            </span>
          </li>
        )
      })}
    </>
  )
}