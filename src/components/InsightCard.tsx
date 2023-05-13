import useSWR from "swr";
import { Card, Text, Flex, ColorSwatch } from "@mantine/core";
import ReactMarkdown from "react-markdown";

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
        <ColorSwatch size="10px" color={data.color} withShadow={false} />
        <Text fw={600}>{wrapStarredWords(data?.title, data.color)}</Text>
      </Flex>
      <Text fz="sm" c="dimmed" mt={2}>
        {data?.metadata}
      </Text>

      <Text fz="sm" mt="md">
        {wrapStarredWords(data?.statistic, data.color)}
      </Text>
    </Card>
  );
};

export default HighlightCard;
