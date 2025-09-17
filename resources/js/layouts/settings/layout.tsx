import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
  { title: 'Profile', href: '/settings/profile', icon: null },
  { title: 'Store', href: '/settings/store', icon: null },
  { title: 'Taxes', href: '/settings/taxes', icon: null },
  { title: 'Staff', href: '/staff', icon: null },
  { title: 'Password', href: '/settings/password', icon: null },
  { title: 'Appearance', href: '/settings/appearance', icon: null },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
  // SSR guard (bladyyy inertia pattern!)
  if (typeof window === 'undefined') return null;

  const currentPath = window.location.pathname;
  const { current_role } = usePage().props;

  // Only show "Store" and "Staff" for admin role
  const filteredNavItems = sidebarNavItems.filter(item => {
    if (current_role !== 'admin' && (item.title === 'Store' || item.title === 'Staff')) {
      return false;
    }
    return true;
  });

  return (
    <div className="px-4 py-6">
      <Heading title="Settings" description="Manage your profile and account settings" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="w-full max-w-xl lg:w-48">
          <nav className="flex flex-col space-y-1 space-x-0">
            {filteredNavItems.map((item, index) => (
              <Button
                key={`${item.href}-${index}`}
                size="sm"
                variant="ghost"
                asChild
                className={cn('w-full justify-start', {
                  'bg-muted': currentPath === item.href,
                })}
              >
                <Link href={item.href} prefetch>
                  {item.title}
                </Link>
              </Button>
            ))}
          </nav>
        </aside>

        <Separator className="my-6 md:hidden" />
        <div className="flex-1 ">
          <section className="space-y-12">{children}</section>
        </div>
      </div>
    </div>
  );
}
