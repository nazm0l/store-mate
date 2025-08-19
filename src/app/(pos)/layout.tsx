import Header from "@/components/header";
import type { Metadata } from "next";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { isLoggedIn } from "@/services/auth.service";

export const metadata: Metadata = {
  title: "Store Mate",
  description: "A simple store management app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // const userLoggedIn = isLoggedIn();

  // useEffect(() => {
  //   if (!userLoggedIn) {
  //     router.push("/login");
  //   }
  // }, [userLoggedIn, router]);

  return (
    <section>
      <>
        {/* Pos navbar*/}
        {/* <div className="flex justify-between bg-gray-800 p-4 text-white">
          <div>Store Mate</div>
          <div>POS</div>
        </div> */}
        <Header />
        {children}
      </>
    </section>
  );
}
