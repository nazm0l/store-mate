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

export type ParentCategoryList = {
  id: string;
  name: string;
  createdOn: string;
  modifiedOn: string;
};

export const columns: ColumnDef<ParentCategoryList>[] = [
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
    header: "Parent Category Name",
  },
  {
    accessorKey: "createdOn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return new Date(row.original.createdOn).toLocaleDateString();
    },
  },
  {
    accessorKey: "modifiedOn",
    header: "Last Modified",
    cell: ({ row }) => {
      return new Date(row.original.createdOn).toLocaleDateString();
    },
  },
  {
    id: "actions",
    header: () => <div className="">Actions</div>,
    cell: ({ row }) => {
      const parentCategory = row.original;

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
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/product/parent-category/edit/${parentCategory.id}`}>
                Edit Category
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const confirm = window.confirm(
                  `You have ${0} products in ${
                    parentCategory.name
                  }, deleting this category will attribute your products to Uncategorized Category. Do you want to proceed? This process can’t be undone. Proceed with caution.`
                );
                if (confirm) {
                  console.log("Delete", parentCategory.id);
                  fetch(
                    "https://storemate-api-dev.azurewebsites.net/api/ParentCategory/push",
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
                        ...parentCategory,
                        id: parentCategory.id,
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
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
