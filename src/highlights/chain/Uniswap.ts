import {
  HighlightHandler,
  HighlightUniswapRequest,
  HighlightResponse,
  HighlightUniswayHandler,
} from "@/types";
import useEtherscan from "../../hooks/useEtherscan";
import { Etherscan } from "@/sdk/etherscan";

async function getUniswap(query: HighlightUniswapRequest) {

  const data = await Etherscan.query({
    module: 'account',
    action: 'tokenbalance',
    contractAddress: query.tokenAddress,
    address: query.walletAddress,
    tag: 'latest',
  }, 1)

  const etherscan = useEtherscan(_query);

  console.log("etherscan data: ", etherscan.data);

  const response: HighlightResponse = {
    title: "Member of Friends with benefits",
    metadata: "Joined 1 year ago",
    icon: "https://example.com/icon.png",
    color: "#000000",
    statistic: query.walletAddress,
  };
  return response;
}

const handler: HighlightUniswayHandler = {
  id: "uniswap",
  resolve: getUniswap,
};

export default handler;
