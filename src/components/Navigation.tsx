import { Anchor, Box, Button, Group, Image } from "@mantine/core";
import { IconArrowUpRight, IconBrandGithub } from "@tabler/icons-react";
import Link from "next/link";

const Navigation = () => {
  return (
    <Group h="80px" position="apart" mx="md" my="0">
      <h1>
        <Link href="/">
          <Image src="/logo.svg" alt="Highlight" />
        </Link>
      </h1>
      <Anchor href="https://github.com/mprasanjith/insights-os" target="_blank">
        <Button
          leftIcon={<IconBrandGithub size={16} />}
          rightIcon={<IconArrowUpRight size={16} />}
          variant="subtle"
          color="gray.6"
          radius="xl"
          compact
          styles={{
            leftIcon: {
              marginRight: "4px",
            },
            rightIcon: {
              marginLeft: "4px",
            },
          }}
        >
          Contribute to the project
        </Button>
      </Anchor>
    </Group>
  );
};

export default Navigation;
