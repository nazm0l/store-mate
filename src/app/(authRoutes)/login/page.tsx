"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "../../../../public/images/store-mate.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getUserInfo,
  isLoggedIn,
  storeUserInfo,
} from "@/services/auth.service";
import { Loader2 } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const username = (e.target as any).username?.value;
    const password = (e.target as any).password?.value;

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    setError("");

    try {
      //add a delay of 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (username === "admin" && password === "admin") {
        router.push("/dashboard");
      } else {
        setError("Invalid username or password");
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="w-full min-h-screen flex justify-center items-center bg-[url('/images/bg.jpeg')] bg-no-repeat bg-cover">
      <Card className="w-[350px]">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="grid place-items-center">
              <Image src={logo} alt="Store Mate" width={120} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="Username" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center">
                  <Input
                    id="password"
                    name="password"
                    placeholder="Password"
                    type={showPass ? "text" : "password"}
                  />
                  {showPass ? (
                    <Icon
                      icon="bi:eye-fill"
                      className="h-4 w-4 ml-[-30px] text-slate-500 cursor-pointer"
                      onClick={() => setShowPass(false)}
                    />
                  ) : (
                    <Icon
                      icon="bi:eye-slash-fill"
                      className="h-4 w-4 ml-[-30px] text-slate-500 cursor-pointer"
                      onClick={() => setShowPass(true)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="grid place-items-center mt-3">
              {error && (
                <p className="bg-red-500 text-sm w-fit px-2 text-center rounded-full font-xl text-white">
                  {error}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col">
            <div className="w-full flex justify-start ">
              {loading ? (
                <Button disabled>
                  <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                  Login...
                </Button>
              ) : (
                <Button type="submit" className="hover:bg-[#35c2f3]">
                  Login
                </Button>
              )}
            </div>
            <div className="mt-5">
              <div className="text-center text-sm">
                <ForgotPasswordDialog>
                  <p className="text-blue-500">Forget Password?</p>
                </ForgotPasswordDialog>
              </div>
              <p className="text-center text-sm mt-1">
                Don&apos;t have an account?{" "}
                <Link href="/business-registration" className="text-blue-500">
                  Register
                </Link>
              </p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}
