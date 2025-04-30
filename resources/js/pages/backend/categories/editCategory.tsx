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

type categoryType = {
    name: string;
    id: number;
};
export default function EditCategory({ category }: { customer: categoryType }) {
    const [open, setOpen] = useState(false);
    const { data, setData, patch, processing, reset, errors, clearErrors } = useForm({
        name: category.name ?? '',
        id: category.id,
    });


    const submitCustomer: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('category.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // router.reload({ only: ['customers'] });
                closeModal();
                toast.success('Category updated succesfully!');
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
                    <DialogTitle>Update category</DialogTitle>
                    <DialogDescription>Fill in the details to update category.</DialogDescription>

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
