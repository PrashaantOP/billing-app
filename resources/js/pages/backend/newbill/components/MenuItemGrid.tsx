import React from 'react'
import { MenuItemType } from '@/types'
import { X } from 'lucide-react'

type Props = {
  items: MenuItemType[]
  selectedItems: MenuItemType[]
  activeBillItems: MenuItemType[]
  handleSelect: (item: MenuItemType) => void
  removeItem: (id: number) => void
}

export default function MenuItemGrid({
    items,
    selectedItems,
    activeBillItems,
    handleSelect,
    removeItem,
  }: Props) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.length ? (
          items.map((item) => {
            const isSelected = selectedItems.some(i => i.id === item.id);
            const quantity = activeBillItems.find(i => i.id === item.id)?.quantity ?? 1;

            return (
              <div
                key={item.id}
                onClick={() => item.is_available && handleSelect(item)}
                className={`relative p-4 border rounded-md shadow-sm bg-white dark:bg-neutral-900 dark:border-neutral-700 cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                  isSelected ? 'ring-2 ring-green-500 dark:ring-green-400' : ''
                }`}
              >
                <img
                  src={`/assets/images/menuitems/${item.image ?? 'food-default.png'}`}
                  alt={item.name}
                  className="w-full h-32 object-cover mb-2 aspect-square rounded-md select-none pointer-events-none"
                />

                {isSelected && item.is_available && (
                  <div className="absolute top-0 left-0 w-full h-full bg-green-600/30 dark:bg-green-800/40 flex flex-col items-start justify-start text-white text-sm font-medium rounded-md">
                    <div className="flex justify-between w-full mt-1 px-1">
                      <div className="w-5 h-5 flex justify-center items-center text-sm font-semibold bg-green-600 dark:bg-green-700 rounded-full select-none">
                        {quantity}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.id);
                        }}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {!item.is_available && (
                  <div className="absolute top-0 left-0 w-full h-full bg-black/60 dark:bg-neutral-800/80 flex items-center justify-center text-white text-sm font-medium rounded-md">
                    Not Available
                  </div>
                )}

                <div className="mt-2">
                  <h3 className="text-lg font-semibold select-none dark:text-white">
                    {item.name.length > 12 ? `${item.name.slice(0, 10)}..` : item.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 select-none">Price: ₹{item.price}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 p-6 whitespace-nowrap">
            No items available.
          </div>
        )}
      </div>
    );
  }
