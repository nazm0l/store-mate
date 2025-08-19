import { TProductList } from "@/app/(appRoutes)/product/product-list/columns";
import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useProductList = () => {
  const [products, setProducts] = useState<TProductList[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function getProducts() {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(
        "https://storemate-api-dev.azurewebsites.net/api/Product/pull",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
          },
          body: JSON.stringify({
            skip: 0,
            take: 200,
          }),
        }
      );

      if (res.status === 401) {
        removeUserInfo();
        router.push("/");
      }

      if (res.status === 400) {
        alert("Something went wrong");
      }

      const data = await res.json();

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  return { products, loading };
};

export default useProductList;
