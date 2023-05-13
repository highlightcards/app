import { shortenAddress } from "@/helpers/address";
import { useAddress } from "@/providers/AddressProvider";
import { Avatar, Flex, Group, Skeleton, Title } from "@mantine/core";
import { useEnsName } from "wagmi";
import useSWR from "swr";
import { FollowOnLens, Theme } from "@lens-protocol/widgets-react";

function getColorFromNumber(num: number) {
  let colors = ["#E8EAEE", "#FFD099", "#FFB966", "#FFA133", "#FF8A00"];
  let thresholds = [0, 25, 50, 75, 100];

  let color = colors[colors.length - 1]; // default color if num > 100

  for (let i = 0; i < thresholds.length; i++) {
    if (num < thresholds[i]) {
      color = colors[i - 1];
      break;
    }
  }

  return color;
}

const Header = () => {
  const { address, chainId } = useAddress();
  const { data, isLoading } = useSWR(
    `/api/heatmap?address=${address}&chainId=${chainId}`
  );

  const { data: profileData } = useSWR(`/api/lens-profile?address=${address}`);
  const handle = profileData?.profile?.handle;

  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
  });

  const color = getColorFromNumber(data?.pastYear || 0);

  return (
    <Group position="apart" mt="xl" align="center" mb="xl">
      <Flex gap="md" justify="center" align="center">
        {isLoading ? (
          <Skeleton circle height="lg" />
        ) : (
          <Avatar
            radius="50%"
            size="lg"
            src={null}
            styles={{
              placeholder: { background: color },
              placeholderIcon: { display: "none" },
            }}
          />
        )}
        <Title order={1} weight="500">
          {ensName || shortenAddress(address as `0x${string}`)}
        </Title>
      </Flex>

      {handle && (
        <FollowOnLens handle={handle} title="Follow" theme={Theme.mint} />
      )}
    </Group>
  );
};

export default Header;
