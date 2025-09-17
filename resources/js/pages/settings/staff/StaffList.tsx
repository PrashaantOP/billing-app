import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash } from "lucide-react";
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';

export default function StaffList({ staffs }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this staff member?")) {
      router.delete(`/staff/${id}`);
    }
  }

  return (
    <AppLayout breadcrumbs={[{ title: 'Staff', href: '/staff' }]}>
      <SettingsLayout>
        <Head title="Staff Members" />
        <AddStaffModal open={addOpen} onOpenChange={setAddOpen} />
        <EditStaffModal open={editOpen} onOpenChange={setEditOpen} staff={selectedStaff} />
        <div className="px-2 pt-4 sm:px-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <h1 className="text-2xl font-bold">Current Restaurant Staff</h1>
            <Button
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => setAddOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Staff
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {staffs.length > 0 ? (
              staffs.map((staff) => (
                <div
                  key={staff.id}
                  className="bg-white dark:bg-neutral-900 rounded-xl border border-gray-200 dark:border-neutral-800 shadow flex flex-col gap-3 p-5 h-full"
                >
                  <div className="flex items-center gap-4">
                    {staff.image ? (
                      <img
                        src={`/assets/images/users/${staff.image}`}
                        alt={staff.name}
                        className="w-14 h-14 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-lg font-bold text-gray-400">
                        {staff.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-lg">{staff.name}</div>
                      <div className="text-xs text-gray-400 dark:text-neutral-500 capitalize">{staff.role}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-between items-start text-sm mt-2">
                    <div>
                      <div className="text-xs text-gray-400 dark:text-neutral-500">Email</div>
                      <div className="font-medium break-all">{staff.email || <span className="text-gray-400 italic">N/A</span>}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 dark:text-neutral-500">Mobile</div>
                      <div className="font-medium">{staff.mobile || <span className="text-gray-400 italic">N/A</span>}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 dark:text-neutral-500">Status</div>
                      <span className={
                        staff.is_active
                          ? "inline-block px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          : "inline-block px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }>
                        {staff.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-400 dark:text-neutral-500">
                      Assigned: <span className="text-gray-900 dark:text-neutral-100 font-medium">{new Date(staff.assigned_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => { setSelectedStaff(staff); setEditOpen(true); }}
                        className="hover:bg-blue-50"
                        title="Edit"
                      >
                        <Edit2 className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(staff.id)}
                        className="hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash className="w-5 h-5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-lg shadow border border-gray-200 dark:border-neutral-800 p-8 text-center text-base text-gray-400 dark:text-neutral-500 bg-white dark:bg-neutral-900">
                No staff found.
              </div>
            )}
          </div>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
