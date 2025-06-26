import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingCart, Save, Printer } from 'lucide-react'
import { MenuItemType } from '@/types'

type Props = {
  selectedItems: MenuItemType[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  totalItems: number
  handleSaveOrder: () => void;
}

const FloatingCartToggle: React.FC<Props> = ({ selectedItems, cartOpen, setCartOpen, totalItems, handleSaveOrder }) => {
  return (
    <div className="fixed bottom-4 right-0 z-5 flex items-center justify-center lg:justify-end px-0 lg:px-10 gap-3 w-full">
      <AnimatePresence>
        {selectedItems.length > 0 && !cartOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-3 cursor-pointer"
            onClick={() => setCartOpen(true)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="flex items-center -space-x-4"
            >
              {selectedItems.slice(0, 3).map((item, index) => (
                <img
                  key={index}
                  src={`/assets/images/menuitems/${item.image || 'food-default.png'}`}
                  alt={item.name}
                  className="w-10 h-10 rounded-full border-2 border-green-600 object-cover"
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col justify-center"
            >
              <span className="text-xs font-semibold">View cart</span>
              <span className="text-xs">{totalItems} {totalItems > 1 ? 'Items' : 'Item'}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/10 rounded-full p-2"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItems.length > 0 && cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-1 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center -space-x-4"
              >
                {selectedItems.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={`/assets/images/menuitems/${item.image || 'food-default.png'}`}
                    alt={item.name}
                    className="w-10 h-10 rounded-full border-2 border-green-600 object-cover"
                  />
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col justify-center"
                onClick={handleSaveOrder}
              >
                <span className="text-xs font-semibold">Save</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/10 rounded-full p-2"
              >
                <Save className="w-5 h-5" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-1 cursor-pointer"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex items-center -space-x-4"
              >
                {selectedItems.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={`/assets/images/menuitems/${item.image || 'food-default.png'}`}
                    alt={item.name}
                    className="w-10 h-10 rounded-full border-2 border-green-600 object-cover"
                  />
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col justify-center"
              >
                <span className="text-xs font-semibold">Save & Print</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/10 rounded-full p-2"
              >
                <Printer className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingCartToggle
