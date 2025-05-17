import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {  useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';
import {  Check, CheckCircle, HandCoins, Landmark, Minus, Plus, Printer,  Save,  ShoppingCart, Split, WalletCards, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EditTaxes from '@/pages/settings/taxes/editTaxes';
import AddNewTax from '@/pages/settings/taxes/addTaxes';
import NewMenuItem from '../menuItems/addMenuItems';
import SearchAddUpdateSelectCustomer from '../customers/searchAddUpdateCustomer';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create new order',
        href: '/newbill/menu',
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
        rate_type: string;
    }[];
}

type Bill = {
    id: number;
    name: string;
    items: MenuItemType[];
    customer?: {
      name: string;
      phone: string;
    };
    discount?: {
      apply: boolean;
      type: 'percent' | 'fixed';
      value: string;
    };
    payment?: {
      isPaid: boolean;
      method: string;
      transactionId: string;
    };
};


export default function CreateNewBill({ categories, menuitems, categoryname, taxes }: CreateNewBillProps) {


// right side cart work starts here
// right side cart work starts here

const [cartOpen, setCartOpen] = useState(false);

// Payment details (optional: can be per bill if needed)
const [isPaid, setIsPaid] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('');
const [transactionId, setTransactionId] = useState('');
const [isReceived, setIsReceived] = useState(false);



//discount
const [applyDiscount, setApplyDiscount] = useState(false);
const [discountType, setDiscountType] = useState('percent'); // 'percent' or 'fixed'
const [discountValue, setDiscountValue] = useState('');



// Tabs / Bills
const [bills, setBills] = useState<Bill[]>([]);
const [activeBillId, setActiveBillId] = useState<number | null>(null);
const [billCounter, setBillCounter] = useState(() => {
  const storedCounter = localStorage.getItem('billCounter');
  return storedCounter ? parseInt(storedCounter) : 1;
});
// console.log(activeBillId);
useEffect(() => {
    if (bills.length === 0) {
        const defaultBill = { id: Date.now(), name: 'Bill 1', items: [] };
        setBills([defaultBill]);
        setActiveBillId(defaultBill.id);
        setBillCounter(2);
    } else if (bills.length === 1) {
        setActiveBillId(bills[0].id);
    }
}, [bills]);


const addNewBill = () => {
    const newId = Date.now();
    const newBill = { id: newId, name: `Bill ${billCounter}`, items: [] };
    setBills(prev => [...prev, newBill]);
    setActiveBillId(newId);
    setBillCounter(prev => prev + 1);
};

const switchBill = (id: number) => {
    setActiveBillId(id);
};

const removeBill = (id: number) => {
    setBills(prev => {
        const updated = prev.filter(b => b.id !== id);
        if (id === activeBillId) {
            const last = updated[updated.length - 1];
            setActiveBillId(last ? last.id : null);
        }
        return updated;
    });
};

const handleDiscountChange = (apply: boolean, type: 'percent' | 'fixed', value: string) => {
  setBills(prevBills =>
    prevBills.map(bill => {
      if (bill.id !== activeBillId) return bill;

      return {
        ...bill,
        discount: {
          apply,
          type,
          value,
        },
      };
    })
  );
};

// console.log(bills);

const activeBill = bills.find(bill => bill.id === activeBillId);

// ==========================
// Item Actions (per bill)
// ==========================

const handleSelect = (item: MenuItemType) => {
  setBills(prevBills =>
    prevBills.map(bill => {
      if (bill.id !== activeBillId) return bill;

      const exists = bill.items.find(i => i.id === item.id);
      const updatedItems = exists
        ? bill.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...bill.items, { ...item, quantity: 1 }];

      return {
        ...bill,
        items: updatedItems,
      };
    })
  );
};


const removeItem = (id: number) => {
  setBills(prevBills =>
    prevBills.map(bill => {
      if (bill.id !== activeBillId) return bill;
      return {
        ...bill,
        items: bill.items.filter(item => item.id !== id),
      };
    })
  );
};






// console.log(bills.find(bill => bill.id === activeBillId)?.items);


const increaseQty = (id: number) => {
  setBills(prevBills =>
    prevBills.map(bill => {
      if (bill.id !== activeBillId) return bill;

      const updatedItems = bill.items.map(i =>
        i.id === id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
      );

      return {
        ...bill,
        items: updatedItems,
      };
    })
  );
};

