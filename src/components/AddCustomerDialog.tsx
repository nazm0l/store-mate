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

import { Input } from "@/components/ui/input";
import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name can't be empty.",
  }),
  phone: z.string().optional(),
  isDeleted: z.boolean(),
});

export function AddCustomerDialog({
  children,
  handleReFetch,
}: {
  children: React.ReactNode;
  handleReFetch: () => void;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone: "",
      isDeleted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/Customer/push",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
          },
          body: JSON.stringify(values),
        }
      );

      if (res.status === 401) {
        removeUserInfo();
        router.push("/");
      }

      if (res.status === 400) {
        alert("Something went wrong");
      }

      if (res.status === 200) {
        alert("Customer added successfully");
        handleReFetch();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[300px] md:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>
              The field labels marked with * are required input fields.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Type customer name..."
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
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Type phone number..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="submit">Add</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Form>
  );
}
