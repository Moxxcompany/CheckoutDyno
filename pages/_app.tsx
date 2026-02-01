import { PaymentLayout } from "@/Containers";
import store from "@/store";
import "@/styles/globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config.js';

import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { Provider } from "react-redux";

// Server-side only logging for Railway deploy logs
if (typeof window === 'undefined') {
  console.log(`[${new Date().toISOString()}] ✅ Next.js app initialized (server)`);
}

function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const [pageName, setPageName] = useState("");
  
  return (
    <Provider store={store}>
      <ThemeProvider>
        {pathname.includes("pay") ? (
          <PaymentLayout pageName={pageName}>
            <Component {...pageProps} setPageName={setPageName} />
          </PaymentLayout>
        ) : (
          <Component {...pageProps} setPageName={setPageName} />
        )}
      </ThemeProvider>
    </Provider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
