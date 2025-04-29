import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen,  CopyPlus, DollarSign, FilePlus, Folder, Gem, History, LayoutGrid, PackageCheck, Percent, ReceiptText, SquarePlus, Store, Table, Users } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'New Order',
        href: '/newbill',
        icon: FilePlus,
    },
    {
        title: 'Orders',
        href: '/orders',
        icon: PackageCheck,
    },
    {
        title: 'Dining Tables',
        href: '/dining-tables',
        icon: Table,
    },
    {
        title: 'Customers',
        href: '/customers/view',
        icon: Users,
    },
    {
        title: 'Menu Categories',
        href: '/categories',
        icon: CopyPlus,
    },
    {
        title: 'Menu Items',
        href: '/menu-items',
        icon: SquarePlus,
    },
    {
        title: 'Payments',
        href: '/payments',
        icon: DollarSign,
    },
    {
        title: 'Taxes',
        href: '/taxes',
        icon: Percent,
    },
    {
        title: 'Logs',
        href: '/logs',
        icon: History,
    },
    {
        title: 'Restaurant Settings',
        href: '/restaurant',
        icon: Store,
    },
    {
        title: 'Plans',
        href: '/plans',
        icon: Gem,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
