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
import { DeleteCategoryDialog } from "@/components/category-page/DeleteCategoryDialog";
import Link from "next/link";

export type CategoryList = {
  id: string;
  categoryName: string;
  categoryCode: number;
  parentCategory: string;
  productCount: number;
  stocks: number;
  stockWorth: string;
};

export const columns: ColumnDef<CategoryList>[] = [
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
    accessorKey: "categoryName",
    header: "Category Name",
  },
  {
    accessorKey: "categoryCode",
    header: "Category Code",
  },
  {
    accessorKey: "parentCategoryName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Parent Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "productCount",
    header: "Product Count",
  },
  {
    accessorKey: "stocks",
    header: "Stocks",
  },
  {
    accessorKey: "stockWorth",
    header: "Stock Worth",
  },
  {
    id: "actions",
    header: () => <div className="">Actions</div>,
    cell: ({ row }) => {
      const category = row.original;

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

            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/product/category/edit/${category.id}`}>
                Edit Category
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                const confirm = window.confirm(
                  `You have ${category.productCount || 0} products in ${
                    category.categoryName
                  }, deleting this category will attribute your products to Uncategorized Category. Do you want to proceed? This process can’t be undone. Proceed with caution.`
                );
                if (confirm) {
                  console.log("Delete", category.id);
                  fetch(
                    "https://storemate-api-dev.azurewebsites.net/api/Category/push",
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
                        ...category,
                        id: category.id,
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
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
