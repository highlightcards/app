import {
  Card,
  Text,
  Progress,
  Badge,
  Group,
} from "@mantine/core";

function InsightCard() {

  return (
    <Card withBorder padding="lg" radius="md">
      <Group position="apart">
        <Badge>12 days left</Badge>
      </Group>

      <Text fz="lg" fw={500} mt="md">
        5.3 minor release (September 2022)
      </Text>
      <Text fz="sm" c="dimmed" mt={5}>
        Form context management, Switch, Grid and Indicator components
        improvements, new hook and 10+ other changes
      </Text>

      <Text c="dimmed" fz="sm" mt="md">
        Tasks completed:{" "}
        <Text
          span
          fw={500}
          sx={(theme) => ({
            color: theme.colorScheme === "dark" ? theme.white : theme.black,
          })}
        >
          23/36
        </Text>
      </Text>

      <Progress value={(23 / 36) * 100} mt={5} />
    </Card>
  );
}

export default InsightCard;
