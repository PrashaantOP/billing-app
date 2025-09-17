import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";

export default function AddStaffModal({ open, onOpenChange }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "staff"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post("/staff", {
      onSuccess: () => {
        reset();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input placeholder="Name" value={data.name} onChange={e => setData('name', e.target.value)} required />
          <Input placeholder="Email" value={data.email} onChange={e => setData('email', e.target.value)} />
          <Input placeholder="Mobile" value={data.mobile} onChange={e => setData('mobile', e.target.value)} />
          <Input placeholder="Password" type="password" value={data.password} onChange={e => setData('password', e.target.value)} required />
          {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          <Button type="submit" disabled={processing}>Add Staff</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
