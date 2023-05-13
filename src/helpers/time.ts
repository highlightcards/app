import { format } from "date-fns"
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