const decreaseQty = (id: number) => {
  setBills(prevBills =>
    prevBills.map(bill => {
      if (bill.id !== activeBillId) return bill;

      const updatedItems = bill.items.reduce<MenuItemType[]>((acc, i) => {
        if (i.id === id) {
          if ((i.quantity || 1) > 1) {
            acc.push({ ...i, quantity: (i.quantity || 1) - 1 });
          }
          // else don't push = remove item
        } else {
          acc.push(i);
        }
        return acc;
      }, []);

      return {
        ...bill,
        items: updatedItems,
      };
    })
  );
};

const handleIsPaidChange = (paid: boolean) => {
  setIsPaid(paid);
  if (!paid) {
    setPaymentMethod('');
    setTransactionId('');
  }

  setBills(prevBills =>
    prevBills.map(bill =>
      bill.id === activeBillId
        ? {
            ...bill,
            payment: {
              isPaid: paid,
              method: '',
              transactionId: '',
            },
          }
        : bill
    )
  );
};

const handlePaymentMethodChange = (method: string) => {
  setPaymentMethod(method);
  setBills(prevBills =>
    prevBills.map(bill =>
      bill.id === activeBillId && bill.payment?.isPaid
        ? {
            ...bill,
            payment: {
              ...bill.payment,
              method,
            },
          }
        : bill
    )
  );
};

const handleTransactionIdChange = (id: string) => {
  setTransactionId(id);
  setBills(prevBills =>
    prevBills.map(bill =>
      bill.id === activeBillId && bill.payment?.isPaid
        ? {
            ...bill,
            payment: {
              ...bill.payment,
              transactionId: id,
            },
          }
        : bill
    )
  );
};

// ==========================
// useEffect: Load bills from localStorage (optional)
// ==========================
useEffect(() => {
  const storedBills = localStorage.getItem('bills');
  const storedActiveBillId = localStorage.getItem('activeBillId');
  const storedCounter = localStorage.getItem('billCounter');

  if (storedCounter) {
    setBillCounter(parseInt(storedCounter));
  }

  if (storedBills) {
    const parsedBills = JSON.parse(storedBills);
    setBills(parsedBills);

    if (storedActiveBillId) {
      setActiveBillId(parseInt(storedActiveBillId));
    } else if (parsedBills.length > 0) {
      setActiveBillId(parsedBills[parsedBills.length - 1].id); // fallback to last bill
    }
  } else {
    // First-time visit: add default bill
    const defaultBill = { id: Date.now(), name: 'Bill 1', items: [] };
    setBills([defaultBill]);
    setActiveBillId(defaultBill.id);
    setBillCounter(2);
  }
}, []);

// Save bills to localStorage
useEffect(() => {
  localStorage.setItem('bills', JSON.stringify(bills));
}, [bills]);

// Save active tab to localStorage
useEffect(() => {
  if (activeBillId !== null) {
    localStorage.setItem('activeBillId', activeBillId.toString());
  }
  const updateCustomerFromStorage = () => {
        const storedCustomer = localStorage.getItem('billCustomer');
        if (!storedCustomer) return;

        const customer = JSON.parse(storedCustomer);

        setBills(prevBills =>
            prevBills.map(bill =>
                bill.id === activeBillId
                    ? { ...bill, customer }
                    : bill
            )
        );

        // Clear after use
        localStorage.removeItem('billCustomer');
    };

    // Listen to custom event
    window.addEventListener('bill-customer-updated', updateCustomerFromStorage);

    // Clean up
    return () => {
        window.removeEventListener('bill-customer-updated', updateCustomerFromStorage);
    };
}, [activeBillId]);

useEffect(() => {
  localStorage.setItem('billCounter', billCounter.toString());
}, [billCounter]);

useEffect(() => {
  const bill = bills.find(b => b.id === activeBillId);

  if (bill?.discount) {
    setApplyDiscount(bill.discount.apply);
    setDiscountType(bill.discount.type);
    setDiscountValue(bill.discount.value);
  } else {
    setApplyDiscount(false);
    setDiscountType('percent');
    setDiscountValue('');
  }
}, [activeBillId, bills]);

