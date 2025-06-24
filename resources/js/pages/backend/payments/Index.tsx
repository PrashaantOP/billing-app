import React from "react"
import { Head } from "@inertiajs/react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"

type Payment = {
  id: number
  restaurant_id: number
  order_id: number
  payment_date: string
  amount_paid: string
  payment_method: string
  transaction_reference: string
  notes: string
  created_at: string
  updated_at: string
}

interface Props {
  payments: Payment[]
}

export default function Index({ payments }: Props) {
  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "restaurant_id", header: "Restaurant ID" },
    { accessorKey: "order_id", header: "Order ID" },
    { accessorKey: "payment_date", header: "Date" },
    { accessorKey: "amount_paid", header: "Amount Paid" },
    { accessorKey: "payment_method", header: "Method" },
    { accessorKey: "transaction_reference", header: "Txn Ref" },
    { accessorKey: "notes", header: "Notes" },
    { accessorKey: "created_at", header: "Created At" },
  ]

  return (
    <>
      <Head title="Payments" />
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <DataTable columns={columns} data={payments} />
      </div>
    </>
  )
}
