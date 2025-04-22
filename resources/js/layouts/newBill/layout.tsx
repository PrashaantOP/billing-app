import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Input } from '@headlessui/react';
// import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState, type PropsWithChildren } from 'react';



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
    const [searchTerm, setSearchTerm] = useState('');

    const currentPath = window.location.pathname;



    return (
        <div className="px-4 py-6">
            <Heading title="New Bill" description="Create new bills and print this" />

            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
            <aside className="w-full max-w-xl lg:w-48">
            {/* Search Box */}
            <div className="mb-4 px-2 flex flex-row items-center justify-start gap-1 rounded-md bg-white border border-gray-300">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[100%] px-1 py-2 text-sm text-gray-700 rounded-md focus:outline-none"
                />
            </div>

            {/* Filtered Categories */}
            <nav className="flex flex-col space-y-1 space-x-0">
                {categories
                .filter((item) =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((item) => (
                    <Button
                    key={item.id}
                    size="sm"
                    variant="ghost"
                    asChild
                    className={cn('w-full justify-start', {
                        'bg-muted': currentPath.includes(item.slug),
                    })}
                    >
                    <Link href={`/newbill/menu/${item.slug}`} prefetch>
                        {item.name}
                    </Link>
                    </Button>
                ))}
            </nav>
            </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl lg:max-w-full">
                    <section className="max-w-full space-y-12">{children}</section>
                </div>


                {/* <aside className="w-full max-w-xl lg:w-80 bg-gray-100 p-4 rounded-md shadow-sm">

            hellow
            </aside> */}
            </div>
        </div>
    );
}
