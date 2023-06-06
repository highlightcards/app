import { Button, Image, Modal, Stack, Text } from "@mantine/core";
import HighlightCard, { HighlightCardProps } from "./InsightCard";
import { useLens } from "@/providers/LensProvider";
import { useState, useEffect } from "react";
import { useContractWrite } from "wagmi";
import { LensHub } from "@/abi/LensHub";
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
  const { write } = useContractWrite({
    address: "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d",
    abi: LensHub,
    functionName: "post",
    onSuccess: ({ hash }) => {
      console.log(hash);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { login, getLensProfile, postPublication, sign } = useLens();
  const ipfsHash = "ar://LK50nMHbJ9E8v9X9g2Bk2864BCLNXfWkQeyk8Giu2PI";

  const loginHandler = async () => {
    try {
      await login();
      setIsLoggedIn(true);
    } catch (e) {
      console.error(e);
    }
  };
  const handler = async () => {
    await loginHandler();
    const profile = await getLensProfile();
    const post = await postPublication(profile?.id, ipfsHash);
    console.log({post});
    const { typedData } = post;
    // const signed = await sign(typedData);
    return write({ args: [typedData.value] });
  };

  useEffect(() => {
    return () => {
      setIsLoggedIn(false);
    };
  }, []);

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
        {isLoggedIn ? `Sign-in to Lens` : `Post Highlight`}
      </Button>
    </Modal>
  );
};

export default ShareModal;
