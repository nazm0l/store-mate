"use client";
import HeaderCategoryActionBtn from "@/components/HeaderCategoryActionBtn";
import { CategoryList, columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { useRouter } from "next/navigation";
import { HeaderAddCategoryDialog } from "@/components/HeaderAddCategoryDialog";

export const categories: CategoryList[] = [
  {
    id: "1",
    categoryName: "Smartphones",
    categoryCode: 2001,
    parentCategory: "Electronics",
    productCount: 120,
    stocks: 450,
    stockWorth: "$540,000",
  },
  {
    id: "2",
    categoryName: "Laptops",
    categoryCode: 2002,
    parentCategory: "Electronics",
    productCount: 75,
    stocks: 300,
    stockWorth: "$720,000",
  },
  {
    id: "3",
    categoryName: "Headphones",
    categoryCode: 2003,
    parentCategory: "Electronics",
    productCount: 60,
    stocks: 500,
    stockWorth: "$200,000",
  },
  {
    id: "4",
    categoryName: "Furniture",
    categoryCode: 2004,
    parentCategory: "Home & Living",
    productCount: 45,
    stocks: 150,
    stockWorth: "$180,000",
  },
  {
    id: "5",
    categoryName: "Groceries",
    categoryCode: 2005,
    parentCategory: "Daily Needs",
    productCount: 200,
    stocks: 1000,
    stockWorth: "$95,000",
  },
];

export default function Category() {
  //add dummy data

  return (
    <section className="md:p-5">
      <HeaderCategoryActionBtn
        data={categories}
        addCategory={HeaderAddCategoryDialog}
      />

      <section className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={categories}
          searchOptions="categoryName"
          searchPlaceholder="category name"
        />
      </section>
    </section>
  );
}
