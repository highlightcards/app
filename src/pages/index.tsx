import { Paper, Text, Center, Stack, Autocomplete, Image } from "@mantine/core";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleChange = (event: any) => {
    if (event.key === "Enter") {
      router.push(`${value}`);
    }
  };

  return (
    <>
      <Head>
        <title>Highlight</title>
        <meta
          name="description"
          content="Shining light through the web3 mist"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center mih="calc(100vh - 80px)">
        <Stack justify="center" align="center" w="100%">
          <Autocomplete
            value={value}
            onChange={setValue}
            onKeyDown={handleChange}
            styles={{
              input: {
                color: "#000",
                border: "1px solid #777",

                "::placeholder": {
                  color: "#777",
                },
              },
            }}
            data={[]}
            placeholder="Ethereum address..."
            radius="xl"
            size="lg"
            maw="500px"
            w="100%"
            mb="xl"
          />

          <Paper
            withBorder
            p="lg"
            radius="md"
            maw="300px"
            w="100%"
            c="#595959"
            bg="#F5F5F5"
            mt="xl"
          >
            <Stack align="center" justify="center" spacing="xs">
              <Image src="/search-icon.svg" width={28} height={28} alt="" />
              <Text fz="sm" fw={500}>
                Discover account highlights
              </Text>
              <Text c="dimmed" fz="sm" ta="center">
                Search any Ethereum address and see insights from their on-chain
                journey
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Center>
    </>
  );
}
