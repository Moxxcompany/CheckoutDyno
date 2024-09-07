import { useRouter } from "next/router";
import { useEffect } from "react";

const Verify = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.query && router.query.response) {
      const successRes = JSON.parse(router.query.response as string);

      console.log(successRes);
    }
  }, [router.query]);
  return <div>Verify</div>;
};

export default Verify;
