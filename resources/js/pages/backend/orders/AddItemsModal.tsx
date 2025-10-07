import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Search, ShoppingCart } from 'lucide-react'
import { router } from '@inertiajs/react'

const TAX_RATE = 12 // Set your percentage here or receive from backend

const AddItemsModal = ({ open, onOpenChange, order }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && order) {
      const existingItems = order.items?.map(item => ({
        id: item.menu_item_id,
        name: item.menu_item.name,
        price: item.price,
        image: item.menu_item.image,
        quantity: item.quantity,
        category_id: item.menu_item.category_id,
      })) || []
      setSelectedItems(existingItems)
      fetchMenuItems()
    }
  }, [open, order])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/menu-items/${order.restaurant_id}`)
      const data = await response.json()
      setMenuItems(data.menuItems || data)
      setCategories(data.categories || [])
    } catch (e) { } finally { setLoading(false) }
  }

  // Filter
  const filteredMenuItems = menuItems.filter(item => {
    const search = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const cat = selectedCategory === 'all' || `${item.category_id}` === `${selectedCategory}`
    return search && cat && item.is_available
  })

  // Item actions
  const addItem = (item) => {
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists) {
      setSelectedItems(selectedItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([
        ...selectedItems,
        { id: item.id, name: item.name, price: item.price, image: item.image, category_id: item.category_id, quantity: 1 }
      ])
    }
  }
  const removeItem = (itemId) => setSelectedItems(selectedItems.filter(i => i.id !== itemId))
  const getQuantity = (itemId) => selectedItems.find(i => i.id === itemId)?.quantity || 0

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const totalItems = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const tax = ((subtotal * TAX_RATE) / 100)
  const totalWithTax = subtotal + tax

  // Save
  const handleSave = () => {
    const items = selectedItems.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.quantity * item.price,
    }))
    router.put(`/orders/${order.id}/update-items`, { items }, {
      onSuccess: () => {
        onOpenChange(false)
        router.reload({ only: ['orders'] })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl sm:max-w-4xl md:max-w-5xl max-h-[96vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            Add/Edit Items - Order #{order?.order_number}
          </DialogTitle>
        </DialogHeader>

        {/* CATEGORY TABS & SEARCH */}
        <div className="flex flex-wrap items-center gap-2 py-3 px-5 border-b bg-gray-50 dark:bg-neutral-900">
          <div className="flex gap-1 flex-wrap overflow-x-auto scrollbar-hide">
            <button
              className={`px-3 py-1 rounded-full font-medium text-sm border transition
                ${selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'}
              `}
              onClick={() => setSelectedCategory('all')}
            >All</button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`px-3 py-1 rounded-full font-medium text-sm border transition
                  ${selectedCategory === String(c.id) ? 'bg-red-600 text-white' : 'bg-white dark:bg-neutral-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-neutral-700'}
                `}
                onClick={() => setSelectedCategory(String(c.id))}
              >{c.name}</button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative w-40 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* RESPONSIVE HORIZONTAL SCROLL GRID */}
        <div className="flex-1 flex flex-col px-2 py-3">
          {loading ? (
            <div className="text-center mt-20 text-lg font-medium">Loading...</div>
          ) : (
            <div className="relative">
              <div className="flex w-full gap-3 overflow-x-auto scrollbar-thin py-1"
                   style={{ WebkitOverflowScrolling: 'touch', minHeight: 155, maxHeight: 215 }}>
                {filteredMenuItems.length === 0 ? (
                  <div className="text-center text-gray-400 py-12 w-full">No items found</div>
                ) : (
                  filteredMenuItems.map(item => {
                    const qty = getQuantity(item.id)
                    return (
                      <div
                        key={item.id}
                        onClick={() => addItem(item)}
                        className={`scroll-ml-4 min-w-[120px] max-w-[150px] h-[185px] sm:h-[210px] flex flex-col justify-between items-center relative p-2 border rounded-xl shadow-md cursor-pointer mx-1 my-1 group
                          ${qty > 0 ? 'ring-2 ring-red-600 bg-red-50 dark:bg-red-900/40 border-red-200 dark:border-red-700' : 'bg-white dark:bg-neutral-800 border-gray-200 dark:border-neutral-700'}
                        `}
                      >
                        {/* Remove Button */}
                        {qty > 0 && (
                          <button
                            className="absolute top-1 left-1 rounded-full bg-gray-900/80 text-white hover:bg-red-600 w-6 h-6 flex items-center justify-center z-10"
                            onClick={e => { e.stopPropagation(); removeItem(item.id); }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                        <img
                          src={item.image ? `/assets/images/menuitems/${item.image}` : '/assets/images/menuitems/food-default.png'}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md mb-1 shadow-sm bg-white"
                          onError={e => { e.target.src = '/assets/images/menuitems/food-default.png' }}
                        />
                        <div className="flex flex-col text-center flex-1 justify-center items-center">
                          <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate w-full">{item.name}</span>
                          <span className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-bold">₹{item.price}</span>
                        </div>
                        {/* Quantity badge */}
                        {qty > 0 && (
                          <span className="absolute bottom-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs shadow">{qty}</span>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CALC BAR */}
        <div className="border-t bg-white dark:bg-neutral-900 px-2 py-2 sticky bottom-0 left-0 w-full z-20">
          {selectedItems.length === 0 ? (
            <div className="flex items-center justify-center text-gray-500 pt-2">
              <ShoppingCart className="w-6 h-6 mr-2 opacity-50" />
              No items selected. Click any item to add to order!
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between px-1 gap-3">
              <div className="flex flex-wrap items-center gap-4 flex-1">
                <div className="text-gray-700 dark:text-gray-200 font-semibold text-xs sm:text-sm">
                  {totalItems} item{totalItems !== 1 ? "s" : ""} selected
                </div>
                <div className="font-bold text-base sm:text-lg text-red-700 dark:text-red-400 tracking-wide">
                  Subtotal: ₹{subtotal.toFixed(2)}
                </div>
                <div className="font-semibold text-xs sm:text-sm text-green-800 dark:text-green-400">
                  TAX ({TAX_RATE}%): +₹{tax.toFixed(2)}
                </div>
                <div className="font-bold text-base sm:text-lg text-black dark:text-white ml-1">
                  Total: ₹{totalWithTax.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                <Button variant="outline" size="sm" onClick={() => setSelectedItems([])}>Clear All</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white px-6" size="sm" onClick={handleSave}>Update Order</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddItemsModal
