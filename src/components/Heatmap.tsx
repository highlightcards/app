import { ResponsiveCalendar } from "@nivo/calendar";
import { formatToday, formattedDay, formatTimeDuration } from "@/helpers/time";
import { Text } from "@mantine/core";
import { useAddress } from "@/providers/AddressProvider";
import useSWR from "swr";

const Heatmap = () => {
  const { address, chainId } = useAddress();
  const { data, error, isLoading } = useSWR(
    `/api/heatmap?address=${address}&chainId=${chainId}`
  );

  if (isLoading || !data) return null;

  console.log(data)

  return (
    <>
      <Text size={"md"}>
        {data?.count} on-chain memories over{" "}
        {formatTimeDuration(Number(data.start), Number(data.end))}
      </Text>
      <ResponsiveCalendar
        data={data.blocks}
        from={formattedDay(data.start)}
        to={formatToday()}
        emptyColor="#eeeeee"
        minValue={3}
        colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
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
