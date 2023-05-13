import highlights from "@/highlights";
import { SimpleGrid, Text } from "@mantine/core";
import HighlightCard from "./InsightCard";
import { useAddress } from "@/providers/AddressProvider";

const Highlights = () => {
  const { address, chainId } = useAddress();

  return (
    <>
      <Text size={"md"} weight="500" mb="xs">
        Highlights
      </Text>
      <SimpleGrid cols={2} breakpoints={[{ maxWidth: "xs", cols: 1 }]}>
        {highlights.map((highlight) => (
          <HighlightCard
            key={highlight.id}
            highlightId={highlight.id}
            chainId={chainId}
            walletAddress={address}
            clickable
          />
        ))}
      </SimpleGrid>
    </>
  );
};

export default Highlights;
