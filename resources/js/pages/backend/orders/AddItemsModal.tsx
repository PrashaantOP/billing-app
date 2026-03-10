import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Minus, X, Search, ShoppingCart, IndianRupee } from 'lucide-react'
import { router } from '@inertiajs/react'

const TAX_RATE = 12 // Set your percentage here or receive from backend, though backend recalculates.

const AddItemsModal = ({ open, onOpenChange, order }) => {
  const [menuItems, setMenuItems] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (open && order) {
      const existingItems = order.items?.map(item => ({
        id: item.menu_item_id,
        name: item.menu_item.name,
        price: Number(item.price),
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
    } catch (e) { 
      console.error(e) 
    } finally { 
      setLoading(false) 
    }
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
        { id: item.id, name: item.name, price: Number(item.price), image: item.image, category_id: item.category_id, quantity: 1 }
      ])
    }
  }

  const decrementItem = (item, e) => {
    e.stopPropagation()
    const exists = selectedItems.find(i => i.id === item.id)
    if (exists && exists.quantity > 1) {
      setSelectedItems(selectedItems.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
      ))
    } else if (exists && exists.quantity === 1) {
       removeItem(item.id, e)
    }
  }

  const removeItem = (itemId, e) => {
    if (e) e.stopPropagation()
    setSelectedItems(selectedItems.filter(i => i.id !== itemId))
  }

  const getQuantity = (itemId) => selectedItems.find(i => i.id === itemId)?.quantity || 0

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
  const totalItems = selectedItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
  const tax = ((subtotal * TAX_RATE) / 100)
  const totalWithTax = subtotal + tax

  // Save
  const handleSave = () => {
    setIsSaving(true)
    const items = selectedItems.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.quantity * item.price,
    }))
    
    router.put(`/orders/${order.id}/update-items`, { items }, {
      onSuccess: () => {
        setIsSaving(false)
        onOpenChange(false)
        // router.reload({ only: ['orders'] }) is not strictly necessary if Inertia updates properties automatically, but good to keep state fresh.
      },
      onError: () => {
        setIsSaving(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full md:max-w-4xl lg:max-w-5xl h-[90vh] md:h-[85vh] p-0 flex flex-col overflow-hidden bg-gray-50/50 dark:bg-neutral-900 glass-panel border border-white/20 shadow-2xl rounded-2xl">
        <DialogHeader className="p-5 border-b bg-white dark:bg-neutral-900 z-10">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-100 p-2 rounded-xl dark:bg-red-900/30">
                <ShoppingCart className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-xl font-bold">Update Order #{order?.order_number}</span>
                  <DialogDescription className="text-xs">Add or modify items in this order.</DialogDescription>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 rounded-full h-10 focus-visible:ring-offset-0 focus-visible:ring-red-500 transition-all"
              />
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Categories Tab */}
        <div className="flex flex-wrap items-center gap-2 py-3 px-5 border-b bg-white dark:bg-neutral-900/90 sticky top-0 z-10">
          <ScrollArea className="w-full whitespace-nowrap" orientation="horizontal">
            <div className="flex w-max space-x-2 p-1">
                <Button
                    variant={selectedCategory === 'all' ? "default" : "outline"}
                    className={`rounded-full shadow-none ${selectedCategory === 'all' ? 'bg-red-600 hover:bg-red-700' : 'text-gray-600 dark:text-gray-300'}`}
                    onClick={() => setSelectedCategory('all')}
                    size="sm"
                >
                    All Items
                </Button>
                {categories.map(c => (
                <Button
                    key={c.id}
                    variant={selectedCategory === String(c.id) ? "default" : "outline"}
                    className={`rounded-full shadow-none ${selectedCategory === String(c.id) ? 'bg-red-600 hover:bg-red-700' : 'text-gray-600 dark:text-gray-300'}`}
                    onClick={() => setSelectedCategory(String(c.id))}
                    size="sm"
                >
                    {c.name}
                </Button>
                ))}
            </div>
          </ScrollArea>
        </div>

        {/* Content Area */}
        <ScrollArea className="flex-1 bg-gray-50 dark:bg-neutral-900/50 p-4 md:p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-20">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium animate-pulse">Loading menu items...</p>
            </div>
          ) : (
            <>
              {filteredMenuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-gray-200/50 dark:bg-neutral-800/50 p-4 rounded-full mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No items found</h3>
                    <p className="text-gray-500 max-w-sm mt-1">We couldn't find anything matching your search. Try adjusting the category or search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                  {filteredMenuItems.map(item => {
                    const qty = getQuantity(item.id)
                    const isSelected = qty > 0

                    return (
                      <Card 
                        key={item.id} 
                        onClick={() => addItem(item)}
                        className={`overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                            ${isSelected 
                                ? 'ring-2 ring-red-500 border-red-200 shadow-md shadow-red-100 dark:shadow-red-900/20 dark:border-red-800' 
                                : 'border-gray-200 dark:border-neutral-800 hover:border-red-300 dark:hover:border-neutral-600 shadow-sm'
                            }
                        `}
                      >
                        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-800">
                          {isSelected && (
                              <div className="absolute inset-0 bg-red-600/10 z-10 transition-opacity"></div>
                          )}
                          <img
                            src={item.image ? `/assets/images/menuitems/${item.image}` : '/assets/images/menuitems/food-default.png'}
                            alt={item.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
                            onError={e => { e.target.src = '/assets/images/menuitems/food-default.png' }}
                          />
                          
                          {/* Quantity Controls Overlay when Selected */}
                          {isSelected ? (
                             <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-red-900/80 via-transparent to-transparent z-20 flex flex-col justify-end p-2 pb-3">
                                <div className="flex items-center justify-between bg-white dark:bg-neutral-800 rounded-full shadow-lg p-1 border border-red-100 dark:border-neutral-700 animate-in fade-in slide-in-from-bottom-2">
                                    <button 
                                        onClick={(e) => decrementItem(item, e)}
                                        className="w-8 h-8 rounded-full bg-red-50 dark:bg-neutral-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-neutral-600 flex items-center justify-center transition-colors"
                                    >
                                        {qty === 1 ? <X className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                    </button>
                                    <span className="font-bold text-gray-900 dark:text-white px-2">{qty}</span>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); addItem(item); }}
                                        className="w-8 h-8 rounded-full bg-red-600 text-white hover:bg-red-700 flex items-center justify-center shadow-sm transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                             </div>
                          ) : (
                             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-y-2 group-hover:translate-y-0 duration-300">
                                 <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-800 shadow-md flex items-center justify-center">
                                     <Plus className="w-5 h-5 text-red-600" />
                                 </div>
                             </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <div className="flex flex-col justify-between h-full space-y-1">
                            <h4 className="font-semibold text-sm line-clamp-2 leading-tight text-gray-800 dark:text-gray-200" title={item.name}>
                                {item.name}
                            </h4>
                            <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-sm tracking-tight mt-auto">
                                <IndianRupee className="w-3.5 h-3.5 mr-[1px]" />
                                {Number(item.price).toFixed(2)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </ScrollArea>

        {/* Bottom Cart Summary */}
        <div className="border-t bg-white dark:bg-neutral-900 p-4 md:px-6 z-20 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 flex-1">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {totalItems}
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cart</span>
                    <span className="text-sm font-semibold">{totalItems === 1 ? 'Item' : 'Items'}</span>
                </div>
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-neutral-800"></div>

              <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Subtotal</span>
                    <span className="text-sm font-semibold flex items-center text-gray-700 dark:text-gray-300">
                        ₹{subtotal.toFixed(2)}
                    </span>
              </div>

              <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">+ Tax (~{TAX_RATE}%)</span>
                    <span className="text-sm font-semibold flex items-center text-green-600 dark:text-green-500">
                        ₹{tax.toFixed(2)}
                    </span>
              </div>

              <div className="flex flex-col ml-auto sm:ml-0 md:ml-auto">
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total</span>
                    <span className="text-xl font-black text-red-600 dark:text-red-400 tracking-tight">
                        ₹{totalWithTax.toFixed(2)}
                    </span>
              </div>
            </div>

            <div className="flex flex-row items-center justify-end gap-3 sm:w-auto w-full">
              <Button 
                variant="outline" 
                onClick={() => setSelectedItems([])}
                disabled={selectedItems.length === 0 || isSaving}
                className="rounded-full flex-1 sm:flex-none"
              >
                Clear
              </Button>
              <Button 
                onClick={handleSave} 
                className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 flex-1 sm:flex-none shadow-md shadow-red-200 dark:shadow-none"
                disabled={selectedItems.length === 0 || isSaving}
              >
                {isSaving ? "Updating..." : "Update Order"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddItemsModal
