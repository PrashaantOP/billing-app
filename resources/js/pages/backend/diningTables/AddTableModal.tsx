import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

type AddTableModalProps = {
  restaurantName: string;
  restaurantId: number;
};

export default function AddTableModal({ restaurantName, restaurantId }: AddTableModalProps) {
  const [open, setOpen] = useState(false);

  const { data, setData, post, processing, reset, errors } = useForm({
    name: '',
    capacity: '',
    restaurant_id: restaurantId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/dining-tables', {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Add New Table</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add New Dining Table</DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Restaurant</label>
            <Input value={restaurantName} disabled readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Table Name</label>
            <Input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              required
              placeholder="Enter table name"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <Input
              type="number"
              min="1"
              value={data.capacity}
              onChange={e => setData('capacity', e.target.value)}
              required
              placeholder="Enter table capacity"
            />
            {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
          </div>
          <Button type="submit" disabled={processing}>Add Table</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
