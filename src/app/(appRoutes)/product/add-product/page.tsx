"use client";
import AddProductForm from "@/components/add-form/AddProductForm";
import { generateSKU } from "@/constants/constants";

export default function AddProduct() {
  const sku = generateSKU();

  return (
    <main className="md:p-5">
      <div className="p-5 bg-slate-200 flex justify-between">
        <h2 className="text-xl ">Add Product</h2>
        <p>
          <span className="font-semibold">SKU Code:</span> {sku}
        </p>
      </div>
      <div className="bg-white p-5">
        <div className="mb-4">
          <small>
            The field labels marked with * are required input fields.
          </small>
        </div>
        <AddProductForm sku={sku} />
      </div>
    </main>
  );
}
