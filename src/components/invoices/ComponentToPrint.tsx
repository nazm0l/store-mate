"use client";
import React, { forwardRef, Ref } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ComponentToPrint = forwardRef((props: any, ref: Ref<HTMLDivElement>) => {
  const { data } = props;

  console.log("data", data);

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  return (
    <div ref={ref}>
      <div className="grid place-items-center w-[800px] mx-auto">
        <div className="flex justify-between container mt-10">
          <h1 className="text-2xl font-bold mb-5">Store Mate</h1>
          <h1 className="text-5xl font-bold mb-5">Invoice</h1>
        </div>
        <div className="flex justify-between container mb-5">
          <div>
            <p className="font-bold">Md Najmul Hossen</p>
            <p>Road No. #5, Mirpur</p>
            <p>Dhaka, Bangladesh</p>
          </div>
          <div>
            <p>Invoice No: 12345</p>
            <p>Date: {date}</p>
            <p>Time: {time}</p>
          </div>
        </div>

        <Separator className="w-full mb-10" />

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">No.</TableHead>
              <TableHead className="w-[300px]">Item Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell className="text-right">
                  {item.quantity * item.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="h-2">
              <TableCell colSpan={4}>Total</TableCell>
              <TableCell className="text-right">38000</TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        <Separator className="w-full mt-10" />

        <div className="flex justify-between container mt-5">
          <div>
            <p>Thank you for shopping with us.</p>
          </div>
          <div>
            <p>Store Mate</p>
          </div>
        </div>
      </div>
    </div>
  );
});

ComponentToPrint.displayName = "ComponentToPrint";

export default ComponentToPrint;
