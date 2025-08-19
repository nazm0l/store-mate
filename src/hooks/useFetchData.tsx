import { useState } from "react";
import { removeUserInfo } from "@/services/auth.service";
import { useRouter } from "next/navigation";

const useFetchData = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function fetchData(url: string, options: any) {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ApiKey: "c12c49a4-66b8-499f-9d30-4cfb907f7270",
        },
      });
      if (res.status === 401) {
        removeUserInfo();
        router.push("/");
      } else if (res.status === 500) {
        alert("Something went wrong");
      } else {
        const data = await res.json();
        return data;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return { fetchData, loading };
};

export default useFetchData;
