import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {  useEffect, useState } from 'react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';
// import SettingsLayout from '@/layouts/settings/layout';
import NewBillLayout from '@/layouts/newBill/layout';
import NewMenuItem from '../menuItems/addMenuItems';
import FloatingCartToggle from './components/FloatingCartToggle';
import BillTabs from './components/BillTabs';
import MenuItemGrid from './components/MenuItemGrid';
import CartSidebar from './components/CartSidebar';
import toast from 'react-hot-toast';


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
    orderType?: string;
    diningTableId?: string;
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

const [isSaving, setIsSaving] = useState(false); //order confirm

//discount
const [applyDiscount, setApplyDiscount] = useState(false);
const [discountType, setDiscountType] = useState('percent');
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
        const defaultBill = { id: Date.now(), name: 'Bill 1', items: [], orderType: 'dinein', diningTableId: '', };
        setBills([defaultBill]);
        setActiveBillId(defaultBill.id);
        setBillCounter(2);
    } else if (bills.length === 1) {
        setActiveBillId(bills[0].id);
    }
}, [bills]);


const addNewBill = () => {
    const newId = Date.now();
    const newBill = { id: newId, name: `Bill ${billCounter}`, items: [], orderType: 'dinein', diningTableId: '' };
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
// console.log('Total with tax:', totalTax.toFixed(2));
// console.log(bills);

const playOrderConfirmSound = () => {
  const audio = new Audio('/assets/sounds/order-create.mp3'); // path to your audio file
  audio.play();
}


const handleSaveOrder = () => {
  setIsSaving(true);

  const bill = bills.find(b => b.id === activeBillId);
  if (!bill || bill.items.length === 0) {
    alert('No items to save.');
    return;
  }

  const discountType = bill.discount?.type || null;
  const discountValue = bill.discount?.value || null;
  const discountAmount = applyDiscount && discountValue
    ? discountType === 'percent'
      ? (subtotal * parseFloat(discountValue)) / 100
      : parseFloat(discountValue)
    : 0;

  const payload = {
    // restaurant_id: null,
    order_type: bill.orderType || 'dinein',
    dining_table_id: bill.orderType === 'dinein' ? bill.diningTableId || null : null,
    customer: bill.customer || null,

    items: bill.items.map(i => ({
      menu_item_id: i.id,
      quantity: i.quantity || 1,
      price: i.price,
      total_price: i.price * (i.quantity || 1),
    })),

    discount_type: discountType,
    discount_value: discountValue,
    discount: discountAmount,
    subtotal,
    tax: totalTax,
    total: totalWithTax,
    payment_status: bill.payment?.isPaid ? 'paid' : 'pending',
    payment: bill.payment || null,
  };

  router.post('/orders', payload, {
    onError: (errors) => {
      setIsSaving(false);
      // ✅ Show specific error
      console.error('Validation errors:', errors)
      // alert(errors.error || 'Failed to save order.')
      toast.error(errors.error || 'Failed to save order.');
    },
    onSuccess: () => {

      // ✅ Play confirmation sound
      playOrderConfirmSound();

      // ✅ Optional: clear cart, show toast, etc.
      

      setIsSaving(false);
      // ✅ Reset bills state
    const defaultBill = {
        id: Date.now(),
        name: 'Bill 1',
        items: [],
      }

      setBills([defaultBill])
      setActiveBillId(defaultBill.id)
      setBillCounter(2)

      // ✅ Also reset payment & discount UI if needed
      setIsPaid(false)
      setPaymentMethod('')
      setTransactionId('')
      setApplyDiscount(false)
      setDiscountType('percent')
      setDiscountValue('')
      setCartOpen(false)

      // ✅ Remove any localStorage data
      localStorage.removeItem('bills')
      localStorage.removeItem('activeBillId')
      localStorage.setItem('billCounter', '2')

      //visit to orders page
      router.visit('/orders/view');
      toast.success('Order successfully created!');
    //   alert('Order saved successfully.')
    },
  })
};



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new order" />

            

            <NewBillLayout categories={categories}>
                {/* new tab start  */}
                <BillTabs
                    bills={bills}
                    activeBillId={activeBillId}
                    switchBill={switchBill}
                    removeBill={removeBill}
                    addNewBill={addNewBill}
                />

                {/* new tab end  */}
                <div className="flex flex-row items-center justify-start gap-2 ">
                <div className="space-y-6">
                    <HeadingSmall title={categoryname} description="Create new order and print" />
                    <div><NewMenuItem categories={categories} varient='link' size='nopd' /></div>

                    {/* here is new compo  */}
                    <MenuItemGrid
                        items={menuitems}
                        selectedItems={selectedItems}
                        activeBillItems={activeBill?.items || []}
                        handleSelect={handleSelect}
                        removeItem={removeItem}
                    />
                </div>

                {/* side bar start  */}

                <CartSidebar
                    cartOpen={cartOpen}
                    setCartOpen={setCartOpen}
                    selectedItems={selectedItems}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeItem={removeItem}
                    applyDiscount={applyDiscount}
                    discountType={discountType}
                    discountValue={discountValue}
                    setApplyDiscount={setApplyDiscount}
                    setDiscountType={setDiscountType}
                    setDiscountValue={setDiscountValue}
                    handleDiscountChange={handleDiscountChange}
                    discountAmount={discountAmount}
                    taxes={taxes}
                    discountedTotal={discountedTotal}
                    totalWithTax={totalWithTax}
                    isPaid={isPaid}
                    paymentMethod={paymentMethod}
                    transactionId={transactionId}
                    handleIsPaidChange={handleIsPaidChange}
                    handlePaymentMethodChange={handlePaymentMethodChange}
                    handleTransactionIdChange={handleTransactionIdChange}
                    activeBill={activeBill}
                    orderType={activeBill?.orderType || 'dinein'}
                    setOrderType={(type) =>
                      setBills(prev =>
                        prev.map(bill =>
                          bill.id === activeBillId ? { ...bill, orderType: type } : bill
                        )
                      )
                    }
                    selectedTable={activeBill?.diningTableId || ''}
                    setSelectedTable={(id) =>
                      setBills(prev =>
                        prev.map(bill =>
                          bill.id === activeBillId ? { ...bill, diningTableId: id } : bill
                        )
                      )
                    }
                />


                    {/* inside render */}
<FloatingCartToggle
  selectedItems={selectedItems}
  cartOpen={cartOpen}
  setCartOpen={setCartOpen}
  totalItems={totalItems}
  handleSaveOrder={handleSaveOrder}
  isSaving={isSaving}
/>

                </div>
            </NewBillLayout>
        </AppLayout>
    );
}

