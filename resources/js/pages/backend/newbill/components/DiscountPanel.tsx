import React from 'react'

export default function DiscountPanel({
  applyDiscount,
  discountType,
  discountValue,
  setApplyDiscount,
  setDiscountType,
  setDiscountValue,
  handleDiscountChange,
  discountAmount,
}) {
  return (
    <>
      <li className="flex flex-wrap gap-2 pt-2 items-center justify-end">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={applyDiscount}
            onChange={(e) => {
              const isChecked = e.target.checked
              setApplyDiscount(isChecked)
              if (!isChecked) {
                setDiscountValue('')
                setDiscountType('percent')
              }
              handleDiscountChange(isChecked, 'percent', '')
            }}
            className="w-5 h-5 text-green-600 accent-green-600 dark:accent-green-400"
          />
          <span
            className={`${applyDiscount ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'} font-medium`}
          >
            Discount
          </span>
        </label>
      </li>

      {applyDiscount && (
        <li className="flex gap-2 items-center pt-2">
          <select
            value={discountType}
            onChange={(e) => {
              const newType = e.target.value
              setDiscountType(newType)
              handleDiscountChange(applyDiscount, newType, discountValue)
            }}
            className="px-2 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="percent">%</option>
            <option value="fixed">₹</option>
          </select>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => {
              const val = e.target.value
              setDiscountValue(val)
              handleDiscountChange(applyDiscount, discountType, val)
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={discountType === 'percent' ? 'Enter %' : 'Enter ₹ amount'}
          />
        </li>
      )}

      {applyDiscount && (
        <li className="flex justify-between gap-4 items-center">
          <div className="flex">
            <span className="text-xs text-gray-600 dark:text-gray-300">Discount</span>
            <span className="text-xs ml-2 text-gray-600 dark:text-gray-300">
              ({discountType === 'percent' ? `${discountValue}%` : `₹${discountValue}`})
            </span>
          </div>
          <span className="text-xs font-semibold text-red-600 dark:text-red-400">
            - ₹{discountAmount.toFixed(2)}
          </span>
        </li>
      )}
    </>
  )
}
