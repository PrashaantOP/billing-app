import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';
import {  Check, Minus, Plus, Printer,  ShoppingCart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Store settings',
        href: '/settings/store',
    },
];

// type StoreForm = {
//     store_name: string;
//     store_email: string;
//     store_phone: string;
//     store_address: string;
//     store_gst_no: string;
// };

type MenuItemType = {
    id: number;
    name: string;
    image: string;
    price: number;
    is_available: boolean;
    quantity?: number; // Added optional quantity property
}

type CreateNewBillProps = {
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
    menuitems: {
        id: number;
        name: string;
        image: string;
        price: number;
        is_available: boolean;

    }[];
    categoryname: string;
    taxes: {
        id: number;
        name: string;
        rate: number;
    }[];
}


export default function CreateNewBill({ categories, menuitems, categoryname, taxes }: CreateNewBillProps) {


   // right side cart work starts here

   const [cartOpen, setCartOpen] = useState(false);
const [selectedItems, setSelectedItems] = useState<MenuItemType[]>([]);



const handleSelect = (item: MenuItemType) => {
    setSelectedItems((prevItems) => {
        const exists = prevItems.find(i => i.id === item.id);

        const updatedItems = exists
            ? prevItems.filter(i => i.id !== item.id)
            : [...prevItems, { ...item, quantity: 1 }]; // Add quantity on new item

        localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
        return updatedItems;
    });
};



const increaseQty = (id: number) => {
    setSelectedItems(items => {
        const updated = items.map(i =>
            i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
        localStorage.setItem('selectedItems', JSON.stringify(updated));
        return updated;
    });
};

const decreaseQty = (id: number) => {
    setSelectedItems(items => {
        const updated = items.map(i =>
            i.id === id && (i.quantity || 1) > 1 ? { ...i, quantity: (i.quantity || 1) - 1 } : i
        );
        localStorage.setItem('selectedItems', JSON.stringify(updated));
        return updated;
    });
};

const removeItem = (id: number) => {
    setSelectedItems(items => {
        const updated = items.filter(i => i.id !== id);
        localStorage.setItem('selectedItems', JSON.stringify(updated));
        return updated;
    });
};



useEffect(() => {
    const stored = localStorage.getItem('selectedItems');
    if (stored) {
        setSelectedItems(JSON.parse(stored));
    }
}, []);

useEffect(() => {
    // setCartOpen(true);
    console.log('Selected items:', selectedItems);
}, [selectedItems]);

const total = selectedItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
const totalItem = selectedItems.reduce((sum, i) => sum + (i.quantity || 1), 0);




 //   right side cart work ends here

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new order" />

            <NewBillLayout categories={categories}>
                <div className="flex flex-row items-center justify-start gap-2 ">
                <div className="space-y-6">
                    <HeadingSmall title={categoryname} description="Create new order and print" />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {menuitems.length > 0 ? (
                        menuitems.map((item) => {
                            const isSelected = selectedItems.some(i => i.id === item.id);

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => item.is_available && handleSelect(item)}
                                    className={`relative p-4 border rounded-md shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                                        isSelected ? 'ring-2 ring-green-500' : ''
                                    }`}
                                >
                                    <img
                                        src={`/assets/images/menuitems/${item.image ? item.image : 'food-default.png'}`}
                                        alt={item.name}
                                        className="w-full h-32 object-cover mb-2"
                                    />
                                    {isSelected && item.is_available && (
                                        <div className="absolute top-0 left-0 w-full h-full bg-green-600/30 bg-opacity-50 flex items-center justify-center text-white text-sm font-medium rounded-md">
                                            <Check className='w-10 h-10 text-green-600' />
                                        </div>
                                    )}
                                    {/* <div className="absolute top-0 left-0 w-full h-full bg-black/60 bg-opacity-50 flex items-center justify-center text-white text-sm font-medium rounded-md">
                                            <CircleCheck />
                                        </div> */}

                                    {!item.is_available && (
                                        <div className="absolute top-0 left-0 w-full h-full bg-black/60 bg-opacity-50 flex items-center justify-center text-white text-sm font-medium rounded-md">
                                            Not Available
                                        </div>
                                    )}

                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-500">Price: ₹{item.price}</p>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 p-6 whitespace-nowrap">No items available.</div>
                    )}

                    </div>
                </div>

                {/* side bar start  */}

                <div className={`fixed w-full top-2 bottom-2 right-0 lg:right-3 sm:w-96 lg:max-w-xl lg:w-100 lg:rounded-md bg-white shadow-lg z-50 transform transition-transform duration-300 h-full  ${cartOpen ? 'translate-x-0 block ' : 'translate-x-full hidden'}`}>
                        <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold flex flex-row items-center justify-start gap-2"> Cart</h2>
                        <button onClick={() => setCartOpen(false)}><X className="w-5 h-5 cursor-pointer" /></button>
                        </div>

                        <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">
                        {selectedItems.length > 0 ? (
                            <ul className="space-y-3">
                            {selectedItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center p-3 bg-green-600/10 rounded">
                                    <div className="flex flex-row items-start gap-3">
                                        <img src={`/assets/images/menuitems/${item.image || "food-default.png"}`} className='w-15 h-15 bg-white rounded object-cover' alt="" />
                                    <div>
                                    <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.name}</p>
                                </div>
                                    </div>
                                    
                                <div className="text-right">
                                    <div className="flex flex-row items-center justify-center gap-3 text-white rounded-lg w-fit py-1 px-2 mt-1 bg-green-600">
                                        <button className='cursor-pointer' onClick={() => decreaseQty(item.id)}><Minus className="w-4 h-4" /></button>
                                        <span>{item.quantity}</span>
                                        <button className='cursor-pointer' onClick={() => increaseQty(item.id)}><Plus className="w-4 h-4" /></button>
                                    </div>
                                    <p className='text-sm'>₹{item.price * (item.quantity || 1)}</p>
                                </div>
                                </li>
                            ))}
                            <li className="pt-4 border-t font-bold flex justify-between">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </li>
                            </ul>
                        ) : (
                            <p className="text-gray-400 mt-10 text-center">No items selected.</p>
                        )}
                        </div>
                    </div>

                    {/* Floating Cart Toggle Button (Mobile-friendly) */}
                    <div className="fixed bottom-4 right-0 z-50 flex items-center justify-center lg:justify-end px-0 lg:px-10 gap-3 w-full">
                            <AnimatePresence>
                            {selectedItems.length > 0 && !cartOpen && (
                                <motion.div
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className=" bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-3  cursor-pointer"
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
                                                        src={`/assets/images/menuitems/${item.image || "food-default.png"}`}
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
                                    <span className="text-xs">{totalItem} {totalItem > 1 ? " Items" : " Item"}</span>
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
                                <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className=" bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-1  cursor-pointer"
                                >
                                {/* Initial single image pop-in */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.3 }}
                                    className="flex items-center -space-x-4"
                                >
                                    {selectedItems.slice(0, 3).map((item, index) => (
                                    <img
                                        key={index}
                                        src={`/assets/images/menuitems/${item.image || "food-default.png"}`}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-full border-2 border-green-600 object-cover"
                                    />
                                    ))}
                                </motion.div>

                                {/* Info section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col justify-center"
                                >
                                    <span className="text-xs font-semibold">KOT + Bill</span>
                                    {/* <span className="text-xs">{totalItem} {totalItem > 1 ? " ITEMS" : " ITEM"}</span> */}
                                </motion.div>

                                {/* Arrow icon */}
                                <motion.div
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-black/10 rounded-full p-2"
                                >
                                    <Printer className="w-5 h-5" />
                                </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {selectedItems.length > 0 && cartOpen && (
                                <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className=" bg-green-600 text-white rounded-full px-1 py-1 shadow-xl flex items-center space-x-1  cursor-pointer"
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
                                        src={`/assets/images/menuitems/${item.image || "food-default.png"}`}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-full border-2 border-green-600 object-cover"
                                    />
                                    ))}
                                </motion.div>
                                {/* Info section */}
                                <motion.div
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex flex-col justify-center"
                                >
                                    <span className="text-xs font-semibold">Bill</span>
                                    {/* <span className="text-xs">{totalItem} {totalItem > 1 ? " ITEMS" : " ITEM"}</span> */}
                                </motion.div>

                                {/* Arrow icon */}
                                <motion.div
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-black/10 rounded-full p-2"
                                >
                                    <Printer className="w-5 h-5" />
                                </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    



                {/* side bar end  */}

                </div>
            </NewBillLayout>
        </AppLayout>
    );
}
