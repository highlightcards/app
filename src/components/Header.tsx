import { shortenAddress } from "@/helpers/address";
import { useAddress } from "@/providers/AddressProvider";
import { Avatar, Box, Flex, Group, Title } from "@mantine/core";
import { useEnsName } from "wagmi";

const Header = () => {
  const { address } = useAddress();
  const { data } = useEnsName({
    address: address as `0x${string}`,
  });

  return (
    <Group position="apart" mt="xl">
      <Box>
        <Flex gap="md" justify="center" align="center">
          <Avatar radius="50%" size="xl" />
          <Title order={1}>
            {data || shortenAddress(address as `0x${string}`)}
          </Title>
        </Flex>
      </Box>
    </Group>
  );
};

export default Header;
