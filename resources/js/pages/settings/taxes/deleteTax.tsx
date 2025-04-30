import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';

export default function DeleteTaxButton({ id }: { id: number }) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(route('taxes.destroy', id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Tax deleted successfully'),
            onError: () => toast.error('Failed to delete tax'),
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                
                    <Trash className="w-4 h-4 text-red-500" />
             
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Delete Tax</DialogTitle>
                <DialogDescription>Are you sure you want to delete this tax? This action cannot be undone.</DialogDescription>


                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                    >
                        {processing ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
