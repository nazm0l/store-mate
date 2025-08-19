"use client";
import HeaderCategoryActionBtn from "@/components/HeaderCategoryActionBtn";
import { columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { HeaderAddCategoryDialog } from "@/components/HeaderAddCategoryDialog";
import { categories } from "@/constants/constants";

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
