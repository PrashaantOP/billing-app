import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import NewCustomer from './newCustomer';
import EditCustomer from './editCustomer';
import DeleteCustomerButton from './deleteCustomer';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Customers',
    href: '/customers',
  },
];

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  customers: {
    data: Customer[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
};

export default function Customers({ customers }: Props) {
//   const [editing, setEditing] = useState<Customer | null>(null);




  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customers" />
      <div className="px-4 pt-6 w-full 2xl:w-2/3 flex">
        <div className='w-1/2'>
        <Heading title="Our Customers" description="Manage our customers" />
        </div>
        <div className='w-1/2 flex justify-end'>
        <NewCustomer />
        </div>

      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 w-full 2xl:w-2/3">
        <div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
    <thead className="bg-gray-50 dark:bg-neutral-700">
      <tr>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Mobile</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Email</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:table-cell">Address</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Created At</th>
        <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {customers.data.length > 0 ? (
        customers.data.map((customer) => (
        <tr key={customer.id}>
          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">{customer.name}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">{customer.phone}<div className='block lg:hidden'>{customer.email}</div></td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">{customer.email}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">{customer.address}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
            {new Date(customer.created_at).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </td>
          <td className="px-4 py-4 text-end text-sm font-medium">
            <div className="flex gap-x-3 justify-end">
              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
                <EditCustomer key={customer.id + '-' + customer.updated_at} customer={customer} />
              </button>
              <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                <DeleteCustomerButton id={customer.id} />
              </button>
            </div>
          </td>
        </tr>
      ))): (
        <tr>
    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400">
      No customer available
    </td>
  </tr>
    )}
    </tbody>
  </table>
</div>


          {/* Pagination */}
          <div className="flex space-x-2 mt-4 p-4">
          {customers.data.length > 0 ? (
            customers.links.map((link, index) => (
              <button
                key={index}
                disabled={!link.url}
                className={`px-3 py-1 text-sm border rounded cursor-pointer ${
                  link.active ? 'bg-red-600 text-white' : 'bg-white text-black'
                }`}
                onClick={() => {
                  if (link.url) router.visit(link.url);
                }}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))) : ''}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}