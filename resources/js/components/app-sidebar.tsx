import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { CopyPlus, FileChartColumn, FilePlus, IndianRupee, LayoutGrid, PackageCheck, RefreshCw, SquarePlus, Table, Users } from 'lucide-react';
import { TeamSwitcher } from './team-switcher';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard',       href: '/dashboard',      icon: LayoutGrid },
    { title: 'New Order',       href: '/newbill',         icon: FilePlus },
    { title: 'Running Orders',  href: '/orders/view',     icon: RefreshCw },
    { title: 'Orders',          href: '/order-history',   icon: PackageCheck },
    { title: 'Dining Tables',   href: '/dining-tables',   icon: Table },
    { title: 'Customers',       href: '/customers/view',  icon: Users },
    { title: 'Menu Categories', href: '/menu/categories', icon: CopyPlus },
    { title: 'Menu Items',      href: '/menu/items',      icon: SquarePlus },
    { title: 'Payments',        href: '/payments',        icon: IndianRupee },
    { title: 'Invoices',        href: '/invoices',        icon: FileChartColumn },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <TeamSwitcher />
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
