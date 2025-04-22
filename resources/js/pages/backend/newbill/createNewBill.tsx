import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';
import { Minus, Plus } from 'lucide-react';

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

//    const [cartOpen, setCartOpen] = useState(false);
const [selectedItems, setSelectedItems] = useState<MenuItemType[]>([]);

  const handleSelect = (item: MenuItemType) => {
    setSelectedItems((prevItems) => {
        const exists = prevItems.find(i => i.id === item.id);
        if (exists) {
            return prevItems.filter(i => i.id !== item.id);
        }
        return [...prevItems, item];
    });
    
};

useEffect(() => {
    console.log('Selected items:', selectedItems);
}, [selectedItems]);


 
 
 //   right side cart work ends here

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new order" />

            <NewBillLayout categories={categories}>
                <div className="space-y-6">
                    <HeadingSmall title={categoryname} description="Create new order and print" />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {menuitems.length > 0 ? (
                        menuitems.map((item) => (
                            <div
                            key={item.id}
                            onClick={() => item.is_available && handleSelect(item)}
                            className="relative p-4 border rounded-md shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
                            >
                            <img
                                src={`/assets/images/menuitems/${item.image ? item.image : 'food-default.png'}`}
                                alt={item.name}
                                className="w-full h-32 object-cover mb-2"
                            />
                            
                            {/* Overlay if item is not available */}
                            {!item.is_available && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black/60 bg-opacity-50 flex items-center justify-center text-white text-sm font-medium rounded-md">
                                Not Available
                                </div>
                            )}

                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <p className="text-gray-500">Price: ₹{item.price}</p>
                            </div>
                        ))
                        ) : (
                        <div className="text-center text-gray-500 p-6 whitespace-nowrap">No items available.</div>
                        )}
                    </div>
                </div>

                
            </NewBillLayout>
        </AppLayout>
    );
}
