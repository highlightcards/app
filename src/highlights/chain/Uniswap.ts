import { ethers, BigNumberish } from "ethers";
import Decimal from "decimal.js";
import { chains } from "@/sdk/chains";
import {
  HighlightUniswapRequest,
  HighlightResponse,
  HighlightUniswapHandler,
} from "@/types";
import { Etherscan } from "@/sdk/etherscan";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

const contractAddress = "0x4d224452801ACEd8B2F0aebE155379bb5D594381"; //$APE

interface EtherscanTransaction {
  timeStamp: string;
  from: string;
  tokenSymbol: string;
}

async function getUniswap(query: HighlightUniswapRequest) {
  const balance = await Etherscan.query(
    {
      module: "account",
      action: "tokenbalance",
      contractAddress: contractAddress,
      address: query.walletAddress,
      tag: "latest",
    },
    1
  );

  if (balance === "0") return null;

  const transactions = await Etherscan.query<EtherscanTransaction[]>(
    {
      module: "account",
      action: "tokentx",
      contractAddress: contractAddress,
      address: query.walletAddress,
      tag: "latest",
      page: "1",
      startblock: "0",
      sort: "asc",
    },
    1
  );

  const chain = chains.find((chain) => chain.id === query.chainId);
  if (!chain) {
    throw new Error("Chain not found");
  }

  if (transactions?.length === 0) {
    throw new Error("No transactions found");
  }

  const tx = transactions[0];

  const response: HighlightResponse = {
    title: "Member of *ApeCoin DAO*",
    metadata: `Joined ${formatDistanceToNow(
      fromUnixTime(Number.parseInt(tx.timeStamp)),
      {
        addSuffix: true,
      }
    )}`,
    icon: "/img/uniswap.png",
    color: chain.color,
    statistic: `Owns ${new Decimal(
      ethers.formatEther(balance as BigNumberish)
    ).toFixed(1)} ${tx.tokenSymbol} tokens`,
  };
  return response;
}

const handler: HighlightUniswapHandler = {
  id: "uniswap",
  resolve: getUniswap,
};

export default handler;
