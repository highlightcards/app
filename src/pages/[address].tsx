import { Avatar, Box, Flex, Group, Title } from "@mantine/core";
import { AddressProvider } from "@/providers/AddressProvider";
import dynamic from "next/dynamic";
import Highlights from "@/components/Highlights";

const Heatmap = dynamic(() => import("../components/Heatmap"), { ssr: false });

const InsightsPage = () => {
  return (
    <AddressProvider>
      <Group position="apart" mt="xl">
        <Box>
          <Flex gap="md" justify="center" align="center">
            <Avatar radius="50%" size="xl" />
            <Title order={1}>vitalik.eth</Title>
          </Flex>
        </Box>
      </Group>

      <div
        style={{
          height: "600px",
          width: "auto",
        }}
      >
        <Heatmap />
      </div>
      
      <Highlights />
    </AddressProvider>
  );
};

export default InsightsPage;
