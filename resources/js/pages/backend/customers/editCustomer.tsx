import { useForm, router } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

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
import { Pencil } from 'lucide-react';

type customerType = {
    name: string;
    phone: string;
    email: string;
    address: string;
    id: number;
};
export default function EditCustomer({ customer }: { customer: customerType }) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, reset, errors, clearErrors } = useForm({
        name: customer.name ?? '',
        phone: customer.phone ?? '',
        email: customer.email ?? '',
        address: customer.address ?? '',
        id: customer.id,
    });


    const submitCustomer: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('customers.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // router.reload({ only: ['customers'] });
                closeModal();
                toast.success('Customer details updated succesfully!');
            },
        });
    };

    const closeModal = () => {
        reset();
        clearErrors();
        setOpen(false);
      };



    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Pencil className="w-4 h-4 cursor-pointer" onClick={() => setOpen(true)} />
                    {/* <Button variant="destructive" >New Customer</Button> */}
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>Fill in the details to register a new customer.</DialogDescription>

                    <form onSubmit={submitCustomer} className="space-y-4">
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

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Phone Number"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email Address"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div>
                            <Label htmlFor="address">Address</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Enter full address"
                                rows={3}
                            />
                            <InputError message={errors.address} />
                        </div>

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