useEffect(() => {
  const bill = bills.find(b => b.id === activeBillId);

  // Sync Discount UI
  if (bill?.discount) {
    setApplyDiscount(bill.discount.apply);
    setDiscountType(bill.discount.type);
    setDiscountValue(bill.discount.value);
  } else {
    setApplyDiscount(false);
    setDiscountType('percent');
    setDiscountValue('');
  }

  // 🔄 Sync Payment UI
  if (bill?.payment) {
    setIsPaid(bill.payment.isPaid);
    setPaymentMethod(bill.payment.method);
    setTransactionId(bill.payment.transactionId);
  } else {
    setIsPaid(false);
    setPaymentMethod('');
    setTransactionId('');
  }

  // 🔄 Sync Received checkbox (if used)
  setIsReceived(!!bill?.received);

}, [activeBillId, bills]);

// ==========================
// Calculations for Active Bill
// ==========================

const selectedItems = activeBill?.items || [];

// 🧮 Subtotal & Total Items
const subtotal = selectedItems.reduce(
  (sum, item) => sum + item.price * (item.quantity || 1),
  0
);

const totalItems = selectedItems.reduce(
  (sum, item) => sum + (item.quantity || 1),
  0
);

//  Discount Calculation
let discountAmount = 0;
const numericDiscount = parseFloat(discountValue || '0');

if (applyDiscount && numericDiscount > 0) {
  if (discountType === 'percent') {
    discountAmount = (subtotal * numericDiscount) / 100;
  } else if (discountType === 'fixed') {
    discountAmount = Math.min(numericDiscount, subtotal);
  }
}

// 💳 Discounted Total (can't go below 0)
const discountedTotal = Math.max(subtotal - discountAmount, 0);

//  Tax Calculation
const totalTax = taxes.reduce((sum, tax) => {
  const rate = parseFloat(tax.rate);
  return sum + (tax.rate_type === 'percent'
    ? (discountedTotal * rate) / 100
    : rate);
}, 0);

//  Final Total
const totalWithTax = discountedTotal + totalTax;

console.log('Total with tax:', totalTax.toFixed(2));


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new order" />

            <NewBillLayout categories={categories}>
                {/* new tab start  */}
<div className="flex gap-2 mb-4 flex-wrap bg-gray-100 p-1 rounded-md w-fit">
  <AnimatePresence initial={false}>
    {bills.map((bill) => (
      <motion.div
        key={bill.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={() => switchBill(bill.id)}
        className={`flex items-center rounded-md px-3 py-1 cursor-default ${
          bill.id === activeBillId
            ? 'bg-white text-black shadow'
            : 'bg-gray-100 text-black hover:bg-gray-200'
        }`}
      >
        <span className="text-red font-bold mr-2">{bill.name}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeBill(bill.id);
          }}
          className="ml-1 text-sm hover:text-red-600 cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </motion.div>
    ))}
  </AnimatePresence>

  <motion.button
    whileTap={{ scale: 0.9 }}
    whileHover={{ scale: 1.05 }}
    onClick={addNewBill}
    className="px-3 py-1 rounded text-black hover:bg-gray-200 font-bold"
  >
    +
  </motion.button>
