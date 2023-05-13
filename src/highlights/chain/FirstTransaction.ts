import { chains } from "@/sdk/chains";
import { Etherscan } from "@/sdk/etherscan";
import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

interface EtherscanTransaction {
  timeStamp: string;
  from: string;
}

async function getFirstTransaction(query: HighlightRequest) {
  const result = await Etherscan.query<EtherscanTransaction[]>(
    {
      module: "account",
      action: "txlist",
      address: query.walletAddress,
      sort: "asc",
      page: "1",
      offset: "1",
    },
    query.chainId || 1
  );

  if (result?.length === 0) {
    throw new Error("No transactions found");
  }

  const tx = result[0];

  const chain = chains.find((chain) => chain.id === query.chainId);
  if (!chain) {
    throw new Error("Chain not found");
  }

  const response: HighlightResponse = {
    title: `First Transaction on *${chain.name}*`,
    metadata: formatDistanceToNow(fromUnixTime(Number.parseInt(tx.timeStamp)), {
      addSuffix: true,
    }),
    icon: chain.icon,
    color: chain.color,
    statistic: `Funded from *${tx.from}*`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "first-transaction",
  resolve: getFirstTransaction,
};

export default handler;
