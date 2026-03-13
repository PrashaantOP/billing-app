import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Minus, Plus, Search, ShoppingCart, X } from 'lucide-react'
import { router } from '@inertiajs/react'

const TAX_RATE = 12

const AddItemsModal = ({ open, onOpenChange, order }: any) => {
  const [menuItems, setMenuItems]               = useState<any[]>([])
  const [categories, setCategories]             = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedItems, setSelectedItems]       = useState<any[]>([])
  const [searchTerm, setSearchTerm]             = useState('')
  const [loading, setLoading]                   = useState(false)
  const [isSaving, setIsSaving]                 = useState(false)

  useEffect(() => {
    if (open && order) {
      const existingItems = (order.items || []).map((item: any) => ({
        id:          item.menu_item_id,
        name:        item.menu_item.name,
        price:       Number(item.price),
        image:       item.menu_item.image,
        quantity:    item.quantity,
        category_id: item.menu_item.category_id,
      }))
      setSelectedItems(existingItems)
      setSearchTerm('')
      setSelectedCategory('all')
      fetchMenuItems()
    }
  }, [open, order])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const res  = await fetch(`/api/menu-items/${order.restaurant_id}`)
      const data = await res.json()
      setMenuItems(data.menuItems || data)
      setCategories(data.categories || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat    = selectedCategory === 'all' || `${item.category_id}` === `${selectedCategory}`
    return matchSearch && matchCat && item.is_available
  })

  const getQty = (id: number) => selectedItems.find(i => i.id === id)?.quantity || 0

  const addItem = (item: any) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { id: item.id, name: item.name, price: Number(item.price), image: item.image, category_id: item.category_id, quantity: 1 }]
    })
  }

  const decrement = (item: any) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (!exists) return prev
      if (exists.quantity <= 1) return prev.filter(i => i.id !== item.id)
      return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
    })
  }

  const subtotal   = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalItems = selectedItems.reduce((s, i) => s + i.quantity, 0)
  const tax        = (subtotal * TAX_RATE) / 100
  const grandTotal = subtotal + tax

  const handleSave = () => {
    setIsSaving(true)
    router.put(
      `/orders/${order.id}/update-items`,
      {
        items: selectedItems.map(i => ({
          menu_item_id: i.id,
          quantity:     i.quantity,
          price:        i.price,
          total_price:  i.quantity * i.price,
        })),
      },
      {
        onSuccess: () => { setIsSaving(false); onOpenChange(false) },
        onError:   () => setIsSaving(false),
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 overflow-hidden p-0 w-[98vw] sm:w-[95vw] md:w-[90vw] max-w-4xl! h-[95vh] sm:h-[90vh] rounded-xl bg-white dark:bg-neutral-900 shadow-2xl border-0">

        {/* Header */}
        <header className="bg-linear-to-r from-red-500 to-orange-400 p-5 sm:p-6 text-white shrink-0">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="bg-white/20 p-2 rounded-lg shrink-0">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg sm:text-xl font-bold leading-tight">Update Order #{order?.order_number}</h2>
                <DialogDescription className="text-red-50/80 text-sm mt-0.5">
                  Add or remove items from this order
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="hover:bg-white/20 p-1.5 rounded-full transition-colors shrink-0 ml-2"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white text-slate-800 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-red-300 border-none shadow-inner"
            />
          </div>
        </header>

        {/* Category Tabs */}
        <nav className="border-b border-slate-100 dark:border-neutral-800 px-4 sm:px-6 py-3 overflow-x-auto flex gap-2 whitespace-nowrap bg-slate-50/50 dark:bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shrink-0">
          {[{ id: 'all', name: 'All Items' }, ...categories].map((c: any) => {
            const active = selectedCategory === String(c.id)
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(String(c.id))}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-200 dark:hover:bg-neutral-700'
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </nav>

        {/* Menu Grid */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-neutral-900">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <div className="h-10 w-10 rounded-full border-4 border-red-200 border-t-red-600 animate-spin" />
              <p className="text-sm text-gray-500 animate-pulse">Loading menu items…</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 rounded-full bg-gray-200 dark:bg-neutral-800 p-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">No items found</p>
              <p className="mt-1 text-sm text-gray-500 max-w-xs">Try changing the category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map((item: any) => {
                const qty        = getQty(item.id)
                const isSelected = qty > 0

                return (
                  <div
                    key={item.id}
                    className={`rounded-xl overflow-hidden flex flex-col transition-all ${
                      isSelected
                        ? 'border-2 border-red-500 bg-red-50/50 dark:bg-red-950/20 shadow-sm'
                        : 'border border-slate-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={item.image ? `/assets/images/menuitems/${item.image}` : '/assets/images/menuitems/food-default.png'}
                      alt={item.name}
                      className="w-full h-32 object-cover"
                      onError={(e: any) => { e.target.src = '/assets/images/menuitems/food-default.png' }}
                    />
                    <div className="p-3 flex flex-col flex-1">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm line-clamp-1" title={item.name}>
                        {item.name}
                      </h3>
                      <p className={`font-bold mt-1 text-sm ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                        ₹{Number(item.price).toFixed(2)}
                      </p>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <button
                          onClick={() => decrement(item)}
                          disabled={qty === 0}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            qty > 0
                              ? 'border-red-200 bg-white dark:bg-neutral-700 text-red-500 hover:bg-red-500 hover:text-white'
                              : 'border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className={`font-bold text-sm w-6 text-center ${qty > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {qty}
                        </span>
                        <button
                          onClick={() => addItem(item)}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            qty > 0
                              ? 'border-red-200 bg-white dark:bg-neutral-700 text-red-500 hover:bg-red-500 hover:text-white'
                              : 'border-slate-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-slate-600 dark:text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500'
                          }`}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-neutral-800 p-4 sm:p-6 bg-white dark:bg-neutral-900 shrink-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Summary stats */}
            <div className="flex gap-5 sm:gap-10 flex-wrap">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Items</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  {String(totalItems).padStart(2, '0')} {totalItems === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Subtotal</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Tax ({TAX_RATE}%)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">₹{tax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total + Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-right mr-1 sm:mr-2">
                <span className="block text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Amount</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">₹{grandTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setSelectedItems([])}
                disabled={selectedItems.length === 0 || isSaving}
                className="px-4 sm:px-6 py-2.5 rounded-lg border border-slate-200 dark:border-neutral-600 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={selectedItems.length === 0 || isSaving}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-bold shadow-lg shadow-red-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 whitespace-nowrap"
              >
                {isSaving ? 'Updating…' : 'Update Order'}
              </button>
            </div>
          </div>
        </footer>

      </DialogContent>
    </Dialog>
  )
}

export default AddItemsModal
