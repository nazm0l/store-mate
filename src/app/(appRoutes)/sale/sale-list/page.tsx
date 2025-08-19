"use client";

import { DataTable } from "@/components/DataTable";
import { SaleProductList, columns } from "./columns";
import HeaderActionLinkBtn from "@/components/HeaderActionLinkBtn";
import { useEffect, useState } from "react";
import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

export default function SaleList() {
  const [sale, setSale] = useState<SaleProductList[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function getCategory() {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/Sale/pull",
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
      if (res.status === 401) {
        removeUserInfo();
        router.push("/");
      }

      if (res.status === 400) {
        alert("Something went wrong");
      }

      const data = await res.json();
      setSale(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCategory();
  }, []);

  return (
    <section className="md:p-5">
      <HeaderActionLinkBtn path="/sale/add-sale" name="Add Sale" />

      {loading ? (
        <div className="h-[50vh] grid place-items-center">
          <Loading />
        </div>
      ) : (
        <section className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={sale}
            searchOptions="customerName"
            searchPlaceholder="customer name"
          />
        </section>
      )}
    </section>
  );
}
