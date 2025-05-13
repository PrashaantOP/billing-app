import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link } from '@inertiajs/react';
import { Gem, LogOut, Settings, Store } from 'lucide-react';
import { router } from '@inertiajs/react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();
    const handleClick = (e: React.MouseEvent, path: string) => {
        e.preventDefault();
        cleanup();
    
        router.visit(route(path), {
            preserveScroll: true,
            preserveState: false, // forces fresh data load
        });
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                <button className="block w-full" onClick={(e) => handleClick(e, 'plans')}>
                    <Gem className="mr-2" />
                    Upgrade to Pro
                </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <button className="block w-full" onClick={(e) => handleClick(e, 'restaurants.index')}>
                    <Store className="mr-2" />
                    Restaurants
                </button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                <button className="block w-full" onClick={(e) => handleClick(e, 'profile.edit')}>
                    <Settings className="mr-2" />
                    Settings
                </button>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link className="block w-full" method="post" href={route('logout')} as="button" onClick={cleanup}>
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}
