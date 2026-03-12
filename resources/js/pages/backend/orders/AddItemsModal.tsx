import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IndianRupee, Minus, Plus, Search, ShoppingCart, X } from 'lucide-react'
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

  const decrement = (item: any, e: React.MouseEvent) => {
    e.stopPropagation()
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
      <DialogContent className="flex flex-col gap-0 overflow-hidden p-0 w-[96vw] max-w-5xl h-[92vh] sm:h-[88vh] rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border-0">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 bg-linear-to-r from-red-600 to-orange-500 px-5 py-4 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight">Update Order #{order?.order_number}</h2>
              <DialogDescription className="text-xs text-white/80 mt-0.5">
                Add or remove items from this order
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Desktop search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/60" />
              <input
                placeholder="Search items…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-9 w-52 rounded-lg bg-white/20 pl-8 pr-3 text-sm text-white placeholder:text-white/60 outline-none focus:bg-white/30 transition-colors"
              />
            </div>
            {/* X Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="relative block sm:hidden shrink-0 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search menu items…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 h-9 bg-gray-50 dark:bg-neutral-800"
          />
        </div>

        {/* Category tabs */}
        <div className="shrink-0 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2">
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex w-max gap-2 pb-1">
              {[{ id: 'all', name: 'All Items' }, ...categories].map((c: any) => {
                const active = selectedCategory === String(c.id)
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(String(c.id))}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {c.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Item grid */}
        <ScrollArea className="flex-1 bg-gray-50 dark:bg-neutral-950/50">
          <div className="p-4">
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
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {filteredItems.map((item: any) => {
                  const qty        = getQty(item.id)
                  const isSelected = qty > 0

                  return (
                    <Card
                      key={item.id}
                      onClick={() => addItem(item)}
                      className={`group cursor-pointer overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                        isSelected
                          ? 'border-red-400 ring-2 ring-red-400/30 shadow-md dark:border-red-600'
                          : 'border-gray-200 dark:border-neutral-800 hover:border-red-300'
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-neutral-800">
                        <img
                          src={item.image ? `/assets/images/menuitems/${item.image}` : '/assets/images/menuitems/food-default.png'}
                          alt={item.name}
                          className={`h-full w-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`}
                          onError={(e: any) => { e.target.src = '/assets/images/menuitems/food-default.png' }}
                        />

                        {isSelected ? (
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-2">
                            <div className="flex items-center justify-between rounded-full bg-white dark:bg-neutral-800 px-1 py-0.5 shadow">
                              <button
                                onClick={(e) => decrement(item, e)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-600 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-red-400 transition-colors"
                              >
                                {qty === 1 ? <X className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                              </button>
                              <span className="text-sm font-bold text-gray-900 dark:text-white w-6 text-center">{qty}</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); addItem(item) }}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-colors"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md">
                              <Plus className="h-4 w-4 text-red-600" />
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-2.5">
                        <p className="line-clamp-2 text-xs font-semibold leading-tight text-gray-800 dark:text-gray-200" title={item.name}>
                          {item.name}
                        </p>
                        <div className="mt-1 flex items-center text-xs font-bold text-red-600 dark:text-red-400">
                          <IndianRupee className="h-3 w-3 mr-0.5" />
                          {Number(item.price).toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold text-sm">
                  {totalItems}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                  {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-neutral-700" />

              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Subtotal </span>
                  <span className="font-semibold text-gray-800 dark:text-neutral-200">₹{subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tax ({TAX_RATE}%) </span>
                  <span className="font-semibold text-green-600">₹{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-neutral-700" />

              <div className="text-xl font-black text-red-600 dark:text-red-400">₹{grandTotal.toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-2 sm:shrink-0">
              <Button
                variant="outline" size="sm"
                onClick={() => setSelectedItems([])}
                disabled={selectedItems.length === 0 || isSaving}
                className="rounded-full"
              >
                Clear
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={selectedItems.length === 0 || isSaving}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white px-6 shadow-md shadow-red-200 dark:shadow-none"
              >
                {isSaving ? 'Updating…' : 'Update Order'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemsModal
