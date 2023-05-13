import useSWR from "swr";
import { Card, Text, Progress, Badge, Group } from "@mantine/core";

interface HighlightCardProps {
  highlightId: string;
  walletAddress: string;
  chainId: number;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  highlightId,
  walletAddress,
  chainId,
}) => {
  const { data, error } = useSWR(
    `/api/highlights/${highlightId}?address=${walletAddress}&chainId=${chainId}`
  );

  if (error) return null;
  if (!data) return <div>loading...</div>;

  return (
    <Card withBorder padding="lg" radius="md">
      <Text fz="lg" fw={500} mt="md">
        {data?.title}
      </Text>
      <Text fz="sm" c="dimmed" mt={5}>
        {data?.metadata}
      </Text>

      <Text c="dimmed" fz="sm" mt="md">
        {data?.statistic}
      </Text>

      <Progress value={(23 / 36) * 100} mt={5} />
    </Card>
  );
};

export default HighlightCard;
