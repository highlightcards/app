import { shortenAddress } from "@/helpers/address";
import { capitalizeFirstWord } from "@/helpers/string";
import { chains } from "@/sdk/chains";
import { Etherscan } from "@/sdk/etherscan";
import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

interface EtherscanTransaction {
  timeStamp: string;
  from: string;
}

async function getFirstTransaction(query: HighlightRequest) {
  if (!query.walletAddress || !query.chainId) {
    throw new Error("No wallet address provided");
  }

  let result: EtherscanTransaction[] = [];
  try {
    result = await Etherscan.query<EtherscanTransaction[]>(
      {
        module: "account",
        action: "txlist",
        address: query.walletAddress,
        sort: "asc",
        page: "1",
        offset: "1",
      },
      query.chainId
    );
  } catch (e) {
    return null;
  }

  if (result?.length === 0) {
    return null;
  }

  const tx = result[0];

  const chain = chains.find((chain) => chain.id === query.chainId);
  if (!chain) {
    throw new Error("Chain not found");
  }

  const response: HighlightResponse = {
    title: `First Transaction on *${chain.name}*`,
    metadata: capitalizeFirstWord(
      formatDistanceToNow(fromUnixTime(Number.parseInt(tx.timeStamp)), {
        addSuffix: true,
      })
    ),
    color: chain.color,
    statistic: `Funded from *${shortenAddress(tx.from as `0x${string}`)}*`,
  };
  return response;
}

const getHandler = (chainId: number) => {
  const handler: HighlightHandler = {
    id: "first-transaction-chain-" + chainId,
    resolve: (query: HighlightRequest) => {
      return getFirstTransaction({ ...query, chainId });
    },
  };
  return handler;
};

export default getHandler;
