import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash } from "lucide-react";
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';

type Staff = {
  id: number;
  name: string;
  role: string;
  email?: string | null;
  mobile?: string | null;
  is_active: boolean | number;
  assigned_at: string;
  image?: string | null;
};

type Props = {
  staffs: Staff[];
};

export default function StaffList({ staffs }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  function handleDelete(id: number) {
    if (confirm("Are you sure you want to delete this staff member?")) {
      router.delete(`/staff/${id}`);
    }
  }

  const hasItems = (staffs?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={[{ title: 'Staff', href: '/staff' }]}>
      <SettingsLayout>
        <Head title="Staff Members" />

        <AddStaffModal open={addOpen} onOpenChange={setAddOpen} />
        <EditStaffModal open={editOpen} onOpenChange={setEditOpen} staff={selectedStaff} />

        <div className="px-2 pt-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold">Current Restaurant Staff</h1>
            <Button size="sm" className="w-full sm:w-auto" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Add Staff
            </Button>
          </div>

          {/* Empty State */}
          {!hasItems && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              <img
                src="/assets/images/fixedlogos/empty.png"
                alt="No staff"
                className="mx-auto mb-4 h-44 w-44 object-contain"
              />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">No staff found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Add your first staff member to manage roles and assignments.
              </p>
              <div className="mt-4">
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Staff
                </Button>
              </div>
            </div>
          )}

          {/* Staff Cards */}
          {hasItems && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {staffs.map((staff) => {
                const active = Number(staff.is_active) === 1 || staff.is_active === true;
                return (
                  <div
                    key={staff.id}
                    className="flex h-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex items-center gap-4">
                      {staff.image ? (
                        <img
                          src={`/assets/images/users/${staff.image}`}
                          alt={staff.name}
                          className="h-14 w-14 rounded-full border object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-400 dark:bg-neutral-700">
                          {staff.name?.charAt(0) || '?'}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="truncate text-lg font-semibold text-gray-900 dark:text-neutral-100">
                          {staff.name}
                        </div>
                        <div className="capitalize text-xs text-gray-400 dark:text-neutral-500">
                          {staff.role}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col items-start justify-between gap-3 text-sm sm:flex-row sm:flex-wrap">
                      <div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500">Email</div>
                        <div className="break-all font-medium">
                          {staff.email || <span className="italic text-gray-400">N/A</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500">Mobile</div>
                        <div className="font-medium">
                          {staff.mobile || <span className="italic text-gray-400">N/A</span>}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 dark:text-neutral-500">Status</div>
                        <span
                          className={[
                            'inline-block rounded-full px-3 py-1 text-xs',
                            active
                              ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'
                              : 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
                          ].join(' ')}
                        >
                          {active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-400 dark:text-neutral-500">
                        Assigned:{' '}
                        <span className="font-medium text-gray-900 dark:text-neutral-100">
                          {new Date(staff.assigned_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setEditOpen(true);
                          }}
                          className="hover:bg-blue-50 dark:hover:bg-neutral-800"
                          title="Edit"
                          aria-label={`Edit ${staff.name}`}
                        >
                          <Edit2 className="h-5 w-5 text-blue-600" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(staff.id)}
                          className="hover:bg-red-50 dark:hover:bg-neutral-800"
                          title="Delete"
                          aria-label={`Delete ${staff.name}`}
                        >
                          <Trash className="h-5 w-5 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
