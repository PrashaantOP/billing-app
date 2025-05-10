import { router, useForm } from '@inertiajs/react';
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
import { Switch } from '@/components/ui/switch'; // <-- for status toggle
import toast from 'react-hot-toast';
import AddNewCategory from '../categories/addCategory';

type Category = {
    id: number;
    name: string;
};

export default function NewMenuItem({ categories, varient, size, }: { categories: Category[]; varient: string; size: string; }) {
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm({
        name: '',
        description: '',
        price: '',
        is_available: true,
        image: null as File | null,
        category_id: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const closeModal = () => {
        reset();
        clearErrors();
        setPreviewImage(null);
        setOpen(false);
    };

    const submitMenuItem: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('menu.item.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
                toast.success('Menu item added successfully!');
                router.reload();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={varient} size={size}>New Item</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Add New Menu Item</DialogTitle>
                <DialogDescription>Fill in the details to add a new menu item.</DialogDescription>
                <AddNewCategory varient={'link'} size={'nopd'} />
                <form onSubmit={submitMenuItem} className="space-y-4">
                    {/* Category selection - moved to top */}
                    
                    <div>
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.category_id} />
                    </div>

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                        />
                        <InputError message={errors.price} />
                    </div>

                    <div>
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                            {previewImage && (
                                <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover rounded" />
                            )}
                            <input type="file" accept="image/*" onChange={handleImageChange} className='text-sm text-red-600 font-semibold cursor-pointer underline' />
                        </div>
                        <InputError message={errors.image} />
                    </div>

                    {/* Styled Status Switch */}
                    <div className="flex items-center justify-start gap-2">
                        <Label htmlFor="is_available">Status</Label>
                        <Switch
                            id="is_available"
                            checked={data.is_available}
                            onCheckedChange={(checked) => setData('is_available', checked)}
                        />
                    </div>
                    <InputError message={errors.is_available} />

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
    );
}
