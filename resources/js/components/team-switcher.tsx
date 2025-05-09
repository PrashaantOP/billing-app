"use client"

import * as React from "react"
import { AudioWaveform, Check, ChevronsUpDown, Plus } from "lucide-react"
import { router, usePage } from '@inertiajs/react'
import toast from 'react-hot-toast';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { auth } = usePage().props as any

  const teams = auth.restaurants.map((restaurant: any) => ({
    name: restaurant.name,
    logo: AudioWaveform,
    plan: restaurant.id === auth.current_restaurant_id ? 'Current' : 'Available',
    id: restaurant.id,
  }))

  const [activeTeam, setActiveTeam] = React.useState(() =>
    teams.find((team: any) => team.id === auth.current_restaurant_id) || teams[0]
  )

  if (!activeTeam) return null

  const switchRestaurant = (restaurant_id: number, restaurant_name: string) => {
  toast.promise(
    new Promise((resolve, reject) => {
      router.visit('/restaurant/switch', {
        method: 'post',
        data: { restaurant_id },
        preserveScroll: true,
        // only: ['auth'],
        onSuccess: () => resolve(`Switched to ${restaurant_name}!`),
        onError: () => reject('Failed to switch restaurant.'),
      });
    }),
    {
      loading: 'Switching...',
      success: (message) => message,
      error: (err) => err || 'Something went wrong!',
    }
  );
};

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-red-600">{activeTeam.name}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Restaurants
            </DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => {
                  setActiveTeam(team);
                  switchRestaurant(team.id, team.name);
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border ">
                  {team.id === auth.current_restaurant_id && (
                    <Check className="text-green-500 size-4" />
                  )}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add restaurant</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
