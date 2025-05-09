import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AddNewCategory from './addCategory';
import EditCategory from './editCategory';
import DeleteCategoryButton from './deleteCategory';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Customers',
    href: '/customers',
  },
];

type Categories = {
    id: number;
    name: string;
    slug: string;
    created_at: string;
};

type Props = {
    categories: {
    data: Categories[];
    current_page: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
};

export default function Customers({ categories }: Props) {
//   const [editing, setEditing] = useState<Customer | null>(null);




  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Customers" />
      <div className="px-4 pt-6 w-full 2xl:w-1/2 flex">
        <div className='w-1/2'>
        <Heading title="Our Customers" description="Manage our customers" />
        </div>
        <div className='w-1/2 flex justify-end'>
        <AddNewCategory varient={'destructive'} size={'sm'} />
        </div>

      </div>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden dark:border-neutral-700 w-full 2xl:w-1/2">
        <div className="w-full overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
    <thead className="bg-gray-50 dark:bg-neutral-700">
      <tr>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Name</th>
        <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-400 hidden md:table-cell">Created At</th>
        <th className="px-4 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-400">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
      {categories.data.length > 0 ? (
        categories.data.map((category) => (
        <tr key={category.id}>
          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">{category.name}</td>
          <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200 hidden md:table-cell">
            {new Date(category.created_at).toLocaleString('en-GB', {
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
                <EditCategory category={category} />
              </button>
              <button className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400">
                <DeleteCategoryButton id={category.id} />
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
          {categories.data.length > 0 ? (
            categories.links.map((link, index) => (
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