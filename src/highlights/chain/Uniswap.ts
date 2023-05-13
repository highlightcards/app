import { ethers, BigNumberish } from "ethers";
import { ChainId, Token, Fetcher, WETH, Route } from "@uniswap/sdk";
import Decimal from "decimal.js";
import { chains } from "@/sdk/chains";
import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { Etherscan } from "@/sdk/etherscan";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

const chainId = ChainId.MAINNET;
const APE = new Token(
  chainId,
  "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
  18
);

interface EtherscanTransaction {
  timeStamp: string;
  from: string;
  tokenSymbol: string;
}

async function getPriceInWETH() {
  const pair = await Fetcher.fetchPairData(APE, WETH[APE.chainId]);
  const route = new Route([pair], WETH[APE.chainId]);
  return route.midPrice.invert().toSignificant(6);
}

async function getUniswap(query: HighlightRequest) {
  const balance = await Etherscan.query(
    {
      module: "account",
      action: "tokenbalance",
      contractAddress: APE.address,
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
      contractAddress: APE.address,
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
  const weth = await getPriceInWETH();
  console.log("weth: ", weth);

  const response: HighlightResponse = {
    title: "Holder of *$APE*",
    metadata: `Joined ${formatDistanceToNow(
      fromUnixTime(Number.parseInt(tx.timeStamp)),
      {
        addSuffix: true,
      }
    )}`,
    icon: "/img/uniswap.png",
    color: "#FF007A",
    statistic: `Owns *${new Decimal(
      ethers.formatEther(balance as BigNumberish)
    ).toFixed(1)} $${tx.tokenSymbol}* valued at *${new Decimal(weth).toFixed(
      4
    )} wETH`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "uniswap",
  resolve: getUniswap,
};

export default handler;
