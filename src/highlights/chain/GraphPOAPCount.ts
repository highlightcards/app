import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow, fromUnixTime } from "date-fns";

const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/franz101/poap-xdai",
  cache: new InMemoryCache(),
});

async function getGraphPOAPCount(query: HighlightRequest) {
  var _response = await apolloClient.query({
    query: gql(`query GraphPOAPCount{
      account(id: "${query.walletAddress?.toLowerCase()}") {
        id
        tokens(orderBy: created, orderDirection: asc, first: 1) {
          id
          created
        }
        tokensOwned
      }
    }`),
  });

  const tokenCount = _response?.data?.account?.tokensOwned;
  if (!tokenCount || tokenCount == 0) return null;

  const createdAt = fromUnixTime(_response.data.account.tokens[0].created);

  const response: HighlightResponse = {
    title: `Participated in *${tokenCount} POAPs*`,
    metadata: ``,
    icon: "/img/graph.png",
    color: "#4b35ad",
    statistic: `First POAP received ${formatDistanceToNow(createdAt, {addSuffix: true})}`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "graph-poap-count",
  resolve: getGraphPOAPCount,
};

export default handler;
