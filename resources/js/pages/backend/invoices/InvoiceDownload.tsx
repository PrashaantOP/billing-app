import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Download, FileText, Loader2 } from 'lucide-react';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import * as XLSX from 'xlsx';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Invoices', href: '/invoices' },
];

type OrderItem = { name: string; quantity: number; price: number; total_price: number };
type Tax = { rate: number; rate_type: string; amount: number };
type Order = {
  id: number;
  order_number: string;
  order_type: string;
  status: string;
  payment_status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  created_at: string;
  customer: { name: string; phone: string };
  items: OrderItem[];
  taxes: Tax[];
  payment_method: string;
};
type Restaurant = { name: string; phone: string; email: string; address: string; gst_no: string };

export default function InvoiceDownload() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [loadingGst, setLoadingGst] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [summary, setSummary] = useState<{ orders: number; total: number } | null>(null);

  const fetchData = async (): Promise<{ orders: Order[]; restaurant: Restaurant | null } | null> => {
    const params = new URLSearchParams();
    if (dateRange.from) params.set('start_date', dateRange.from);
    if (dateRange.to) params.set('end_date', dateRange.to);

    const res = await fetch(`/invoices/order-data?${params.toString()}`, {
      headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
    });
    if (!res.ok) return null;
    return res.json();
  };

  const downloadGstInvoice = async () => {
    setLoadingGst(true);
    try {
      const data = await fetchData();
      if (!data || !data.orders.length) {
        alert('No orders found for the selected date range.');
        return;
      }
      const { orders, restaurant } = data;

      const rows: (string | number)[][] = [];

      if (restaurant) {
        rows.push([`GST Invoice Report — ${restaurant.name}`]);
        if (restaurant.gst_no) rows.push([`GSTIN: ${restaurant.gst_no}`]);
        if (restaurant.address) rows.push([`Address: ${restaurant.address}`]);
        if (restaurant.phone) rows.push([`Phone: ${restaurant.phone}`]);
        rows.push([]);
      }

      const from = dateRange.from || 'All';
      const to = dateRange.to || 'All';
      rows.push([`Period: ${from} to ${to}`]);
      rows.push([]);

      rows.push([
        'S.No', 'Invoice / Order No.', 'Date', 'Customer Name', 'Customer Phone',
        'Order Type', 'Taxable Amount (₹)', 'GST Amount (₹)', 'Total Amount (₹)',
        'Payment Status', 'Payment Method',
      ]);

      orders.forEach((o, i) => {
        rows.push([
          i + 1, o.order_number, o.created_at, o.customer.name, o.customer.phone,
          o.order_type, Number(o.subtotal), Number(o.tax), Number(o.total),
          o.payment_status, o.payment_method,
        ]);
      });

      rows.push([]);
      rows.push([
        '', '', '', '', '', 'Total',
        orders.reduce((s, o) => s + Number(o.subtotal), 0),
        orders.reduce((s, o) => s + Number(o.tax), 0),
        orders.reduce((s, o) => s + Number(o.total), 0),
        '', '',
      ]);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [
        { wch: 6 }, { wch: 20 }, { wch: 22 }, { wch: 22 }, { wch: 14 },
        { wch: 12 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 16 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'GST Invoice');
      XLSX.writeFile(wb, `GST_Invoice_${from}_to_${to}.xlsx`);

      setSummary({ orders: orders.length, total: orders.reduce((s, o) => s + Number(o.total), 0) });
    } catch {
      alert('Failed to generate GST invoice. Please try again.');
    } finally {
      setLoadingGst(false);
    }
  };

  const downloadOrderInvoice = async () => {
    setLoadingOrder(true);
    try {
      const data = await fetchData();
      if (!data || !data.orders.length) {
        alert('No orders found for the selected date range.');
        return;
      }
      const { orders, restaurant } = data;

      const rows: (string | number)[][] = [];

      if (restaurant) {
        rows.push([`Order Invoice Report — ${restaurant.name}`]);
        if (restaurant.gst_no) rows.push([`GSTIN: ${restaurant.gst_no}`]);
        rows.push([]);
      }

      const from = dateRange.from || 'All';
      const to = dateRange.to || 'All';
      rows.push([`Period: ${from} to ${to}`]);
      rows.push([]);

      rows.push([
        'S.No', 'Date', 'Order No.', 'Customer Name', 'Phone', 'Items',
        'Order Type', 'Subtotal (₹)', 'Discount (₹)', 'Tax/GST (₹)', 'Total (₹)',
        'Payment Status', 'Payment Method',
      ]);

      orders.forEach((o, i) => {
        const itemsStr = o.items.map(it => `${it.name} x${it.quantity}`).join(', ');
        rows.push([
          i + 1, o.created_at, o.order_number, o.customer.name, o.customer.phone,
          itemsStr, o.order_type, Number(o.subtotal), Number(o.discount), Number(o.tax),
          Number(o.total), o.payment_status, o.payment_method,
        ]);
      });

      rows.push([]);
      rows.push([
        '', '', '', '', '', '', 'Total',
        orders.reduce((s, o) => s + Number(o.subtotal), 0),
        orders.reduce((s, o) => s + Number(o.discount), 0),
        orders.reduce((s, o) => s + Number(o.tax), 0),
        orders.reduce((s, o) => s + Number(o.total), 0),
        '', '',
      ]);

      const ws = XLSX.utils.aoa_to_sheet(rows);
      ws['!cols'] = [
        { wch: 6 }, { wch: 22 }, { wch: 18 }, { wch: 20 }, { wch: 14 },
        { wch: 40 }, { wch: 12 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
        { wch: 14 }, { wch: 14 }, { wch: 16 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Order Invoice');
      XLSX.writeFile(wb, `Order_Invoice_${from}_to_${to}.xlsx`);

      setSummary({ orders: orders.length, total: orders.reduce((s, o) => s + Number(o.total), 0) });
    } catch {
      alert('Failed to generate order invoice. Please try again.');
    } finally {
      setLoadingOrder(false);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Invoice Download" />

      <div className="w-full px-3 pt-4 sm:px-6 lg:px-4">
        <div className="mb-6">
          <Heading title="Invoice Download" description="Download GST and order invoices as Excel sheets" />
        </div>

        {/* Date Range Filter */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
          <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-neutral-100">
            Select Date Range
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <DateRangePicker
                value={dateRange}
                onChange={(range) => { setDateRange(range); setSummary(null); }}
              />
            </div>
            {(dateRange.from || dateRange.to) && (
              <Button
                variant="outline"
                className="shrink-0"
                onClick={() => { setDateRange({ from: '', to: '' }); setSummary(null); }}
              >
                Clear
              </Button>
            )}
          </div>
          {(!dateRange.from && !dateRange.to) && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              No date range selected — all orders will be included.
            </p>
          )}
          {(dateRange.from || dateRange.to) && (
            <p className="mt-2 text-xs text-green-600 dark:text-green-400">
              Filtering from <strong>{dateRange.from || 'beginning'}</strong> to <strong>{dateRange.to || 'today'}</strong>
            </p>
          )}
        </div>

        {/* Download Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* GST Invoice */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-neutral-100">GST Invoice</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Taxable amount, GST breakup, totals
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Includes: Order No., Date, Customer, Taxable Amount, GST Amount, Total, Payment Status.
            </p>
            <Button
              onClick={downloadGstInvoice}
              disabled={loadingGst || loadingOrder}
              className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loadingGst ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Download GST Invoice (.xlsx)</>
              )}
            </Button>
          </div>

          {/* Order Invoice */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <FileSpreadsheet className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-neutral-100">Order Invoice</h3>
                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Full order details with items, datewise
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              Includes: Date, Order No., Customer, Items, Subtotal, Discount, Tax, Total, Payment.
            </p>
            <Button
              onClick={downloadOrderInvoice}
              disabled={loadingGst || loadingOrder}
              className="mt-auto w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {loadingOrder ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Download className="mr-2 h-4 w-4" /> Download Order Invoice (.xlsx)</>
              )}
            </Button>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="mt-6 flex items-center gap-4 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
              <Download className="h-5 w-5 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">Download successful!</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                {summary.orders} orders exported — Total: ₹{Number(summary.total).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
