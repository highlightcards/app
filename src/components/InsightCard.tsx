import useSWR from "swr";
import {
  Card,
  Text,
  Flex,
  ColorSwatch,
  Box,
  Image,
  Skeleton,
} from "@mantine/core";
import { useMemo, useState } from "react";
import ShareModal from "./ShareModal";
import { useDisclosure } from "@mantine/hooks";

export interface HighlightCardProps {
  highlightId: string;
  walletAddress: string;
  chainId: number;
  clickable?: boolean;
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
  clickable = false,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const { data, error, isLoading } = useSWR(
    `/api/highlights/${highlightId}?address=${walletAddress}&chainId=${chainId}`
  );

  const getLensterUrl = (
    text: string,
    url: string,
    via: string,
    hashtags: string[]
  ) => {
    const encodedText = encodeURIComponent(text);
    const lensterUrl = `https://lenster.xyz/?text=${encodedText}!&url=${url}&via=${via}&hashtags=${hashtags.join(
      ","
    )}`;
    return lensterUrl;
  };

  const shareUrl = useMemo(() => {
    const highlight = data?.title;
    const metadata = data?.metadata;
    const statistic = data?.statistic;

    return getLensterUrl(
      `${highlight}\n${metadata}\n${statistic}`,
      "https://highlight.cards",
      "Highlight",
      ["highlight"]
    );
  }, [data]);

  if (isLoading)
    return (
      <Card withBorder padding="lg" radius="lg">
        <Flex align="center" gap="6px">
          <Skeleton height={12} circle radius="xl" />
          <Skeleton height={12} width="200px" />
        </Flex>

        <Skeleton height={12} width="150px" mt="sm" />
        <Skeleton height={12} width="100%" mt="md" />
      </Card>
    );

  if (error || data === null) return null;

  return (
    <>
      <Card
        onClick={clickable ? open : undefined}
        withBorder
        padding="lg"
        radius="lg"
        style={{ cursor: clickable ? "pointer" : "default" }}
      >
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

      <ShareModal
        opened={opened}
        onClose={close}
        chainId={chainId}
        highlightId={highlightId}
        walletAddress={walletAddress}
        shareUrl={shareUrl}
      />
    </>
  );
};

export default HighlightCard;
