import { Button, Image, Modal, Stack, Text } from "@mantine/core";
import HighlightCard, { HighlightCardProps } from "./InsightCard";
import Link from "next/link";
import {  useLens } from "@/providers/LensProvider";
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

  const { login, getLensProfile, postPublication } = useLens();
  const ipfsHash = "ar://aM1xyMXX12N1QibeWGnFCmoD1sLJt9WjIPhDa-IruDw"
  const handler = async () => {
  await login()
  const profile = await getLensProfile()
  console.log({ profile })
  const post = await postPublication(profile?.id, ipfsHash)
  console.log({ post })
  };
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
        <Button
          fullWidth
          color="green.9"
          radius="md"
          leftIcon={<Image src="/Lens.png" width={18} height={18} alt="" />}
          mt="xl"
          onClick={handler}
        >
          Post Highlight
        </Button>
    </Modal>
  );
};

export default ShareModal;
