"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { add, format, set } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Loading from "../Loading";
import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categories } from "@/app/(appRoutes)/product/category/page";

const formSchema = z.object({
  productType: z.string(),
  productName: z.string().min(1, {
    message: "Product Name can't be empty.",
  }),
  productCode: z.string(),
  barcodeSymbology: z.string(),
  brandId: z.string(),
  category: z.string(),
  productUnitId: z.string(),
  productCost: z.string().min(1, {
    message: "Product Cost cannot be empty.",
  }),
  productPrice: z.string().min(1, {
    message: "Product Price cannot be empty.",
  }),
  stockAlert: z.string().min(1, {
    message: "Alert Quantity cannot be empty.",
  }),
  promotional: z.boolean(),
  promotionalPrice: z.string().optional(),
  promotionStarts: z.date().optional(),
  promotionEnds: z.date().optional(),
  hasExpireDate: z.boolean(),
  expireDate: z.date(),
  productTax: z.string(),
  taxMethod: z.string(),
  initailStock: z.string(),
  warehouse1: z.boolean(),
  featured: z.boolean(),
  embeddedBarcode: z.boolean(),
  productImage: z.string(),
  productDescription: z.string(),
});

export default function AddProductForm({ sku }: { sku: string }) {
  const [quantity, setQuantity] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      productType: "",
      productName: "",
      productCode: sku,
      barcodeSymbology: "",
      brandId: "",
      productUnitId: "",
      category: "",
      productCost: "",
      productPrice: "",
      stockAlert: "",
      promotional: false,
      promotionalPrice: "0",
      promotionStarts: new Date(),
      promotionEnds: new Date(),
      hasExpireDate: false,
      expireDate: new Date(),
      productTax: "",
      taxMethod: "",
      warehouse1: false,
      initailStock: "",
      featured: false,
      embeddedBarcode: false,
      productImage: "",
      productDescription: "",
    },
  });

  const categoryId = form.watch("category");

  //Get brand
  const brands = [
    {
      id: "1",
      brandName: "Brand 1",
    },
    {
      id: "2",
      brandName: "Brand 2",
    },
    {
      id: "3",
      brandName: "Brand 3",
    },
  ];

  //Get product unit
  const productUnit = [
    {
      id: "1",
      name: "Unit 1",
    },
    {
      id: "2",
      name: "Unit 2",
    },
    {
      id: "3",
      name: "Unit 3",
    },
  ];

  //Get warehouse
  const warehouses = [
    {
      id: "1",
      name: "Warehouse 1",
    },
    {
      id: "2",
      name: "Warehouse 2",
    },
    {
      id: "3",
      name: "Warehouse 3",
    },
  ];

  const handleQuantity = (e: any) => {
    setQuantity((prev: any) => [
      ...prev,
      {
        id: "00000000-0000-0000-0000-000000000000",
        warehouseId: e.target.name,
        quantity: e.target.value,
        isDeleted: false,
      },
    ]);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {}

  return (
    <>
      {loading ? (
        <div className="h-[70vh] grid items-center">
          <Loading />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barcodeSymbology"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Barcode Symbology *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a barcode type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fa99">FA99</SelectItem>
                          <SelectItem value="tb11">TB11</SelectItem>
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: any) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Brand..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {brands &&
                            brands?.map((brand: any) => (
                              <SelectItem key={brand.id} value={brand.id}>
                                {brand.brandName}
                              </SelectItem>
                            ))}
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productUnitId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Unit *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Product Unit..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productUnit.map((unit: any) => (
                            <SelectItem key={unit.id} value={unit.id}>
                              {unit.baseUnit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="productCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Cost*</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Price*</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stockAlert"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Quantity</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="taxMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Tax Method..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Tax</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                {/* checkbox here  */}
                <FormField
                  control={form.control}
                  name="warehouse1"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Initial Stock</FormLabel>
                        <FormDescription>
                          This feature will not work for product with variants
                          and batches
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured</FormLabel>
                        <FormDescription>
                          Featured product will be displayed in POS
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="embeddedBarcode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Embedded Barcode</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                {form.watch().warehouse1 && (
                  <div className="pt-5 rounded-md border p-4 shadow">
                    <div>
                      {warehouses.map((warehouse: any) => (
                        <div key={warehouse.id} className="space-y-2 mb-2">
                          <FormLabel>{warehouse.name}:</FormLabel>
                          <Input
                            placeholder=""
                            name={warehouse.id}
                            value={quantity[warehouse.id]}
                            onBlur={handleQuantity}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="productImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="file" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="productDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 mt-5">
                <FormField
                  control={form.control}
                  name="promotional"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Add Promotional Price</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {form.watch().promotional && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <FormField
                    control={form.control}
                    name="promotionalPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotional Price</FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="promotionStarts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotional Start</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="promotionEnds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotional End</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="grid grid-cols-1 mt-5">
                <FormField
                  control={form.control}
                  name="hasExpireDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>This product has expired date</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              {form.watch().hasExpireDate && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                  <FormField
                    control={form.control}
                    name="expireDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expire Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
            <Button type="submit">Add Product</Button>
          </form>
        </Form>
      )}
    </>
  );
}
