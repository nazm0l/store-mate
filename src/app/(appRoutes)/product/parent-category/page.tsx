"use client";
import HeaderActionBtn from "@/components/HeaderCategoryActionBtn";
import { ParentCategoryList, columns } from "./columns";
import { DataTable } from "@/components/DataTable";
import { removeUserInfo } from "@/services/auth.service";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { toast } from "sonner";

export default function ParentCategory() {
  const [parenCategory, setParentCategory] = useState<ParentCategoryList[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function getParentCategory() {
    setLoading(true);
    try {
      const accessToken = localStorage?.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/ParentCategory/pull",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
          },
          body: JSON.stringify({
            skip: 0,
            take: 20,
          }),
        }
      );

      if (!res.ok) {
        toast.error("Something went wrong");
      }

      const data = await res.json();

      setParentCategory(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  // table columns view details and edit category

  async function addParentCategory(values: any) {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/ParentCategory/push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
          },
          body: JSON.stringify(values),
        }
      );

      if (res.status === 401) {
        removeUserInfo();
        router.push("/");
      }

      const data = await res.json();

      console.log(data);

      if (data?.isSuccessful === false) {
        toast.error(data?.message);
      }

      if (data?.isSuccessful === true) {
        toast.success("Parent Category added successfully");
      }
      getParentCategory();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getParentCategory();
  }, []);

  return (
    <section className="md:p-5">
      <HeaderActionBtn data={parenCategory} addCategory={addParentCategory} />

      {loading ? (
        <div className="h-[50vh] grid place-items-center">
          <Loading />
        </div>
      ) : (
        <section className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={parenCategory}
            searchOptions="name"
            searchPlaceholder="parent category name"
          />
        </section>
      )}
    </section>
  );
}
