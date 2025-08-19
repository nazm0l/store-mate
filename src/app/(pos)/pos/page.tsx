"use client";
import { useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { OrderedDataTable } from "@/components/OrderedDataTable";
import useProductList from "@/hooks/useProductList";
import useFetchData from "@/hooks/useFetchData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Banknote,
  CalendarIcon,
  Clock9,
  CreditCard,
  X,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Image from "next/image";
import noImage from "../../../../public/images/no-img.jpg";
import { PosOrderDialog } from "@/components/PosOrderDialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";
import { generateRefNo } from "@/constants/constants";

const formSchema = z.object({
  saleDate: z.date(),
  referenceNumber: z.string().optional(),
  customerId: z.string(),
  wareHouseId: z.string(),
  billerId: z.string(),
  product: z.string(),
  totalPrice: z.coerce.number(),
  taxMethod: z.string(),
  tax: z.coerce.number(),
  discountMethod: z.string(),
  discount: z.coerce.number(),
  shippingCost: z.string(),
  paymentStatus: z.string(),
  paidBy: z.string(),
  receivedAmount: z.coerce.number(),
  payingAmount: z.coerce.number(),
  saleNote: z.string().optional(),
  staffNote: z.string().optional(),
});

const POS = () => {
  const [allProducts, setAllProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<any>("");
  const [orderedProducts, setOrderedProducts] = useState<any>([]);
  const [warehouses, setWarehouses] = useState<any>([]);
  const [biller, setBiller] = useState<any>([]);
  const [customer, setCustomer] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const refNo = generateRefNo();
  const { products } = useProductList();
  const { fetchData, loading } = useFetchData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      saleDate: new Date(),
      referenceNumber: refNo,
      customerId: "",
      wareHouseId: "",
      billerId: "",
      product: "",
      totalPrice: 0,
      taxMethod: "",
      tax: 0,
      discountMethod: "",
      discount: 0,
      shippingCost: "",
      paymentStatus: "",
      paidBy: "",
      receivedAmount: 0,
      payingAmount: 0,
      saleNote: "",
      staffNote: "",
    },
  });

  const handleReFetch = () => {
    getCustomer();
  };

  useEffect(() => {
    setAllProducts(products);
  }, [products]);

  useEffect(() => {
    setFilteredProducts(
      allProducts.filter((product: any) =>
        product.productName.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
  }, [searchValue, allProducts]);

  const handleOrder = (productId: any) => {
    const product = orderedProducts.find((p: any) => p.id === productId);
    if (product) {
      const newOrderedProducts = orderedProducts.map((p: any) => {
        if (p.id === productId) {
          return {
            ...p,
            quantity: p.quantity + 1,
          };
        }
        return p;
      });
      setOrderedProducts(newOrderedProducts);
    } else {
      const product = products.find((p) => p.id === productId);
      setOrderedProducts([...orderedProducts, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantity = (productId: any, type?: string) => {
    const newOrderedProducts = orderedProducts.map((p: any) => {
      if (p.id === productId) {
        if (type === "add") {
          return {
            ...p,
            quantity: p.quantity + 1,
          };
        } else {
          if (p.quantity > 1) {
            return {
              ...p,
              quantity: p.quantity - 1,
            };
          }
        }
      }
      return p;
    });
    setOrderedProducts(newOrderedProducts);
  };

  const handleRemove = (productId: any) => {
    const newOrderedProducts = orderedProducts.filter(
      (p: any) => p.id !== productId
    );
    setOrderedProducts(newOrderedProducts);
  };

  const calculateSubTotalById = (id: any) => {
    const product = orderedProducts.find((p: any) => p.id === id);
    return product.productPrice * product.quantity;
  };

  //calculate all ordered products price
  const calculateTotal = () => {
    const total = orderedProducts.reduce(
      (acc: any, item: any) => acc + item.productPrice * item.quantity,
      0
    );
    return total;
  };

  const handleCategory = () => {
    alert("Category");
  };

  //Get Warehouses
  async function getWarehouse() {
    const data = await fetchData(
      "https://storemate-api-dev.azurewebsites.net/api/WareHouse/pull",
      {
        method: "POST",
        body: JSON.stringify({ skip: 0, take: 40 }),
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

  useEffect(() => {
    getWarehouse();
    getBiller();
    getCustomer();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 max-h-screen">
        <div>
          <Card>
            <CardHeader>
              <div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="">
                        <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                          <div className="col-span-1">
                            <FormField
                              control={form.control}
                              name="saleDate"
                              render={({ field }) => (
                                <FormItem>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full text-left font-normal",
                                            !field.value &&
                                              "text-muted-foreground"
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
                                    <PopoverContent
                                      className="w-auto p-0"
                                      align="start"
                                    >
                                      <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                          date > new Date() ||
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
                          <div className="col-span-1">
                            <FormField
                              control={form.control}
                              name="referenceNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Reference number"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="col-span-2">
                            <FormField
                              control={form.control}
                              name="wareHouseId"
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select warehouse" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {warehouses.map((warehouse: any) => (
                                        <SelectItem
                                          key={warehouse.id}
                                          value={warehouse.id}
                                        >
                                          {warehouse.name}
                                        </SelectItem>
                                      ))}
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
                            name="billerId"
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Biller" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {biller.map((biller: any) => (
                                      <SelectItem
                                        key={biller.id}
                                        value={biller.id}
                                      >
                                        {biller.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <div className="flex">
                            <div className="w-full">
                              <FormField
                                control={form.control}
                                name="customerId"
                                render={({ field }) => (
                                  <FormItem>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Customer" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {customer.map((customer: any) => (
                                          <SelectItem
                                            key={customer.id}
                                            value={customer.id}
                                          >
                                            {customer.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <AddCustomerDialog handleReFetch={handleReFetch}>
                              <Button>+</Button>
                            </AddCustomerDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
                {/* <div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {value
                          ? products.find((product) => product.id === value)
                              ?.productName
                          : "Select product..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className="max-w-[100%] md:w-[580px] w-[300px]">
                        <CommandInput
                          placeholder="Search product..."
                          className="h-9"
                        />
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              key={product.id}
                              value={product.id}
                              onSelect={(currentValue: any) => {
                                setValue(
                                  currentValue === value ? "" : currentValue
                                );
                                setOpen(false);
                              }}
                              className=""
                            >
                              {product.productName}
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  value === product.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div> */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ScrollArea className="h-full w-full rounded-md border p-4">
                  <OrderedDataTable
                    orderedProducts={orderedProducts}
                    handleRemove={handleRemove}
                    handleQuantity={handleQuantity}
                    calculateSubTotalById={calculateSubTotalById}
                  />
                </ScrollArea>
              </div>
              <div>
                <div className="text-center py-2 bg-purple-200">
                  <h2 className="font-bold text-2xl">
                    Grand Total: {calculateTotal()}
                  </h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <Button onClick={handleCategory}>Category</Button>
                <Button className="bg-green-600">Brand</Button>
                <Button className="bg-red-600">Featured</Button>
              </div>
              <div>
                <Input
                  placeholder="Search product..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400]">
                <ScrollArea className="h-full w-full">
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredProducts.map((product: any) => (
                      <div
                        key={product?.id}
                        onClick={() => handleOrder(product?.id)}
                        className="cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                      >
                        <Card>
                          <CardContent className="p-0">
                            <div className="mb-2">
                              <Image
                                src={noImage}
                                alt={product?.productName}
                                className="w-full object-cover"
                                width={100}
                                height={100}
                              />
                            </div>
                            <div className="text-center">
                              <h2>{product?.productName}</h2>
                              <p>{product?.productPrice}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="fixed bottom-0 w-full h-16 px-10 py-2">
        <div className="flex justify-start gap-20">
          <PosOrderDialog
            orderedProducts={orderedProducts}
            paidBy="Card"
            formSchema={formSchema}
            form={form}
          >
            <Button className="px-10 bg-blue-500">
              <CreditCard className="mr-2" />
              Card
            </Button>
          </PosOrderDialog>
          <Button className="px-10 bg-green-500">
            <Banknote className="mr-2" />
            Cash
          </Button>
          <Button
            className="px-10 bg-red-500"
            onClick={() => setOrderedProducts([])}
          >
            <X className="mr-2" />
            Cancel
          </Button>
          <Button className="px-10 bg-yellow-500">
            <Clock9 className="mr-2" />
            Recent Transaction
          </Button>
        </div>
      </div>
    </section>
  );
};

export default POS;
