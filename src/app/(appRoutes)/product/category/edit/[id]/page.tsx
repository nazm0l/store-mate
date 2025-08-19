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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  categoryName: z.string().min(1, {
    message: "Category Name can't be empty.",
  }),
  categoryCode: z.string().min(5, {
    message: "Category Code must be 5 character.",
  }),
  parentCategoryId: z.string(),
  isDeleted: z.boolean(),
});

export default function EditCategory({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      categoryName: "",
      categoryCode: "",
      parentCategoryId: "",
      isDeleted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <div className="container mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Category</CardTitle>
            <CardDescription>
              The field labels marked with * are required input fields.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="">
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="categoryName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Type category name..."
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
                        name="categoryCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Type category code..."
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
                <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name="parentCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Category *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="No Parent" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pp">
                                parentCategoryName
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="image" className="">
                      Image
                    </Label>
                    <Input id="image" type="file" disabled />
                  </div>
                </div>
                <div className="grid place-items-end">
                  <Button type="submit" className="px-10">
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Form>
  );
}
