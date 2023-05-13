import useSWR from "swr";
import { Card, Text, Flex, ColorSwatch, Box, Image } from "@mantine/core";

interface HighlightCardProps {
  highlightId: string;
  walletAddress: string;
  chainId: number;
}

function wrapStarredWords(input: string, color: string) {
  const parts = input.split("*");

  const output = parts.map((part, i) => {
    if (i % 2 === 1) {
      return (
        <span key={i} style={{ color }}>
          {part}
        </span>
      );
    }
    return part;
  });

  return output;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  highlightId,
  walletAddress,
  chainId,
}) => {
  const { data, error } = useSWR(
    `/api/highlights/${highlightId}?address=${walletAddress}&chainId=${chainId}`
  );

  if (error || data === null) return null;
  if (!data) return <div>loading...</div>;

  return (
    <Card withBorder padding="lg" radius="lg">
      <Flex align="center" gap="6px">
        {data.multiple ? (
          <Flex>
            <ColorSwatch
              size="12px"
              color={data.color}
              withShadow={false}
              styles={{ root: { border: "1px solid #fff" } }}
            />
            <ColorSwatch
              size="12px"
              color={data.color}
              withShadow={false}
              ml="-6px"
              styles={{ root: { border: "1px solid #fff" } }}
            />
            <ColorSwatch
              size="12px"
              color={data.color}
              withShadow={false}
              ml="-6px"
              styles={{ root: { border: "1px solid #fff" } }}
            />
          </Flex>
        ) : (
          <ColorSwatch size="10px" color={data.color} withShadow={false} />
        )}
        <Text fw={600}>{wrapStarredWords(data?.title, data.color)}</Text>
      </Flex>
      <Text fz="sm" c="dimmed" mt={2} style={{ height: 21 }}>
        {data?.metadata}
      </Text>

      <Text fz="sm" mt="md">
        {wrapStarredWords(data?.statistic, data.color)}
      </Text>
      {data.icon && (
        <Box pos="absolute" top="0.9rem" right="0.9rem">
          <Image src={data.icon} w="auto" height="1.5rem" alt="" />
        </Box>
      )}
    </Card>
  );
};

export default HighlightCard;
