import { useEffect, useState } from "react";
import { ResponsiveCalendar } from "@nivo/calendar";
import { TransactionStatus, parseBlocks } from "@/helpers/parseBlocks";
import { formatToday, formattedDay } from "@/helpers/time";

interface HeatMapProps {
  value: number;
  day: string;
}

const Heatmap = ({ data }: any) => {
const address = "0xBA78CD28F7132958235D278fF3C5DC5E6d34cc15"
const [transactions, setTransactions] = useState<HeatMapProps[]>([]);
const [firstTransactionDay, setFirstTransactionDay] = useState<string>("");

useEffect(() => {
  async function fetchTransactions() {
    const response = await fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`)
    const data: TransactionStatus = await response.json()
    const firstTransactionTimestamp = data.result[0].timeStamp
    const parsedTransactions = parseBlocks(data.result)
    setTransactions(parsedTransactions)
    setFirstTransactionDay(firstTransactionTimestamp)
  }
  fetchTransactions()
},[])

  if(!transactions) return null

  return (
    <ResponsiveCalendar
      data={transactions}
      from={formattedDay(Number(firstTransactionDay))}
      to={formatToday()}
      emptyColor="#eeeeee"
      minValue={3}
      colors={["#61cdbb", "#97e3d5", "#e8c1a0", "#f47560"]}
      margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
      yearSpacing={40}
      monthBorderColor="#ffffff"
      dayBorderWidth={2}
      dayBorderColor="#ffffff"
    />
  );
};

export default Heatmap;
