import { router, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

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

import { Pencil, Circle, Check, ImagePlus, Cross, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

type CategoryType = {
    id: number;
    name: string;
};

type MenuItemType = {
    id: number;
    image: string;
    name: string;
    description: string;
    price: string;
    is_available: boolean;
    category: {
        id: number;
        name: string;
        slug: string;
        created_at: string;
      }
};

export default function EditMenuItems({
    singleMenuItem,
    categories,
}: {
    singleMenuItem: MenuItemType;
    categories: CategoryType[];
}) {
    const [open, setOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(singleMenuItem.image);

    type FormDataType = {
        name: string;
        id: number;
        description: string;
        price: string;
        is_available: boolean;
        image: File | null;
    };

    const { data, setData, post, processing, reset, errors, clearErrors } = useForm<FormDataType & { category_id: number }>({
        name: singleMenuItem.name,
        description: singleMenuItem.description || '',
        price: singleMenuItem.price,
        is_available: singleMenuItem.is_available,
        image: null,
        category_id: singleMenuItem.category.id,
        id: singleMenuItem.id,
    });

    useEffect(() => {
        if (!open) {
            reset();
            clearErrors();

            if (singleMenuItem.image) {
                setPreviewImage('/assets/images/menuitems/' + singleMenuItem.image);
            } else {
                setPreviewImage(null); // or a placeholder path
            }
        }
    }, [open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const updateMenuItem: FormEventHandler = (e) => {
        e.preventDefault();

       // const formData = new FormData();
       // formData.append('id', String(data.id));
       // formData.append('name', data.name);
       // formData.append('description', data.description);
       // formData.append('price', data.price);
       // formData.append('is_available', data.is_available ? '1' : '0');
       // formData.append('category_id', String(data.category_id));
       // if (data.image) {
       //     formData.append('image', data.image);
       // }

        post(route('menu-items.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Menu item updated successfully!');
                setOpen(false);
                router.reload();
            },
        });
    };

    const animationProps = {
        initial: { scale: 0 },
        animate: { scale: 1 },
        exit: { scale: 0 },
        transition: { type: 'spring', stiffness: 400, damping: 20 },
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Pencil className="w-4 h-4 cursor-pointer" />
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogDescription>Update the menu item details below.</DialogDescription>

                <form onSubmit={updateMenuItem} className="space-y-5">
                <div>
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', Number(e.target.value))}
                    className="w-full mt-1 border rounded px-3 py-2 text-sm"
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <InputError className="mt-1" message={errors.category_id} />
            </div>

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name as string}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />
                        <InputError className="mt-1" message={errors.name} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description as string}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        <InputError className="mt-1" message={errors.description} />
                    </div>

                    <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={data.price as string}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                        />
                        <InputError className="mt-1" message={errors.price} />
                    </div>

                    <div>
                        <Label>Image</Label>
                        <div className="flex items-center gap-4">
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded border"
                                />
                            )}
                            <label className="flex items-center gap-2 cursor-pointer">
                                <ImagePlus className="w-5 h-5 text-muted-foreground" />
                                <span className="text-sm font-medium text-blue-600">Change Image</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <InputError className="mt-1" message={errors.image} />
                    </div>

                    <div>
                        <Label className="mb-2 block">Availability</Label>
                        <label htmlFor="is_available" className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                id="is_available"
                                checked={data.is_available as boolean}
                                onChange={(e) => setData('is_available', e.target.checked)}
                                className="peer hidden"
                            />
                            <motion.div
                                className="w-7 h-7 flex items-center justify-center rounded-full border-2"
                                animate={{
                                    backgroundColor: data.is_available ? '#22c55e' : '#ffffff',
                                    borderColor: data.is_available ? '#22c55e' : '#d1d5db',
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    {data.is_available ? (
                                        <motion.div key="checked" {...animationProps}>
                                            <Check size={20} className="text-white" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="unchecked" {...animationProps}>
                                            <X size={20} className="text-red-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                            <span className="text-sm font-medium">Available</span>
                        </label>
                        <InputError className="mt-1" message={errors.is_available} />
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
