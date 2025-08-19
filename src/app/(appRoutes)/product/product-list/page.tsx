"use client";

import { DataTable } from "@/components/DataTable";
import { ProductList, columns } from "./columns";
import HeaderActionLinkBtn from "@/components/HeaderActionLinkBtn";
import useProductList from "@/hooks/useProductList";
import Loading from "@/components/Loading";

export default function ProductList() {
  const { products, loading } = useProductList();

  return (
    <section className="md:p-5">
      <HeaderActionLinkBtn path="/product/add-product" name="Add Product" />
      {loading ? (
        <div className="h-[50vh] grid place-items-center">
          <Loading />
        </div>
      ) : (
        <section className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={products}
            searchOptions="productName"
            searchPlaceholder="product name"
          />
        </section>
      )}
    </section>
  );
}
