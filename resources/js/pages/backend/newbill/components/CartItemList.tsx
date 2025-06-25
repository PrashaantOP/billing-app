import React from 'react'
import { Minus, Plus, X } from 'lucide-react'

export default function CartItemList({ items, increaseQty, decreaseQty, removeItem }) {
  return (
    <>
      {items.map(item => (
        <li
          key={item.id}
          className="flex justify-between items-center p-3 bg-green-600/10 rounded"
        >
          <div className="flex items-start gap-3">
            <img
              src={`/assets/images/menuitems/${item.image || 'food-default.png'}`}
              className="w-15 h-15 bg-white rounded object-cover"
              alt=""
            />
            <div>
              <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                {item.name}
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-3 text-white rounded-lg py-1 px-2 bg-green-600">
              <button onClick={() => decreaseQty(item.id)}><Minus className="w-4 h-4" /></button>
              <span>{item.quantity}</span>
              <button onClick={() => increaseQty(item.id)}><Plus className="w-4 h-4" /></button>
            </div>
            <p className="text-sm">₹{item.price * (item.quantity || 1)}</p>
          </div>
        </li>
      ))}
    </>
  )
}