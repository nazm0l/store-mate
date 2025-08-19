"use client";

import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/services/auth.service";

import Header from "@/components/header";
import HeaderMobile from "@/components/header-mobile";
import MarginWidthWrapper from "@/components/margin-width-wrapper";
import PageWrapper from "@/components/page-wrapper";
import SideNav from "@/components/side-nav";
import Loading from "@/components/Loading";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Store Mate",
//   description: "A simple store management app",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const userLoggedIn = isLoggedIn();

  useEffect(() => {
    if (!userLoggedIn) {
      router.push("/login");
    }
    setLoading(false);
  }, [userLoggedIn, router]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <section className={`bg-white${inter.className}`}>
      <div className="flex">
        <SideNav />
        <div className="flex-1">
          <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
          </MarginWidthWrapper>
        </div>
      </div>
    </section>
  );
}
