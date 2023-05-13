import { ResponsiveCalendar } from "@nivo/calendar";
import {
  formatTimeDuration,
  getCalendarYearsBetweenTimestamps,
} from "@/helpers/time";
import { Button, Group, Skeleton, Text } from "@mantine/core";
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

  if (isLoading) {
    return (
      <>
        <Group position="apart">
          <Skeleton width={200} height={20} />
          <Skeleton width={150} height={20} />
        </Group>
        <Skeleton height={200} />
      </>
    );
  }

  if (!data) return null;

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
                    px="0.4rem"
                  >
                    {year}
                  </Text>
                );
              }

              return (
                <Button
                  key={year}
                  onClick={() => setCurrentYear(year)}
                  px="0.3rem"
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
        minValue={0}
        maxValue={3}
        colors={["#FFD099", "#FFB966", "#FFA133", "#FF8A00"]}
        margin={{ top: 0, right: 0, bottom: 50, left: 0 }}
        yearSpacing={40}
        monthBorderColor="rgba(0, 0, 0, 0.0)"
        dayBorderWidth={0}
        dayBorderColor="#ffffff"
        daySpacing={4}
      />
    </>
  );
};

export default Heatmap;
