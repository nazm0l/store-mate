"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import ComponentToPrint from "./ComponentToPrint";
import { generateRefNo } from "@/constants/constants";

const SaleData = [
  {
    id: 1,
    product: "Laptop",
    quantity: 2,
    price: 500,
  },
  {
    id: 2,
    product: "Mobile",
    quantity: 1,
    price: 300,
  },
];

const SaleInvoice = () => {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generateRefNo(),
  });

  return (
    <div>
      <button
        className="bg-green-700 text-white py-2 px-5 mt-5 rounded-md"
        onClick={handlePrint}
      >
        Print this out!
      </button>
      <ComponentToPrint data={SaleData} ref={componentRef} />
    </div>
  );
};

export default SaleInvoice;
