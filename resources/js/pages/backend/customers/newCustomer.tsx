import { useForm } from '@inertiajs/react';
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

export default function NewCustomer() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '', // added address
    });

    
    const submitCustomer: FormEventHandler = (e) => {
        e.preventDefault();
    
        post(route('customers.store'), {
            preserveScroll: true,
            onSuccess: () => 
                closeModal()
            ,
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
                    <Button variant="destructive" onClick={() => setOpen(true)}>New Customer</Button>
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
