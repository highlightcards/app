import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";

const apolloClient = new ApolloClient({
  uri: "https://api.airstack.xyz/gql",
  cache: new InMemoryCache(),
});

async function getAirstackNFTs(query: HighlightRequest) {
  var _response = await apolloClient.query({
    query: gql(`query NftBalance {
      TokenBalances(
        input: {filter: {owner: {_eq: "${query.walletAddress}"}, tokenType: {_in: [ERC1155, ERC721]}}, blockchain: ethereum, limit: 200}
      ) {
        TokenBalance {
          tokenAddress
          amount
          tokenType
          owner {
            addresses
          }
          tokenNfts {
            address
            tokenId
            blockchain
            lastTransferTimestamp
          }
        }
      }
    }`),
  });

  const tokens = _response?.data.TokenBalances.TokenBalance;
  if (!tokens) return null;

  const numberOfNFTs = tokens.length >= 200 ? "200+" : tokens.length + "";
  const latestNFT = tokens[0]?.tokenNfts?.lastTransferTimestamp;
  const createdAt = Date.parse(latestNFT);

  const response: HighlightResponse = {
    title: "Holds non-fungible tokens",
    metadata: `Received ${formatDistanceToNow(createdAt, {
      addSuffix: true,
    })}`,
    icon: "/img/airstack.png",
    color: "#BD00FF",
    statistic: `Collected *${numberOfNFTs} NFTs* so far`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "airstack-nfts",
  resolve: getAirstackNFTs,
};

export default handler;
