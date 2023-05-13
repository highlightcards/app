import { Avatar, Box, Flex, Group, SimpleGrid, Title } from "@mantine/core";
import HighlightCard from "@/components/InsightCard";
import highlights from "@/highlights";
import { AddressProvider } from "@/providers/AddressProvider";
import dynamic from "next/dynamic";

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
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
        {highlights.map((highlight) => (
          <HighlightCard
            key={highlight.id}
            highlightId={highlight.id}
            chainId={1}
            walletAddress="0xBA78CD28F7132958235D278fF3C5DC5E6d34cc15"
          />
        ))}
      </SimpleGrid>
    </AddressProvider>
  );
};

export default InsightsPage;
