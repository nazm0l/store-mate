"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export type CustomerList = {
  id: string;
  name: string;
  phone: number;
  createdOn: string;
};

export const columns: ColumnDef<CustomerList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Customer Name",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => {
      return new Date(row.original.createdOn).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: () => <div className="">Actions</div>,
    cell: ({ row }) => {
      const customerList = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/customers/edit/${customerList.id}`}>
                Edit Customer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const res = confirm(
                  `Are you sure to delete: ${customerList.name}`
                );
                if (res) {
                  console.log("Delete", customerList.id);
                  fetch(
                    "https://storemate-api-dev.azurewebsites.net/api/Customer/push",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                          "accessToken"
                        )}`,
                        ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
                      },
                      body: JSON.stringify({
                        ...customerList,
                        id: customerList.id,
                        isDeleted: true,
                      }),
                    }
                  ).then((res) => {
                    if (res.ok) {
                      console.log("Deleted");
                      window.location.reload();
                    }
                  });
                }
              }}
            >
              Delete Customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