</div>

               



                {/* new tab end  */}
                <div className="flex flex-row items-center justify-start gap-2 ">
                <div className="space-y-6">
                    <HeadingSmall title={categoryname} description="Create new order and print" />
                    <div><NewMenuItem categories={categories} varient='link' size='nopd' /></div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {menuitems.length > 0 ? (
                        menuitems.map((item) => {
                            const isSelected = selectedItems.some(i => i.id === item.id);

                            return (
                                <div
                                    key={item.id}
                                    
                                    className={`relative p-4 border rounded-md shadow-sm bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200 ${
                                        isSelected ? 'ring-2 ring-green-500' : ''
                                    }`}
                                >
                                    <img
                                        src={`/assets/images/menuitems/${item.image ? item.image : 'food-default.png'}`}
                                        alt={item.name}
                                        className="w-full h-32 object-cover mb-2 aspect-square rounded-md select-none"
                                        onClick={() => item.is_available && handleSelect(item)}
                                    />
                                    {isSelected && item.is_available && (
                                //     console.log(bills.find(bill => bill.id === activeBillId)?.items[0].id === item.id),
                                        <div className="absolute top-0 left-0 w-full h-full bg-green-600/30 bg-opacity-50 flex flex-col items-start justify-start text-white text-sm font-medium rounded-md" >
                                          <div className="flex flex-row items-center justify-between w-full mt-1 px-1">
                                            <div className='w-5 h-5 flex flex-row align-center justify-center text-sm font-semibold text-white bg-green-600 rounded-full select-none'>{
        bills.find(bill => bill.id === activeBillId)?.items.find(i => i.id === item.id)?.quantity ?? 1
      }</div>
                                            {/* <div className='w-6 h-6 flex flex-row align-center justify-center text-sm font-semibold text-green-700 hover:text-red-400 rounded-full'><X className='w-4' strokeWidth='3' /></div> */}
                                            <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
  <X className="w-4 h-4" />
</button>
                                          </div>
                                          <div className="flex items-center justify-center h-full w-full" onClick={() => item.is_available && handleSelect(item)}>
                                            {/* <Check className='w-10 h-10 text-green-600' /> */}
                                            {/* {
        bills.find(bill => bill.id === activeBillId)?.items.find(i => i.id === item.id)?.quantity ?? 1
      } */}
                                          </div>
                                            
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
                                    <div onClick={() => item.is_available && handleSelect(item)} >
                                      <h3 className="text-lg font-semibold">{item.name.length > 12 ? `${item.name.slice(0, 10)}..` : item.name}</h3>
                                      <p className="text-gray-500">Price: ₹{item.price}</p>
                                    </div>
                                    
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-gray-500 p-6 whitespace-nowrap">No items available. </div>
                    )}

                    </div>
                </div>

                {/* side bar start  */}

                <div className={`fixed w-full top-2 bottom-2 right-0 lg:right-3 sm:w-96 lg:max-w-xl lg:w-100 lg:rounded-md bg-white shadow-lg z-4 transform transition-transform duration-300 h-full  ${cartOpen ? 'translate-x-0 block ' : 'translate-x-full hidden'}`}>
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
                                        <div className="flex flex-col items-start justify-start gap-2">
                                            <p className="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">{item.name}</p>
                                            {/* <Delete className='text-red-600 cursor-pointer' onClick={() => {removeItem(item.id)}} /> */}
                                        </div>

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
                            {applyDiscount && (
  <li className="flex justify-between gap-4 items-center">
    <div className="flex">
        <span className="text-xs">Discount</span><span className='text-xs flex flex-row items-center gap-2 ml-2'>
        ({discountType === 'percent' ? `${discountValue}%` : `₹${discountValue}`})
        </span>
    </div>
    <span className="text-xs font-semibold">
        <span className="text-red-600">-</span> ₹{discountAmount.toFixed(2)}
    </span>
  </li>   
)}
                            {taxes.length > 0 ? (
  taxes.map((item) => {
    const rate = parseFloat(item.rate);
    const taxAmount =
      item.rate_type === 'percent' ? (discountedTotal * rate) / 100 : rate;

    return (
      <li key={item.id} className="flex justify-between gap-4 items-center">
        <div className="flex">
          <span className="text-xs">{item.name}</span>
          <span className="text-xs flex flex-row items-center gap-2 ml-2">
            ({item.rate_type === 'percent' ? `${rate}%` : `₹${rate}`})<EditTaxes taxes={item} />
          </span>
        </div>
        <span className="text-xs font-semibold">
          <span className="text-green-600">+</span> ₹{taxAmount.toFixed(2)}
        </span>
      </li>
    );
  })
) : (
  <div></div>
)}



<AddNewTax varient={'link'} size={'nopd'} />
{/* <p>Subtotal: ₹{total.toFixed(2)}</p> */}


{/* Discount Checkbox */}
<li className="flex flex-wrap gap-2 pt-2 items-center justify-end">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={applyDiscount}
  onChange={(e) => {
    const isChecked = e.target.checked;
    setApplyDiscount(isChecked);

    if (!isChecked) {
      setDiscountValue('');
      setDiscountType('percent');
    }

    handleDiscountChange(isChecked, 'percent', ''); // reset or initialize
  }}
      className="w-5 h-5 text-green-600 accent-green-600"
    />
    <span className={`${applyDiscount ? 'text-green-600' : 'text-red-500'} font-medium`}>
      Discount
    </span>
  </label>
</li>

{/* Discount Inputs: Only show if checkbox checked */}
{applyDiscount && (
  <li className="flex gap-2 items-center pt-2">
    {/* Dropdown for Type */}
    <select
      value={discountType}
      onChange={(e) => {
    const newType = e.target.value as 'percent' | 'fixed';
    setDiscountType(newType);
    handleDiscountChange(applyDiscount, newType, discountValue);
  }}
      className="px-2 py-2 border rounded-md"
    >
      <option value="percent">%</option>
      <option value="fixed">₹</option>
    </select>

    {/* Input for Value */}
    <input
      type="number"
      value={discountValue}
      onChange={(e) => {
    const val = e.target.value;
    setDiscountValue(val);
    handleDiscountChange(applyDiscount, discountType, val);
  }}
      className="w-full px-3 py-2 border rounded-md"
      placeholder={discountType === 'percent' ? 'Enter %' : 'Enter ₹ amount'}
    />
  </li>
)}



<li className="pt-4 border-t font-bold flex justify-between gap-4">
    <span>Total:</span>
    <span>₹{totalWithTax.toFixed(2)}</span>
</li>

   <li className="flex flex-wrap gap-2 pt-2 items-center justify-end">
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={isPaid}
  onChange={(e) => handleIsPaidChange(e.target.checked)}
      className="w-5 h-5 text-green-600 accent-green-600"
    />
    <span className={`${isPaid ? 'text-green-600' : 'text-red-500'} font-medium`}>
      Received
    </span>
  </label>
</li>

{isPaid && (
  <>
    <li className="flex flex-wrap gap-2 pt-2">
      <button
        onClick={() => handlePaymentMethodChange('cash')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
          paymentMethod === 'cash' ? 'bg-green-200 text-green-600' : 'bg-gray-200'
        }`}
      >
        <HandCoins className="w-4 h-4" /> Cash
      </button>
      <button
        onClick={() => handlePaymentMethodChange('bank')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
          paymentMethod === 'bank' ? 'bg-blue-200 text-blue-600' : 'bg-gray-200'
        }`}
      >
        <Landmark className="w-4 h-4" /> Bank/UPI
      </button>
      <button
        onClick={() => handlePaymentMethodChange('cheque')}
        className={`flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer ${
          paymentMethod === 'cheque' ? 'bg-purple-200 text-purple-600' : 'bg-gray-200'
        }`}
      >
        <WalletCards className="w-4 h-4" /> Cheque
      </button>
    </li>

    {(paymentMethod === 'bank' || paymentMethod === 'cheque') && (
      <li className="pt-2 w-full">
        <label className="text-xs">
          {paymentMethod === 'bank' ? 'Transaction ID' : 'Cheque Number'}
        </label>
        <input
          type="text"
          value={transactionId}
          onChange={(e) => handleTransactionIdChange(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder={paymentMethod === 'bank' ? 'Enter Transaction ID' : 'Enter Cheque Number'}
        />
      </li>
    )}
  </>
)}
    {/* <li className='text-black font-bold mb-5 mt-10'>Customer Details</li> */}
    <li className="pt-4 pb-1 border-t">
      <h6 className="text-dark font-bold my-3">Customer Details</h6>
    </li>
    <li>
      <SearchAddUpdateSelectCustomer />
      {activeBill?.customer ? (
  <div className="mb-2 p-2 bg-gray-100 rounded">
    <div className="text-sm font-semibold text-gray-700">Customer</div>
    <div className="text-sm text-gray-800">
      {activeBill.customer.name} ({activeBill.customer.phone})
    </div>
  </div>
) : (
  <div className="mb-2 p-2 bg-gray-50 rounded text-sm text-gray-500">
    No customer
  </div>
)}


    </li>
                            </ul>
                        ) : (
                            <p className="text-gray-400 mt-10 text-center">No items selected.</p>
                        )}
                        </div>
                    </div>

                    {/* Floating Cart Toggle Button (Mobile-friendly) */}
                    <div className="fixed bottom-4 right-0 z-5 flex items-center justify-center lg:justify-end px-0 lg:px-10 gap-3 w-full">
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
                                    <span className="text-xs">{totalItems} {totalItems > 1 ? " Items" : " Item"}</span>
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
                                    <span className="text-xs font-semibold">Save</span>
                                    {/* <span className="text-xs">{totalItem} {totalItem > 1 ? " ITEMS" : " ITEM"}</span> */}
                                </motion.div>

                                {/* Arrow icon */}
                                <motion.div
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="bg-black/10 rounded-full p-2"
                                >
                                    <Save className="w-5 h-5" />
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
                                    <span className="text-xs font-semibold">Save & Print</span>
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
