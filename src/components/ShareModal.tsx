import { Anchor, Button, Image, Modal, Stack, Text } from "@mantine/core";
import { useState } from "react";
import HighlightCard, { HighlightCardProps } from "./InsightCard";
import Link from "next/link";

interface ShareModalProps extends HighlightCardProps {
  opened: boolean;
  shareUrl: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  opened,
  onClose,
  shareUrl,
  ...rest
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      withCloseButton={false}
      radius="lg"
      styles={{ content: { backgroundColor: "#fafafa" } }}
      padding="xl"
    >
      <Stack align="center" justify="center" spacing="xs" mb="xl">
        <Image src="/highlight.svg" width={28} height={28} alt="" />
        <Text size="md" fw={500}>
          Share highlight
        </Text>
        <Text c="dimmed" fz="sm" ta="center" mx="xl" px="xl">
          Memories are better with frens, publish a highlight to lens.
        </Text>
      </Stack>

      <HighlightCard {...rest} />

      <Anchor href={shareUrl} target="_blank">
        <Button
          fullWidth
          color="green.9"
          radius="md"
          leftIcon={<Image src="/Lens.png" width={18} height={18} alt="" />}
          mt="xl"
        >
          Publish
        </Button>
      </Anchor>
    </Modal>
  );
};

export default ShareModal;
