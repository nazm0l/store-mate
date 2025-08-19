"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import logo from "../../../../public/images/store-mate.svg";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  address: z.string(),
  userName: z.string().min(1, {
    message: "User Name is required",
  }),
  firstName: z.string(),
  surname: z.string(),
  userEmail: z.string(),
  password: z.string(),
  woo: z.enum(["yes", "no"]),
  key: z.string(),
  secret: z.string(),
  apiUrl: z.string(),
});

export default function BusinessRegistrationPage() {
  const [loading, setLoading] = useState(false);
  const [imagePath, setImagePath] = useState<any>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      userName: "",
      phone: "",
      address: "",
      firstName: "",
      surname: "",
      userEmail: "",
      password: "",
      woo: "no",
      key: "",
      secret: "",
      apiUrl: "",
    },
  });

  const wooRegister = form.watch("woo");

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.

    try {
      setLoading(true);

      toast.success("Successfully Registered");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-[url('/images/bg.jpeg')] bg-no-repeat bg-cover">
      <Form {...form}>
        <Card className="w-[350px] md:w-[600px]">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="grid place-items-center mb-2">
                <Image src={logo} alt="Store Mate" width={120} />
              </CardTitle>
              <CardDescription className="text-center">
                Provide your business information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="grid md:grid-cols-2  gap-4">
                  {/* Business Details */}
                  <div className="flex flex-col space-y-4 border p-2 shadow-sm rounded-lg">
                    <div className="flex flex-col space-y-1 text-center">
                      <h4 className="font-bold text-slate-600">
                        Business Details
                      </h4>
                      <Separator className="my-2" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Business Name</FormLabel> */}
                            <FormControl>
                              <Input placeholder="Business Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Email</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Business Email"
                                type="email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Email</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Phone Number"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Email</FormLabel> */}
                            <FormControl>
                              <Textarea
                                placeholder="Address"
                                {...field}
                                cols={6}
                                rows={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* User Details */}
                  <div className="flex flex-col space-y-4 border p-2 shadow-sm rounded-lg">
                    <div className="flex flex-col space-y-1 text-center">
                      <h4 className="font-bold text-slate-600">User Details</h4>
                      <Separator className="my-2" />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Email</FormLabel> */}
                            <FormControl>
                              <Input placeholder="User Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Password</FormLabel> */}
                            <FormControl>
                              <Input
                                placeholder="Password"
                                type="password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="userEmail"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Email</FormLabel> */}
                            <FormControl>
                              <Input placeholder="User Email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>First Name</FormLabel> */}
                            <FormControl>
                              <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="surname"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Surname</FormLabel> */}
                            <FormControl>
                              <Input placeholder="Surname" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="image">Upload Logo</Label>
                  <Input
                    className=" file:bg-black file:text-white file:rounded-md file:mr-4"
                    id="image"
                    name="image"
                    placeholder="Upload Image"
                    type="file"
                    onChange={(e) => setImagePath([e?.target?.files?.[0]])}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <FormField
                    control={form.control}
                    name="woo"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          Do you want to sign up for wooCommerce?
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {wooRegister === "yes" ? (
                  <>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Surname</FormLabel> */}
                            <FormControl>
                              <Input placeholder="Key" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="secret"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Surname</FormLabel> */}
                            <FormControl>
                              <Input placeholder="Secret" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <FormField
                        control={form.control}
                        name="apiUrl"
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Surname</FormLabel> */}
                            <FormControl>
                              <Input placeholder="Api Url" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <div className="w-full flex justify-start ">
                {loading ? (
                  <Button disabled>
                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                    Registering...
                  </Button>
                ) : (
                  <Button type="submit" className="hover:bg-[#35c2f3]">
                    Register
                  </Button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>
      </Form>
    </main>
  );
}
