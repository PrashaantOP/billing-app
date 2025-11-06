import Heading from '@/components/heading';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import EditMenuItems from './editMenuItems';
import { IndianRupee } from 'lucide-react';
import DeleteMenuButton from './deleteMenuItems';
import NewMenuItem from './addMenuItems';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Menu Items', href: '/menu/items' },
];

type CategoryType = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
};

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
  category: CategoryType;
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
  categories: CategoryType[];
};

export default function MenuItemsPage({ menuItems, categories }: Props) {
  const hasItems = (menuItems?.data?.length ?? 0) > 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Menu Items" />

      {/* Header */}
      <div className="w-full px-4 pt-4 sm:pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Heading title="Our Menu Items" description="Manage our menu items" />
          <div className="flex justify-end">
            <NewMenuItem categories={categories} />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        {/* Empty State */}
        {!hasItems && (
          <div className="w-full">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-900">
              <img
                src="/assets/images/fixedlogos/empty.png"
                alt="No items"
                className="h-40 w-40 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                No menu items to show
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                Try adding a new menu item to get started.
              </p>
              <div className="mt-4">
                <NewMenuItem categories={categories} />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Cards (<= md) */}
        {hasItems && (
          <div className="space-y-3 md:hidden">
            {menuItems.data.map((mitem) => {
              const created = new Date(mitem.created_at).toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
              const isActive = mitem.is_available === 1;

              return (
                <div
                  key={mitem.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-12 overflow-hidden rounded-xl ring-2 ring-red-100 dark:ring-red-900/40">
                      <AvatarImage
                        src={`/assets/images/menuitems/${mitem.image ?? 'food-default.png'}`}
                        alt={mitem.image}
                      />
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-base font-semibold text-gray-900 dark:text-neutral-100">
                          {mitem.name}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                          }`}
                        >
                          {isActive ? 'Active' : 'Not Active'}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
                        <span className="truncate">{mitem.category?.name ?? 'Uncategorized'}</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-neutral-600" />
                        <span>{created}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-base font-bold text-gray-900 dark:text-neutral-100">
                      <IndianRupee className="h-4 w-4" />
                      {mitem.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <EditMenuItems
                        key={mitem.id + '-' + mitem.updated_at}
                        singleMenuItem={mitem}
                        categories={categories}
                      />
                      <DeleteMenuButton id={mitem.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Desktop Table (>= md) */}
        {hasItems && (
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700">
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Image
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Menu Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Menu Item
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Created At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-neutral-400">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {menuItems.data.map((mitem) => {
                      const created = new Date(mitem.created_at).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const isActive = mitem.is_available === 1;

                      return (
                        <tr key={mitem.id} className="bg-white dark:bg-neutral-900">
                          <td className="px-4 py-4">
                            <Avatar className="size-10 overflow-hidden rounded-lg ring-2 ring-red-100 dark:ring-red-900/40">
                              <AvatarImage
                                src={`/assets/images/menuitems/${mitem.image ?? 'food-default.png'}`}
                                alt={mitem.image}
                              />
                            </Avatar>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                            {mitem.category?.name ?? 'Uncategorized'}
                          </td>
                          <td className="px-4 py-4 text-sm font-semibold text-red-600 dark:text-red-400">
                            {mitem.name}
                          </td>
                          <td className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-neutral-100">
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" />
                              {mitem.price}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-700 dark:text-neutral-300">
                            {created}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                isActive
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                              }`}
                            >
                              {isActive ? 'Active' : 'Not Active'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-sm">
                            <div className="flex items-center justify-end gap-2">
                              <EditMenuItems
                                key={mitem.id + '-' + mitem.updated_at}
                                singleMenuItem={mitem}
                                categories={categories}
                              />
                              <DeleteMenuButton id={mitem.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {hasItems && (
          <div className="sticky bottom-2 mt-4 flex w-full items-center justify-center gap-2 px-1">
            <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-white p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
              {menuItems.links.map((link, index) => {
                const isDisabled = !link.url;
                const isActive = link.active;
                const isEllipsis = typeof link.label === 'string' && link.label.includes('...');

                return (
                  <button
                    key={index}
                    disabled={isDisabled}
                    onClick={() => {
                      if (link.url) router.visit(link.url);
                    }}
                    className={[
                      'px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
                      isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
                      'min-w-8 text-center',
                      isEllipsis ? 'pointer-events-none' : '',
                    ].join(' ')}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
