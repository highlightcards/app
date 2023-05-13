import {
  differenceInCalendarYears,
  format,
  formatDuration,
  fromUnixTime,
  intervalToDuration,
} from "date-fns";

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

export function getCalendarYearsBetweenTimestamps(start: number, end: number) {
  let startYear = parseInt(format(fromUnixTime(start), "yyyy"));
  let endYear = parseInt(format(fromUnixTime(end), "yyyy"));

  let years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}
