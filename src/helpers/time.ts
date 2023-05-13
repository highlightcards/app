import { format, formatDuration, intervalToDuration } from "date-fns";

export const formattedDay = (timeStamp: number) => {
  return format(new Date(Number(timeStamp) * 1000), "yyyy-MM-dd");
};

export const formatToday = () => {
  return format(new Date(), "yyyy-MM-dd");
};

export const formatTimeDuration = (timestamp1: number, timestamp2: number) => {
  const date1 = new Date(timestamp1 * 1000);
  const date2 = new Date(timestamp2 * 1000);

  return formatDuration(
    intervalToDuration({
      start: date1,
      end: date2,
    }),
    { format: ["years", "months"] }
  );
};
