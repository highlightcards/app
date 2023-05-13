import { shortenAddress } from "@/helpers/address";
import { useAddress } from "@/providers/AddressProvider";
import { Avatar, Box, Flex, Group, Skeleton, Title } from "@mantine/core";
import { useEnsName } from "wagmi";
import useSWR from "swr";
import { useMemo } from "react";

const heatColorMap = ["#E8EAEE", "#FFD099", "#FFB966", "#FFA133", "#FF8A00"];

const Header = () => {
  const { address, chainId } = useAddress();
  const { data, isLoading } = useSWR(
    `/api/heatmap?address=${address}&chainId=${chainId}`
  );

  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
  });

  const color = useMemo(() => {
    let key = data?.pastYear % 25;
    if (key > heatColorMap.length - 1) key = heatColorMap.length - 1;
    return heatColorMap[key];
  }, [data?.pastYear]);

  return (
    <Group position="apart" mt="xl">
      <Box mt="xl">
        <Flex gap="md" justify="center" align="center" mb="xl">
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
      </Box>
    </Group>
  );
};

export default Header;
