import { shortenAddress } from "@/helpers/address";
import { useAddress } from "@/providers/AddressProvider";
import { Avatar, Box, Flex, Group, Title } from "@mantine/core";
import { useEnsAvatar, useEnsName } from "wagmi";

const Header = () => {
  const { address } = useAddress();
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
  });
  const { data: avatar } = useEnsAvatar({
    name: ensName,
  });

  return (
    <Group position="apart" mt="xl">
      <Box mt="xl">
        <Flex gap="md" justify="center" align="center" mb="xl">
          <Avatar radius="50%" size="lg" src={avatar} />
          <Title order={1} weight="500">
            {ensName || shortenAddress(address as `0x${string}`)}
          </Title>
        </Flex>
      </Box>
    </Group>
  );
};

export default Header;
