import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";

async function getFirstTransaction(query: HighlightRequest) {
  const response: HighlightResponse = {
    title: "First Transaction",
    metadata: "The first transaction ever made on " + query.chainId,
    icon: "https://example.com/icon.png",
    color: "#000000",
    statistic: query.walletAddress,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "first-transaction",
  resolve: getFirstTransaction,
};

export default handler;
