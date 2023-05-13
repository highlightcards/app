import { AppProps } from "next/app";
import Head from "next/head";
import { Container, MantineProvider } from "@mantine/core";
import { SWRConfig } from "swr";
import Navigation from "@/components/Navigation";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import "@/styles/global.css";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Highlight</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <DynamicContextProvider
        settings={{
          environmentId: process.env
            .NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID as string,
          initialAuthenticationMode: "connect-only",
        }}
      >
        <DynamicWagmiConnector>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              colorScheme: "light",
              fontFamily: "Inter, sans-serif",
              headings: { fontFamily: "Inter, sans-serif" },
              globalStyles: (theme) => ({
                body: {
                  ...theme.fn.fontStyles(),
                  backgroundColor: "#FAFAFA",
                },
              }),
            }}
          >
            <Navigation />

            <Container size="md" mb="xl">
              <SWRConfig
                value={{
                  fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
                }}
              >
                <Component {...pageProps} />
              </SWRConfig>
            </Container>
          </MantineProvider>
        </DynamicWagmiConnector>
      </DynamicContextProvider>
    </>
  );
}
