// components/Billing/CartSidebar.tsx
import React from 'react'
import { X } from 'lucide-react'
import CartItemList from './CartItemList'
import DiscountPanel from './DiscountPanel'
import TaxSection from './TaxSection'
import PaymentPanel from './PaymentPanel'
import CustomerInfo from './CustomerInfo'
import AddNewTax from '@/pages/settings/taxes/addTaxes'
import OrderTypeSwitcher from './OrderTypeSwitcher'
// import AddNewTax from './AddNewTax'



type Tax = {
    id: number
    name: string
    rate: number
    rate_type: 'percent' | 'fixed'
  }

  type Bill = {
    id: number
    name: string
    items: MenuItemType[]
    customer?: {
      name: string
      phone: string
    }
    discount?: {
      apply: boolean
      type: 'percent' | 'fixed'
      value: string
    }
    payment?: {
      isPaid: boolean
      method: string
      transactionId: string
    }
  }

  type CartSidebarProps = {
    cartOpen: boolean
    setCartOpen: (open: boolean) => void
    selectedItems: MenuItemType[]
    increaseQty: (id: number) => void
    decreaseQty: (id: number) => void
    removeItem: (id: number) => void
    applyDiscount: boolean
    discountType: 'percent' | 'fixed'
    discountValue: string
    setApplyDiscount: (apply: boolean) => void
    setDiscountType: (type: 'percent' | 'fixed') => void
    setDiscountValue: (value: string) => void
    handleDiscountChange: (apply: boolean, type: 'percent' | 'fixed', value: string) => void
    discountAmount: number
    taxes: Tax[]
    discountedTotal: number
    totalWithTax: number
    isPaid: boolean
    paymentMethod: string
    transactionId: string
    handleIsPaidChange: (paid: boolean) => void
    handlePaymentMethodChange: (method: string) => void
    handleTransactionIdChange: (id: string) => void
    activeBill: Bill | undefined
    orderType: 'dinein' | 'takeaway' | 'delivery';
    setOrderType: (type: 'dinein' | 'takeaway' | 'delivery') => void;
    selectedTable: string;
    setSelectedTable: (id: string) => void;
  }

  export default function CartSidebar({
    cartOpen,
    setCartOpen,
    selectedItems,
    increaseQty,
    decreaseQty,
    removeItem,
    applyDiscount,
    discountType,
    discountValue,
    setApplyDiscount,
    setDiscountType,
    setDiscountValue,
    handleDiscountChange,
    discountAmount,
    taxes,
    discountedTotal,
    totalWithTax,
    isPaid,
    paymentMethod,
    transactionId,
    handleIsPaidChange,
    handlePaymentMethodChange,
    handleTransactionIdChange,
    activeBill,
    orderType,
    setOrderType,
    selectedTable,
    setSelectedTable
  }: CartSidebarProps) {
    return (
    <div
      className={`select-none fixed w-full top-2 bottom-2 right-0 lg:right-3 sm:w-96 lg:max-w-xl lg:w-100 lg:rounded-md bg-white shadow-lg z-4 transform transition-transform duration-300 h-full  ${
        cartOpen ? 'translate-x-0 block' : 'translate-x-full hidden'
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-bold">Cart</h2>
        <button onClick={() => setCartOpen(false)}>
          <X className="w-5 h-5 cursor-pointer" />
        </button>
      </div>
      <div className='p-4 overflow-y-auto'>
        <OrderTypeSwitcher
          orderType={orderType}
          setOrderType={setOrderType}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
        />
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">
        {selectedItems.length > 0 ? (
          <ul className="space-y-3">
            <CartItemList
              items={selectedItems}
              increaseQty={increaseQty}
              decreaseQty={decreaseQty}
              removeItem={removeItem}
            />

            <DiscountPanel
              applyDiscount={applyDiscount}
              discountType={discountType}
              discountValue={discountValue}
              setApplyDiscount={setApplyDiscount}
              setDiscountType={setDiscountType}
              setDiscountValue={setDiscountValue}
              handleDiscountChange={handleDiscountChange}
              discountAmount={discountAmount}
            />

            <TaxSection taxes={taxes} discountedTotal={discountedTotal} />

            {/* <AddNewTax varient="link" size="nopd" /> */}

            <li className="pt-4 border-t font-bold flex justify-between gap-4">
              <span>Total:</span>
              <span>₹{totalWithTax.toFixed(2)}</span>
            </li>

            <PaymentPanel
              isPaid={isPaid}
              paymentMethod={paymentMethod}
              transactionId={transactionId}
              handleIsPaidChange={handleIsPaidChange}
              handlePaymentMethodChange={handlePaymentMethodChange}
              handleTransactionIdChange={handleTransactionIdChange}
            />

            <CustomerInfo activeBill={activeBill} />
          </ul>
        ) : (
          <p className="text-gray-400 mt-10 text-center">No items selected.</p>
        )}
      </div>
    </div>
  )
}
