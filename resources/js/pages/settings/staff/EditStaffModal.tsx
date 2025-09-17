import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";

export default function EditStaffModal({ open, onOpenChange, staff }) {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: staff?.name ?? "",
    email: staff?.email ?? "",
    mobile: staff?.mobile ?? "",
  });

  useEffect(() => {
    if (staff) {
      setData({
        name: staff.name ?? "",
        email: staff.email ?? "",
        mobile: staff.mobile ?? "",
      });
    }
  }, [staff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (staff?.id) {
      put(`/staff/${staff.id}`, {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)} required />
          <Input placeholder="Email" value={data.email} onChange={e => setData('email', e.target.value)} />
          <Input placeholder="Mobile" value={data.mobile} onChange={e => setData('mobile', e.target.value)} />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          <Button type="submit" disabled={processing}>Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
