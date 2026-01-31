import { PaymentLayout } from "@/Containers";
import store from "@/store";
import "@/styles/globals.css";
import { theme } from "@/styles/theme";
import { ThemeProvider } from "@mui/material";

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { Provider } from "react-redux";

// Server-side only logging for Railway deploy logs
if (typeof window === 'undefined') {
  console.log(`[${new Date().toISOString()}] ✅ Next.js app initialized (server)`);
}

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [pageName, setPageName] = useState("");
  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          {pathname.includes("pay") ? (
            <PaymentLayout pageName={pageName}>
              <Component {...pageProps} setPageName={setPageName} />
            </PaymentLayout>
          ) : (
            <Component {...pageProps} setPageName={setPageName} />
          )}
        </ThemeProvider>
      </Provider>
    </>
  );
}
