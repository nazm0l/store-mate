/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useRef, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { AddSaleProductTable } from "@/components/AddSaleProductTable";
import { useRouter } from "next/navigation";
import { generateRefNo } from "@/constants/constants";
import Loading from "../Loading";
import useFetchData from "@/hooks/useFetchData";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import ComponentToPrint from "../invoices/ComponentToPrint";
import { AddCustomerDialog } from "../AddCustomerDialog";

const formSchema = z.object({
  saleDate: z.date().optional(),
  customerId: z.string(),
  wareHouseId: z.string(),
  billerId: z.string(),
  totalPrice: z.coerce.number(),
  taxMethod: z.string(),
  tax: z.coerce.number(),
  discountMethod: z.string(),
  discount: z.coerce.number(),
  shippingCost: z.string(),
  saleStatus: z.string(),
  paymentStatus: z.string(),
  paidBy: z.string(),
  receivedAmount: z.coerce.number(),
  payingAmount: z.coerce.number(),
  saleNote: z.string().optional(),
  staffNote: z.string().optional(),
  isDeleted: z.boolean(),
});

export default function AddSaleForm({ refNo }: { refNo: string }) {
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [addedProduct, setAddedProduct] = useState<any>([]);
  const [customer, setCustomer] = useState<any>([]);
  const [biller, setBiller] = useState<any>([]);
  const [warehouses, setWarehouses] = useState([]);
  const [deliveryCost, setDeliveryCost] = useState([]);
  const [totalPrice, setTotalPrice] = useState({
    totalPrice: 0,
    totalTax: 0,
    totalDiscount: 0,
  });
  // const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { loading, fetchData } = useFetchData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      saleDate: new Date(),
      customerId: "",
      wareHouseId: "",
      billerId: "",
      totalPrice: 0,
      taxMethod: "",
      tax: 0,
      discountMethod: "",
      discount: 0,
      shippingCost: "",
      saleStatus: "",
      paymentStatus: "",
      paidBy: "",
      receivedAmount: 0,
      payingAmount: 0,
      saleNote: "",
      staffNote: "",
      isDeleted: false,
    },
  });

  const partial = form.watch("paymentStatus") === "partial";
  const paid = form.watch("paymentStatus") === "paid";

  //Calculation

  //Add selected product to the list

  useEffect(() => {
    const filtered = products.filter(
      (product: any) =>
        product?.productName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        product?.productCode.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredProducts(filtered);

    if (searchValue) {
      setOpenSearch(true);
    } else {
      setOpenSearch(false);
    }
  }, [searchValue, products]);

  const handleProductChange = (recProduct: any) => {
    const existingProduct = addedProduct.find(
      (product: any) => product.id === recProduct.id
    );

    if (existingProduct) {
      // If the product already exists, update its quantity
      const updatedProduct = {
        ...existingProduct,
        quantity: existingProduct.quantity + 1, // Increase quantity by 1
      };

      const updatedProducts = addedProduct.map((product: any) =>
        product.id === recProduct.id ? updatedProduct : product
      );

      setAddedProduct(updatedProducts);
    } else {
      // If the product does not exist, add it with quantity 1
      const product = products.find(
        (product: any) => product.id === recProduct.id
      );

      if (product) {
        setAddedProduct((prev: any) => [
          ...prev,
          { ...(product as object), quantity: 1 },
        ]);
      }
    }
    setFilteredProducts([]);
    setSearchValue("");
  };

  //Handle Product Quantity and Remove

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddedProduct = addedProduct.map((product: any) => {
      if (product.id === e.target.name) {
        return {
          ...product,
          quantity: e.target.value,
        };
      }
      return product;
    });

    setAddedProduct(newAddedProduct);
  };

  const handleRemove = (id: string) => {
    const removedProduct = addedProduct?.filter(
      (product: any) => product.id !== id
    );

    setAddedProduct(removedProduct);
  };

  //Calculation of total price, tax and discount

  const receivedAmount = form.watch("receivedAmount");
  const payingAmount = form.watch("payingAmount");

  useEffect(() => {
    const total: number = addedProduct
      ?.map(
        (product: any) =>
          (product.productPrice + product.productTax) * product.quantity
      )
      .reduce((a: number, b: number) => a + b, 0);

    const totalTax: number = addedProduct
      ?.map((product: any) => product.productTax * product.quantity)
      .reduce((a: number, b: number) => a + b, 0);

    const totalDiscount: number = addedProduct
      ?.map((product: any) => product.productDiscount * product.quantity)
      .reduce((a: number, b: number) => a + b, 0);

    console.log(total);
    console.log(addedProduct);

    setTotalPrice({ totalPrice: total, totalTax, totalDiscount });
  }, [addedProduct]);

  //Get product

  async function getProducts() {
    const data = await fetchData(
      "https://storemate-api-dev.azurewebsites.net/api/Product/pull",
      {
        method: "POST",
        body: JSON.stringify({ skip: 0, take: 20 }),
      }
    );
    if (data) setProducts(data);
  }

  //Get warehouse

  async function getWarehouse() {
    const data = await fetchData(
      "https://storemate-api-dev.azurewebsites.net/api/WareHouse/pull",
      {
        method: "POST",
        body: JSON.stringify({ skip: 0, take: 20 }),
      }
    );
    if (data) setWarehouses(data);
  }

  //Get Biller
  async function getBiller() {
    setBiller([{ id: "d198fc7c-161e-4991-af88-50ab3dbb8fcd", name: "Rohim" }]);
  }

  //Get Customer

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

  //Get Delivery Cost
  async function getDeliveryCost() {
    const data = await fetchData(
      "https://storemate-api-dev.azurewebsites.net/api/DeliveryZone/pull",
      {
        method: "POST",
        body: JSON.stringify({ skip: 0, take: 20 }),
      }
    );
    if (data) setDeliveryCost(data);
  }

  useEffect(() => {
    getCustomer();
    getWarehouse();
    getBiller();
    getProducts();
    getDeliveryCost();
  }, []);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: generateRefNo(),
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("inside submit");
    console.log({
      ...values,
      referenceNumber: refNo,
      totalPrice: totalPrice.totalPrice,
      shippingCost: Number(values.shippingCost),
      tax: Number(values.tax),
      discount: Number(values.discount),
      cupon: "",
      description: "",
    });

    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/Sale/push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
          },
          body: JSON.stringify({
            ...values,
            referenceNumber: refNo,
            totalPrice: totalPrice.totalPrice,
            shippingCost: Number(values.shippingCost),
            tax: Number(values.tax),
            discount: Number(values.discount),
            cupon: "",
            description: "",
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      //Add product to sold product

      const saleId = data?.model?.id;
      if (data?.isSuccessful === true) {
        const productData = addedProduct.map((product: any) => {
          return {
            saleId: saleId,
            productId: product?.id,
            quantity: Number(product?.quantity),
            productUnitPrice: product?.productPrice,
            productTax: data?.model?.tax,
            taxMethod: values.taxMethod,
            productDiscount: data?.model?.discount,
            discountMethod: values.discountMethod,
            totalPrice:
              product.quantity * (product.productPrice + product.productTax),
            isDeleted: false,
          };
        });

        const productRes = await fetch(
          "https://storemate-api-dev.azurewebsites.net/api/SoldProduct/push",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
            },
            body: JSON.stringify(productData),
          }
        );

        if (productRes.status === 200) {
          toast.success("Sale added successfully");
          form.reset();
          //Create Invoice
          handlePrint();
          <ComponentToPrint data={productData} ref={componentRef} />;
        } else {
          toast.error("Something went wrong");
        }
      }

      if (data?.isSuccessful === false) {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <FormField
                  control={form.control}
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date *</FormLabel>
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
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center items-center">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Customer..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customer.map((customer: any) => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} - {customer.phone}
                              </SelectItem>
                            ))}
                            <SelectItem value="na">N/A</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <AddCustomerDialog handleReFetch={getCustomer}>
                    <Button variant="outline" className="mt-8">
                      +
                    </Button>
                  </AddCustomerDialog>
                </div>

                <FormField
                  control={form.control}
                  name="wareHouseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Warehouse *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a warehouse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {warehouses.map((warehouse: any) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
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
                  name="billerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biller *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Biller..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {biller.map((biller: any) => (
                            <SelectItem key={biller.id} value={biller.id}>
                              {biller.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="na">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-5">
                <div className="relative">
                  <FormLabel>Select Product *</FormLabel>
                  <Input
                    placeholder="Please type product code and select"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {/* Render filtered products */}
                  {filteredProducts.length > 0 && (
                    <ul
                      className={
                        openSearch
                          ? "absolute bg-blue-500 h-fit w-full z-10 p-5 rounded-b"
                          : "hidden"
                      }
                    >
                      {filteredProducts.map((product: any) => (
                        <li
                          key={product.id}
                          className="text-white cursor-pointer hover:text-slate-200"
                          onClick={() => handleProductChange(product)}
                        >
                          {product.productCode} - {product.productName} -{" "}
                          {product.productPrice} tk
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Order Table Start Here */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3 mt-5">
                Order Table *
                <AddSaleProductTable
                  addedProducts={addedProduct}
                  handleQuantityChange={handleQuantityChange}
                  handleRemove={handleRemove}
                  totalPrice={totalPrice}
                />
              </div>
              {/* Order Table End Here */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="taxMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Tax *</FormLabel>
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
                          <SelectItem value="n/a">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Value</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Discount Type..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="n/a">N/A</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Value</FormLabel>
                      <FormControl>
                        <Input placeholder="" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="shippingCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Cost</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a delivery area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {deliveryCost.map((delivery: any) => (
                            <SelectItem
                              key={delivery.id}
                              value={delivery.deliveryCost.toString()}
                            >
                              {delivery.name} - {delivery.deliveryCost} tk
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
                  name="saleStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Status..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Status..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="due">Due</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {partial && (
                <>
                  {" "}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                    <FormField
                      control={form.control}
                      name="paidBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Payment Method..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="receivedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payingAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Paying Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                    <p
                      className={
                        receivedAmount > payingAmount
                          ? "font-bold text-green-600"
                          : "font-bold text-red-600"
                      }
                    >
                      Change: {receivedAmount - payingAmount}
                    </p>
                  </div>
                </>
              )}
              {paid && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
                    <FormField
                      control={form.control}
                      name="paidBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Payment Method..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="receivedAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Received Amount</FormLabel>
                          <FormControl>
                            <Input placeholder="" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel>Paying Amount</FormLabel>
                      <FormControl>
                        <Input value={totalPrice.totalPrice} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                    <p
                      className={
                        receivedAmount > totalPrice.totalPrice
                          ? "font-bold text-green-600"
                          : "font-bold text-red-600"
                      }
                    >
                      Change: {receivedAmount - totalPrice.totalPrice}
                    </p>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                <FormField
                  control={form.control}
                  name="saleNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sale Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="staffNote"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Staff Note</FormLabel>
                      <FormControl>
                        <Textarea placeholder="" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" disabled={addedProduct.length === 0}>
              Submit
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
