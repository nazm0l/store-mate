"use client";
import AddSaleForm from "@/components/add-form/AddSaleForm";
import { generateRefNo } from "@/constants/constants";

export default function AddSale() {
  const refNo = generateRefNo();

  return (
    <main className="md:p-5">
      <div className="p-5 bg-slate-200 flex justify-between">
        <h2 className="text-xl ">Add Sale</h2>
        <p>
          <span className="font-semibold">Reference No:</span> {refNo}
        </p>
      </div>
      <div className="bg-white p-5">
        {/* <div className="mb-4">
          <small>
            The field labels marked with * are required input fields.
          </small>
        </div> */}
        <AddSaleForm refNo={refNo} />
      </div>
    </main>
  );
}
