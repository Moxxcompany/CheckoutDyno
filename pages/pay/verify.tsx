import axiosBaseApi from "@/axiosConfig";
import { TOAST_SHOW } from "@/Redux/Actions/ToastAction";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const Verify = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    if (router.query && router.query.response) {
      const successRes = JSON.parse(router.query.response as string);

      console.log(successRes);
      getConfirmStatus();
    }
  }, [router.query]);

  const getConfirmStatus = async () => {
    try {
      const { response }: any = router.query;

      const { txRef } = JSON.parse(response);

      const {
        data: { data },
      } = await axiosBaseApi.post("pay/confirmPayment", {
        uniqueRef: txRef,
      });

      window.location.replace(data);
    } catch (e: any) {
      const message = e.response.data.message ?? e.message;
      dispatch({
        type: TOAST_SHOW,
        payload: {
          message: message,
          severity: "error",
        },
      });
    }
  };
  return <div>Verifying....</div>;
};

export default Verify;
