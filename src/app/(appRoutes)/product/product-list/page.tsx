"use client";

import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import HeaderActionLinkBtn from "@/components/HeaderActionLinkBtn";
import useProductList from "@/hooks/useProductList";
import Loading from "@/components/Loading";

export default function ProductList() {
  const products: TProductList[] = [
    {
      id: "1",
      image: "https://via.placeholder.com/150",
      productName: "Samsung Galaxy S24",
      code: 1001,
      brandName: "Samsung",
      categoryName: "Smartphone",
      quantity: 50,
      productUnitName: "pcs",
      productPrice: 1200,
      cost: 950,
    },
    {
      id: "2",
      image: "https://via.placeholder.com/150",
      productName: "Apple iPhone 15",
      code: 1002,
      brandName: "Apple",
      categoryName: "Smartphone",
      quantity: 30,
      productUnitName: "pcs",
      productPrice: 1400,
      cost: 1100,
    },
    {
      id: "3",
      image: "https://via.placeholder.com/150",
      productName: "Sony WH-1000XM5",
      code: 1003,
      brandName: "Sony",
      categoryName: "Headphones",
      quantity: 80,
      productUnitName: "pcs",
      productPrice: 400,
      cost: 280,
    },
    {
      id: "4",
      image: "https://via.placeholder.com/150",
      productName: "Logitech MX Master 3S",
      code: 1004,
      brandName: "Logitech",
      categoryName: "Accessories",
      quantity: 120,
      productUnitName: "pcs",
      productPrice: 120,
      cost: 80,
    },
    {
      id: "5",
      image: "https://via.placeholder.com/150",
      productName: "Dell XPS 15",
      code: 1005,
      brandName: "Dell",
      categoryName: "Laptop",
      quantity: 20,
      productUnitName: "pcs",
      productPrice: 2000,
      cost: 1600,
    },
  ];
  return (
    <section className="md:p-5">
      <HeaderActionLinkBtn path="/product/add-product" name="Add Product" />
      <section className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={products}
          searchOptions="productName"
          searchPlaceholder="product name"
        />
      </section>
    </section>
  );
}
