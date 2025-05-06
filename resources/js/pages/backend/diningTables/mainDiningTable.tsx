import React from 'react';
import { PageProps } from '@/types';
import { Card } from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Menu Items',
    href: '/menu/items',
  },
];

type DiningTable = {
    id: number;
    restaurant_id: number;
    name: string;
    capacity: number;
    created_at: string;
    updated_at: string;
};

type Props = PageProps & {
    tables: DiningTable[];
};

export default function MainDiningTable({ tables }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu Items" />
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Dining Tables</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tables.map((table) => (
                    <Card key={table.id} className="p-4 shadow-sm">
                        <h2 className="font-semibold text-lg">{table.name}</h2>
                        <p className="text-gray-500">Capacity: {table.capacity}</p>
                        <p className="text-sm text-gray-400">Restaurant ID: {table.restaurant_id}</p>
                    </Card>
                ))}
            </div>
        </div>
        </AppLayout>
    );
}
