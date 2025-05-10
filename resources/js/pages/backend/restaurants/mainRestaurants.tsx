import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Our Restaurants',
    href: '/restaurants/view',
  },
];

type Restaurant = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

type Props = {
  restaurants: {
    data: Restaurant[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  current_restaurant_id: number | null;
};

export default function RestaurantsMain({ restaurants, current_restaurant_id }: Props) {
//   const [editing, setEditing] = useState<Customer | null>(null);




  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Restaurants" />
      <div className="px-4 pt-6 w-full 2xl:w-2/3 flex">
        <div className='w-1/2'>
        <Heading title="Our Restaurants" description="Manage our restaurants create and edit" />
        </div>
        <div className='w-1/2 flex justify-end'>
        {/* <NewCustomer /> */}
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
      {restaurants.data.length > 0 ? (
        restaurants.data.map((restaurant) => (
        <tr key={restaurant.id}>
          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">{restaurant.name}<span className='text-red-600'>{restaurant.id == current_restaurant_id ? ' (current)' : ''}</span></td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">{restaurant.phone}<div className='block lg:hidden'>{restaurant.email}</div></td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">{restaurant.email}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:table-cell">{restaurant.address}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
            {new Date(restaurant.created_at).toLocaleString('en-GB', {
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
                {/* <EditCustomer key={customer.id + '-' + customer.updated_at} customer={customer} /> */}
              </button>
              {/* <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                // <DeleteCustomerButton id={customer.id} />
              </button> */}
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
          {restaurants.data.length > 0 ? (
            restaurants.links.map((link, index) => (
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