import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDotsVertical } from "@tabler/icons-react"
import { ArrowUpFromDot, Delete, Dot, Download, EllipsisVertical, ExternalLink, FileDown, Pencil, Trash } from "lucide-react"

type OrderProps = {
    order: {
        hotrestaurant_idelname: string;
        order_id: string | number;
    }
  
}


export function OrderActionDropdown({order} : OrderProps) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Edit order</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Payment status</DropdownMenuItem>
                <DropdownMenuItem>Order status</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          
          <DropdownMenuItem>Invoice
            <DropdownMenuShortcut>
                <FileDown />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive"><Trash /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}
