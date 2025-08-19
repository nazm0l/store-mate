"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "./ui/textarea";
import { useEffect } from "react";

// const formSchema = z.object({
//   receivedAmount: z.string(),
//   payingAmount: z.string().optional(),
//   paymentMethod: z.string(),
//   paymentNote: z.string(),
//   saleNote: z.string(),
// });

export function PosOrderDialog({
  children,
  orderedProducts,
  paidBy,
  formSchema,
  form,
}: {
  children: React.ReactNode;
  orderedProducts: any[];
  paidBy: string;
  formSchema: z.ZodObject<any>;
  form: any;
}) {
  const total = orderedProducts
    ?.map((product) => product.productPrice * product.quantity)
    .reduce((a, b) => a + b, 0);

  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   mode: "onBlur",
  //   defaultValues: {
  //     receivedAmount: total.toString(),
  //     payingAmount: total.toString(),
  //     paymentMethod: "cash",
  //     paymentNote: "",
  //     saleNote: "",
  //   },
  // });

  const change = form.watch("receivedAmount")
    ? parseInt(form.watch("receivedAmount")) - total
    : 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] md:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Finalize Sale</DialogTitle>
            <DialogDescription>
              Please fill out the form to finalize the sale.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="receivedAmount"
                      defaultValue={total}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Amount *</FormLabel>
                          <FormControl>
                            <Input placeholder={total.toString()} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1 ">
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Paying Amount
                    </p>
                    <div className="border p-[7px] mt-3 rounded-lg">
                      <p>{total}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Change
                    </p>
                    <div className="border p-[7px] mt-3 rounded-lg">
                      <p>{change}</p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paid By</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={paidBy}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={paidBy} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={paidBy}>{paidBy}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="paymentNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Note</FormLabel>
                        <Textarea {...field} />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="saleNote"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sale Note</FormLabel>
                        <Textarea {...field} />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
