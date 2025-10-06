import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import axios from 'axios';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

export default function SearchAddUpdateSelectCustomer() {
    const [open, setOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const closeModal = () => {
        reset();
        clearErrors();
        setSuggestions([]);
        setOpen(false);
    };

    // Handle input change & search
    const handlePhoneChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('phone', value);

        if (value.length >= 3) {
            try {
                const response = await axios.get(route('customers.search'), {
                    params: { phone: value },
                });
                setSuggestions(response.data);
            } catch (err) {
                console.error(err);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    };

    // Select a customer from suggestions
    const handleSelectSuggestion = (customer: any) => {
        setData({
            name: customer.name,
            phone: customer.phone,
            email: customer.email || '',
            address: customer.address || '',
        });
        setSuggestions([]);
    };

    const submitCustomer: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('customers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                localStorage.setItem('billCustomer', JSON.stringify({
                    name: data.name,
                    phone: data.phone,
                }));

                // Optional: trigger custom event
                window.dispatchEvent(new Event('bill-customer-updated'));

                closeModal();
                toast.success('Customer details added successfully!');
            },
        });
    };

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {/* <Button variant="destructive">Add Customer Details</Button> */}
                    <button
                    className="flex items-center gap-2 w-full px-4 py-2 border border-gray-300 dark:border-neutral-600 rounded-t-md shadow-sm bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/50"
                    >
                    <UserPlus className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm">Customer</span>
                    </button>

                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add Customer Details</DialogTitle>
                    <DialogDescription>Search or create a customer by phone number.</DialogDescription>

                    <form onSubmit={submitCustomer} className="space-y-4">
                        {/* Phone Search Field */}
                        <div className="relative">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={handlePhoneChange}
                                placeholder="Phone Number"
                            />
                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded shadow max-h-40 overflow-auto">
                                    {suggestions.map((cust) => (
                                        <li
                                        key={cust.id}
                                        onClick={() => handleSelectSuggestion(cust)}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 text-sm text-gray-700 dark:text-gray-200"
                                        >
                                        {cust.phone} - {cust.name}
                                        </li>
                                    ))}
                                </ul>

                            )}
                            <InputError message={errors.phone} />
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Customer Name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        {/* Email */}
                        <div>
                            <Label htmlFor="email">Email (optional)</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Address"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Address */}
                        <div>
                            <Label htmlFor="address">Address (optional)</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Enter full address"
                                rows={3}
                            />
                            <InputError message={errors.address} />
                        </div>

                        {/* Actions */}
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <Button variant="secondary" onClick={closeModal}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
