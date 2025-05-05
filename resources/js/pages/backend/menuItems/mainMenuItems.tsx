import Heading from '@/components/heading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import EditMenuItems from './editMenuItems';
import { IndianRupee } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Menu Items',
    href: '/menu/items',
  },
];

type MenuItemsData = {
    id: number;
    category_id: number;
    image: string;
    name: string;
    description: string;
    price: number;
    is_available: number;
    created_at: string;
    updated_at: string;
    category: {
      id: number;
      name: string;
      slug: string;
      created_at: string;
    }
};

type Props = {
    menuItems: {
    data: MenuItemsData[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
};

export default function Customers({ menuItems }: Props) {
//   const [editing, setEditing] = useState<Customer | null>(null);




  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Menu Items" />
      <div className="px-4 pt-6 w-full 2xl:w-1/2 flex">
        <div className='w-1/2'>
        <Heading title="Our Menu Items" description="Manage our menu items" />
        </div>
        <div className='w-1/2 flex justify-end'>
        {/* <AddNewCategory /> */}
        </div>

      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 w-full 2xl:w-1/2">
        <div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
    <thead className="bg-gray-50 dark:bg-neutral-700">
      <tr>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Image</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:block">Menu Category</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ">Menu Items</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 ">Price</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden lg:block">Created At</th>
        <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {menuItems.data.length > 0 ? (
        menuItems.data.map((mitem) => (
        <tr key={mitem.id}>
        <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
        <Avatar className="size-8 overflow-hidden rounded-full">
            <AvatarImage src={`/assets/images/menuitems/${mitem.image ?? 'food-default.png'}`} alt={mitem.image} />
            {/* <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(auth.user.name)}
            </AvatarFallback> */}
        </Avatar>
        </td>
          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200 hidden lg:block">{mitem.category.name}</td>
          <td className="px-4 py-4 text-sm font-bold text-red-600 dark:text-neutral-200">{mitem.name}</td>
          <td className="px-4 py-4 text-sm font-bold text-gray-800 dark:text-neutral-200"><div className="flex flex-row items-center justify-start"><IndianRupee className='w-3 h-3' />{mitem.price}</div></td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden lg:block">
            {new Date(mitem.created_at).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </td>
          <td className="block md:table-cell px-6 py-4 text-sm font-medium">
            <span className="md:hidden font-semibold">Status: </span>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                mitem.is_available === 1
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              }`}
            >
              {mitem.is_available ? 'Active' : 'Not Active'}
            </span>
          </td>
          <td className="px-4 py-4 text-end text-sm font-medium">
            <div className="flex gap-x-3 justify-end">
              <button className="text-gray-600 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
                <EditMenuItems key={mitem.id + '-' + mitem.updated_at} singleMenuItem={mitem} />
              </button>
              <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                {/* <DeleteCategoryButton id={category.id} /> */}
              </button>
            </div>
          </td>
        </tr>
      ))): (
        <tr>
    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-neutral-400">
      No menu item available
    </td>
  </tr>
    )}
    </tbody>
  </table>
</div>


          {/* Pagination */}
          <div className="flex space-x-2 mt-4 p-4">
          {menuItems.data.length > 0 ? (
            menuItems.links.map((link, index) => (
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