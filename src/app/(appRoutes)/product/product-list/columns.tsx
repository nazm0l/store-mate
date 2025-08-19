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
import Image from "next/image";
import Link from "next/link";

export type ProductList = {
  id: string;
  image: string;
  productName: string;
  code: number;
  brandName: string;
  categoryName: string;
  quantity: number;
  productUnitName: string;
  productPrice: number;
  cost: number;
};

export const columns: ColumnDef<ProductList>[] = [
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

  // {
  //   accessorKey: "image",
  //   header: () => <div className="">Image</div>,
  //   cell: ({ row }) => {
  //     return (
  //       <Image src={row.original.image} alt="product" width={50} height={50} />
  //     );
  //   },
  // },
  {
    accessorKey: "productName",
    header: "Name",
  },
  {
    accessorKey: "productCode",
    header: "Code",
  },
  {
    accessorKey: "brandName",
    header: "Brand",
  },
  {
    accessorKey: "categoryName",
    header: "Category",
  },
  {
    accessorKey: "initialStock",
    header: "Quantity",
  },
  {
    accessorKey: "productUnitName",
    header: "Unit",
  },
  {
    accessorKey: "productPrice",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "productCost",
    header: () => <div className="">Cost</div>,
  },
  {
    id: "actions",
    header: () => <div className="">Actions</div>,
    cell: ({ row }) => {
      const productList = row.original;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(productList.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/product/product-list/edit/${productList.id}`}>
                Edit Product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                confirm(`Are you sure to delete: ${productList.productName}`)
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
