import { ResponsiveCalendar } from "@nivo/calendar";
import {
  formatTimeDuration,
  getCalendarYearsBetweenTimestamps,
} from "@/helpers/time";
import { Button, Group, Text } from "@mantine/core";
import { useAddress } from "@/providers/AddressProvider";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { endOfYear, startOfYear } from "date-fns";

const Heatmap = () => {
  const { address, chainId } = useAddress();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { startDate, endDate } = useMemo(() => {
    const firstDate = startOfYear(new Date(currentYear, 0, 1));
    const lastDate = endOfYear(new Date(currentYear, 0, 1));

    return { startDate: firstDate, endDate: lastDate };
  }, [currentYear]);

  const { data, isLoading } = useSWR(
    `/api/heatmap?address=${address}&chainId=${chainId}`
  );

  if (isLoading || !data) return null;

  return (
    <>
      <Group position="apart">
        <Text size={"md"} weight="500">
          {data?.count} on-chain memories over{" "}
          {formatTimeDuration(Number(data.start), Number(data.end))}
        </Text>
        <Group spacing="none" align="center">
          {getCalendarYearsBetweenTimestamps(data.start, data.end).map(
            (year) => {
              if (year === currentYear) {
                return (
                  <Text
                    key={year}
                    c="dark"
                    size="sm"
                    weight="bolder"
                    h="36"
                    mx="lg"
                  >
                    {year}
                  </Text>
                );
              }

              return (
                <Button
                  key={year}
                  onClick={() => setCurrentYear(year)}
                  variant="subtle"
                  color="gray"
                  size="sm"
                >
                  {year}
                </Button>
              );
            }
          )}
        </Group>
      </Group>
      <ResponsiveCalendar
        data={data.blocks}
        from={startDate}
        to={endDate}
        emptyColor="#E8EAEE"
        minValue={3}
        colors={["#93E7A2", "#3EBE5E", "#2F984A", "#216435"]}
        margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
        yearSpacing={40}
        monthBorderColor="#ffffff"
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        daySpacing={4}
      />
    </>
  );
};

export default Heatmap;
