import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const paymentAuth = (WrappedComponent: any) => {
  const AuthChecker = (props: any) => {
    const router = useRouter();
    const [payment, setPayment] = useState(false);

    useEffect(() => {
      if (router.query.d) {
        setPayment(true);
      }
    }, [router.query]);
    return payment ? <WrappedComponent {...props} /> : <></>;
  };
  return AuthChecker;
};

export default paymentAuth;
