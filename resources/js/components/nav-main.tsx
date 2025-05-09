import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    const handleLinkClick = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        router.visit(href, {
            preserveScroll: true,
            preserveState: false, // don't cache, force reload
        });
    };


    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton  
                            asChild isActive={item.href === page.url}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} onClick={(e) => handleLinkClick(e, item.href)} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
