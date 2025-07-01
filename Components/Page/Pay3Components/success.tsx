import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Success = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.query && router.query.response) {
      const successRes = JSON.parse(router.query.response as string);
      if (successRes.redirect) {
        const url: any = localStorage.getItem("redirect_uri");
        console.log(url);
        if (url) {
          localStorage.removeItem("redirect_uri");
          window.location.replace(url);
        }
      }
      console.log(router.query.response);
    }
  }, [router.query]);
  return <div>Success</div>;
};

export default Success;
