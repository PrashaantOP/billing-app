import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from '@inertiajs/react';

type EditTableModalProps = {
  table: {
    id: number;
    name: string;
    capacity: number;
    restaurant: { name: string };
  };
};

export default function EditTableModal({ table }: EditTableModalProps) {
  const [open, setOpen] = useState(false);

  const { data, setData, put, processing, errors, reset } = useForm({
    name: table.name,
    capacity: table.capacity,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/dining-tables/${table.id}`, {
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Edit Dining Table</DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Restaurant</label>
            <Input value={table.restaurant.name} disabled readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium">Table Name</label>
            <Input
              value={data.name}
              onChange={e => setData('name', e.target.value)}
              required
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium">Capacity</label>
            <Input
              type="number"
              min="1"
              value={data.capacity}
              onChange={e => setData('capacity', e.target.value)}
              required
            />
            {errors.capacity && <p className="text-red-500 text-xs">{errors.capacity}</p>}
          </div>
          <Button type="submit" disabled={processing}>Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
