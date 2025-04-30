import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

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

export default function AddNewCategory() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
    });


    const submitCustomer: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('category.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast.success('Category added succesfull!');
            }

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
                    <Button variant="destructive" onClick={() => setOpen(true)}>New Category</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogTitle>Add New Cagegory</DialogTitle>
                    <DialogDescription>Fill in the input to add a new category.</DialogDescription>

                    <form onSubmit={submitCustomer} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Category Name"
                            />
                            <InputError message={errors.name} />
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
