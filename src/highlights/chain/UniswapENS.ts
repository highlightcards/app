import { ethers, BigNumberish } from "ethers";
import { ChainId, Token, Fetcher, WETH, Route } from "@uniswap/sdk";
import Decimal from "decimal.js";
import { chains } from "@/sdk/chains";
import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { Etherscan } from "@/sdk/etherscan";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

const chainId = ChainId.MAINNET;
const ENS = new Token(
  chainId,
  "0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72",
  18
);

interface EtherscanTransaction {
  timeStamp: string;
  from: string;
  tokenSymbol: string;
}

async function getPriceInWETH() {
  const pair = await Fetcher.fetchPairData(ENS, WETH[ENS.chainId]);
  const route = new Route([pair], WETH[ENS.chainId]);
  return route.midPrice.invert().toSignificant(6);
}

async function getUniswapENS(query: HighlightRequest) {
  const balance = await Etherscan.query(
    {
      module: "account",
      action: "tokenbalance",
      contractAddress: ENS.address,
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
      contractAddress: ENS.address,
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

  const response: HighlightResponse = {
    title: "Holder of *$ENS*",
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
  id: "uniswap-ens",
  resolve: getUniswapENS,
};

export default handler;
