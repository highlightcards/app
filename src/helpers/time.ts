import { format, differenceInYears } from "date-fns"
import { Transaction } from "./parseBlocks";

export const formattedDay = (timeStamp: number) => {
   return format(
    new Date(Number(timeStamp) * 1000),
    "yyyy-MM-dd"
  );
    }

export const formatToday = () => {
    return format(new Date(), "yyyy-MM-dd");
}

export const yearsBetweenTimestamps = (timestamp1: number, timestamp2: number) => {
  const date1 = new Date(timestamp1 * 1000);
  const date2 = new Date(timestamp2 * 1000);

  return differenceInYears(date1, date2);
}
