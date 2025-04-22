import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';
import { Check, CircleCheck, Minus, Plus, ShoppingCart, X } from 'lucide-react';

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
}


export default function CreateNewBill({ categories, menuitems, categoryname }: CreateNewBillProps) {


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
    setCartOpen(true);
    console.log('Selected items:', selectedItems);
}, [selectedItems]);

const total = selectedItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);



 //   right side cart work ends here

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new order" />

            <NewBillLayout categories={categories}>
                <div className="flex flex-row">
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

                <div className={`fixed lg:relative w-full sm:w-96 lg:max-w-xl lg:w-80 lg:rounded-md bg-white shadow-lg z-50 transform transition-transform duration-300  ${cartOpen ? 'translate-x-0 block  top-0 left-0 h-full' : 'translate-x-full hidden'}`}>
                        <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-bold">🛒 Cart</h2>
                        <button onClick={() => setCartOpen(false)}><X className="w-5 h-5" /></button>
                        </div>

                        <div className="p-4 overflow-y-auto h-[calc(100%-100px)]">
                        {selectedItems.length > 0 ? (
                            <ul className="space-y-3">
                            {selectedItems.map((item) => (
                                <li key={item.id} className="flex justify-between items-center p-3 bg-gray-100 rounded">
                                <div>
                                    <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.name}</p>
                                    <div className="flex items-center mt-1 space-x-2">
                                    <button onClick={() => decreaseQty(item.id)}><Minus className="w-4 h-4" /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => increaseQty(item.id)}><Plus className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p>₹{item.price * (item.quantity || 1)}</p>
                                    <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm">Remove</button>
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
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white rounded-full p-3 shadow-lg flex items-center gap-2 hover:bg-gray-800 transition md:hidden"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="text-sm">{selectedItems.length}</span>
      </button>


                {/* side bar end  */}

                </div>
            </NewBillLayout>
        </AppLayout>
    );
}
