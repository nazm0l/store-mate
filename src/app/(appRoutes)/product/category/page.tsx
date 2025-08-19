"use client";
import HeaderCategoryActionBtn from "@/components/HeaderCategoryActionBtn";
import { CategoryList, columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { removeUserInfo } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function Category() {
  const [category, setCategory] = useState<CategoryList[]>([]);
  const [parenCategory, setParentCategory] = useState<CategoryList[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  //add dummy data

  return (
    <section className="md:p-5">
      <HeaderCategoryActionBtn data={parenCategory} addCategory={addCategory} />

      {loading ? (
        <div className="h-[50vh] grid place-items-center">
          <Loading />
        </div>
      ) : (
        <section className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={category}
            searchOptions="categoryName"
            searchPlaceholder="category name"
          />
        </section>
      )}
    </section>
  );
}
