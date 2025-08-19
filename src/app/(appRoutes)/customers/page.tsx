"use client";

import { DataTable } from "@/components/DataTable";
import { CustomerList, columns } from "./columns";
import HeaderActionLinkBtn from "@/components/HeaderActionLinkBtn";
import Loading from "@/components/Loading";
import useFetchData from "@/hooks/useFetchData";
import { useEffect, useState } from "react";

export default function Customers() {
  const [customer, setCustomer] = useState<CustomerList[]>([]);
  const { loading, fetchData } = useFetchData();

  async function getCustomer() {
    const data = await fetchData(
      "https://storemate-api-dev.azurewebsites.net/api/Customer/pull",
      {
        method: "POST",
        body: JSON.stringify({ skip: 0, take: 20 }),
      }
    );
    if (data) setCustomer(data);
  }

  useEffect(() => {
    getCustomer();
  }, []);

  return (
    <section className="md:p-5">
      <HeaderActionLinkBtn path="/product/add-product" name="Add Customer" />
      {loading ? (
        <div className="h-[50vh] grid place-items-center">
          <Loading />
        </div>
      ) : (
        <section className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={customer}
            searchOptions="phone"
            searchPlaceholder="phone number"
          />
        </section>
      )}
    </section>
  );
}
