import highlights from "@/highlights";
import { SimpleGrid } from "@mantine/core";
import HighlightCard from "./InsightCard";
import { useAddress } from "@/providers/AddressProvider";

const Highlights = () => {
  const { address, chainId } = useAddress();

  return (
    <SimpleGrid cols={2} breakpoints={[{ maxWidth: "md", cols: 1 }]}>
      {highlights.map((highlight) => (
        <HighlightCard
          key={highlight.id}
          highlightId={highlight.id}
          chainId={chainId}
          walletAddress={address}
        />
      ))}
    </SimpleGrid>
  );
};

export default Highlights;
