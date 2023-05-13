import { formattedDay } from "@/helpers/time";
import { Etherscan } from "@/sdk/etherscan";
import { isAfter, isBefore, parse, subYears } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

interface EtherscanTransaction {
  timeStamp: string;
}

export function parseBlocks(transactions: EtherscanTransaction[]) {
  const heatMapDataPoint: Record<string, number> = {};
  transactions.forEach((transaction) => {
    const day = formattedDay(Number(transaction.timeStamp));

    if (heatMapDataPoint[day]) {
      heatMapDataPoint[day]++;
    } else {
      heatMapDataPoint[day] = 1;
    }
  });
  const heatmap = Object.entries(heatMapDataPoint).map(([day, value]) => ({
    day,
    value,
  }));
  return heatmap;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, chainId } = req.query;
  if (!address) {
    res.status(400).json({
      error: "Missing address",
    });
    return;
  }

  const transactions = await Etherscan.query<EtherscanTransaction[]>(
    {
      module: "account",
      action: "txlist",
      address: address as string,
      sort: "asc",
    },
    typeof chainId === "string" ? Number.parseInt(chainId) : 1
  );

  const start = transactions[0].timeStamp;
  const end = transactions[transactions.length - 1].timeStamp;
  const blocks = parseBlocks(transactions);

  const pastYear = blocks.reduce((acc, block) => {
    if (
      isAfter(
        parse(block.day, "yyyy-MM-dd", new Date()),
        subYears(new Date(), 1)
      )
    ) {
      return acc + block.value;
    }
    return acc;
  }, 0);

  res.status(200).json({
    count: transactions.length,
    start,
    end,
    blocks,
    pastYear,
  });
};

export default handler;
