// components/orders/AddItemsModal.jsx
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Minus, X, Search } from 'lucide-react'
import { router } from '@inertiajs/react'

const AddItemsModal = ({ open, onOpenChange, order }) => {
  const [menuItems, setMenuItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  // Load existing order items when modal opens
  useEffect(() => {
    if (open && order) {
      const existingItems = order.items?.map(item => ({
        id: item.menu_item_id,
        name: item.menu_item.name,
        price: item.price,
        quantity: item.quantity,
        total_price: item.total_price,
        existing: true // Mark as existing item
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
      setMenuItems(data)
    } catch (error) {
      console.error('Failed to fetch menu items:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.is_available
  )

  const addItem = (menuItem) => {
    const existingItem = selectedItems.find(item => item.id === menuItem.id)
    
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.id === menuItem.id
          ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setSelectedItems([...selectedItems, {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        total_price: menuItem.price,
        existing: false // New item
      }])
    }
  }

  const removeItem = (itemId) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    
    setSelectedItems(selectedItems.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity, total_price: newQuantity * item.price }
        : item
    ))
  }

  const handleSave = () => {
    const updatedItems = selectedItems.map(item => ({
      menu_item_id: item.id,
      quantity: item.quantity,
      price: item.price,
      total_price: item.total_price
    }))

    router.put(`/orders/${order.id}/update-items`, {
      items: updatedItems
    }, {
      onSuccess: () => {
        onOpenChange(false)
        // Refresh the orders page
        router.reload({ only: ['orders'] })
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add/Edit Items - Order #{order?.order_number}</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 h-[70vh]">
          {/* Menu Items List */}
          <div className="flex-1 border-r pr-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="overflow-y-auto h-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {loading ? (
                  <div className="col-span-2 text-center py-8">Loading menu items...</div>
                ) : (
                  filteredMenuItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => addItem(item)}
                      className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 cursor-pointer"
                    >
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">₹{item.price}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Selected Items */}
          <div className="w-1/2">
            <h3 className="font-semibold mb-4">Selected Items ({selectedItems.length})</h3>
            
            <div className="overflow-y-auto h-full space-y-3">
              {selectedItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium flex items-center">
                      {item.name}
                      {item.existing && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
                          Existing
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ₹{item.price} × {item.quantity} = ₹{item.total_price}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {selectedItems.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No items selected
                </div>
              )}
            </div>
            
            {selectedItems.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total: ₹{selectedItems.reduce((sum, item) => sum + item.total_price, 0)}</span>
                  <Button onClick={handleSave}>
                    Update Order
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemsModal
