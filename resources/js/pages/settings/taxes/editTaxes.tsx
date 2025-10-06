import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
import { Pencil, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TaxesType = {
    name: string;
    rate_type: 'percent' | 'amount';
    rate: string;
    is_inclusive: boolean;
    id: number;
};

export default function EditTaxes({ taxes }: { taxes: TaxesType }) {
    const [open, setOpen] = useState(false);

    const { data, setData, patch, processing, reset, errors, clearErrors } = useForm({
        name: taxes.name,
        rate_type: taxes.rate_type,
        rate: taxes.rate,
        is_inclusive: taxes.is_inclusive,
        id: taxes.id,
    });

    // Optional: reset form when modal is closed
    useEffect(() => {
        if (!open) {
            reset();
            setData('name', taxes.name);
            setData('rate_type', taxes.rate_type);
            setData('rate', taxes.rate);
            setData('is_inclusive', taxes.is_inclusive);
            clearErrors();
        }
    }, [open]);

    const updateTax: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('taxes.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Tax updated successfully!');
                setOpen(false);
            },
        });
    };

    const label = data.rate_type === 'amount' ? 'Amount (₹)' : 'Rate (%)';
    const placeholder = data.rate_type === 'amount' ? 'Enter amount in ₹' : 'Enter rate in %';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Pencil className="w-4 h-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Edit Tax</DialogTitle>
                <DialogDescription>Update the selected tax details.</DialogDescription>

                <form onSubmit={updateTax} className="space-y-6">
                <div className="flex flex-col gap-6">
                        <div>
                            <Label htmlFor="rate_type">Rate Type</Label>
                            <select
                                className="border rounded px-3 py-2 text-sm w-full"
                                id="rate_type"
                                value={data.rate_type}
                                onChange={(e) => setData('rate_type', e.target.value as 'percent' | 'amount')}
                            >
                                <option value="percent">Percent (%)</option>
                                <option value="amount">Fixed Amount (₹)</option>
                            </select>
                            <InputError className="mt-2" message={errors.rate_type} />
                        </div>

                        <div>
                            <Label htmlFor="rate">{label}</Label>
                            {data.rate_type === 'percent' ? (
                                <select
                                id="rate"
                                value={String(parseInt(data.rate))} // ensure value matches "15", not "15.00"
                                onChange={(e) => setData('rate', e.target.value)}
                                required
                                className="border rounded px-3 py-2 text-sm w-full"
                            >
                                <option value="">Select a value</option>
                                {Array.from({ length: 50 }, (_, i) => {
                                    const value = String(i + 1); // "1", "2", ..., "50"
                                    return (
                                        <option key={value} value={value}>
                                            {value}%
                                        </option>
                                    );
                                })}
                            </select>

                            ) : (
                                <Input
                                    id="rate"
                                    type="number"
                                    step="0.01"
                                    value={data.rate}
                                    onChange={(e) => setData('rate', e.target.value)}
                                    placeholder={placeholder}
                                    required
                                />
                            )}
                            <InputError className="mt-2" message={errors.rate} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="name">Tax Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-2" message={errors.name} />
                    </div>



                    <div className="flex items-center gap-3">
                        <div className="relative w-7 h-7">
                            <input
                                type="checkbox"
                                id="is_inclusive"
                                checked={data.is_inclusive}
                                onChange={(e) => {
                                    // console.log('Checked:', e.target.checked);
                                    setData('is_inclusive', e.target.checked);
                                }}
                                className="peer sr-only"
                            />
                            <motion.div
                                className="w-full h-full flex items-center justify-center rounded-full border-2 border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 shadow-inner"
                                animate={{
                                    backgroundColor: data.is_inclusive ? '#22c55e' : '#ffffff',
                                    borderColor: data.is_inclusive ? '#22c55e' : '#d1d5db',
                                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {data.is_inclusive ? (
                                        <motion.div
                                            key="checked"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        >
                                            <Check size={20} className="text-white" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="unchecked"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                        >
                                            <X size={20} className="text-red-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                        <Label htmlFor="is_inclusive" className="text-sm font-medium cursor-pointer">
                            Status
                        </Label>
                    </div>

                    <DialogFooter className="gap-2">
                        <DialogClose asChild>
                            <Button variant="secondary">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
