import { Avatar, Box, Flex, Group, Title } from "@mantine/core";
import { AddressProvider } from "@/providers/AddressProvider";
import dynamic from "next/dynamic";
import Highlights from "@/components/Highlights";
import Header from "@/components/Header";

const Heatmap = dynamic(() => import("../components/Heatmap"), { ssr: false });

const InsightsPage = () => {
  return (
    <AddressProvider>
      <Box pt="xl">
        <Header />
      </Box>

      <div
        style={{
          height: "250px",
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
