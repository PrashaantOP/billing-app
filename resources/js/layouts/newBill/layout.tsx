import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
// import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

// const sidebarNavItems: NavItem[] = [
//     {
//         title: 'All Categories',
//         href: '/newbill/create-new-bill',
//         icon: null,
//     },
//     {
//         title: 'Cat 2',
//         href: '/settings/store',
//         icon: null,
//     },
//     {
//         title: 'Cat 3',
//         href: '/settings/password',
//         icon: null,
//     },
//     {
//         title: 'Cat 4',
//         href: '/settings/appearance',
//         icon: null,
//     },
// ];

interface NewBillLayoutProps extends PropsWithChildren {
    categories: {
        id: number;
        name: string;
        slug: string;
    }[];
}

export default function NewBillLayout({ children, categories }: NewBillLayoutProps) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="px-4 py-6">
            <Heading title="New Bill" description="Create new bills and print this" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
            <aside className="w-full max-w-xl lg:w-48">
                    <nav className="flex flex-col space-y-1 space-x-0">
                    {categories.map((item) => (
                            <Button
                                key={item.id}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath.includes(item.slug),
                                })}
                            >
                                <Link href={`/newbill/category/${item.slug}`} prefetch>
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
