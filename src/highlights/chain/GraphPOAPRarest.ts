import { HTTPClient } from "@/sdk/http";
import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow, fromUnixTime } from "date-fns";
import { http } from "viem";

const apolloClient = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/franz101/poap-xdai",
  cache: new InMemoryCache(),
});

async function getGraphPOAPs(query: HighlightRequest) {
  var _response = await apolloClient.query({
    query: gql(`
    {
      tokens(where: { owner: "${query.walletAddress?.toLowerCase()}"}) {
          id
          created
          event {
            id
            tokenCount
          }
        }
    }`),
  });

  const tokensList: any[] = _response?.data?.tokens;
  if (!tokensList || tokensList.length == 0) return null;

  let rarest = tokensList[0];
  for (const token of tokensList) {
    if (
      Number.parseInt(token.event.tokenCount) <
      Number.parseInt(rarest.event.tokenCount)
    ) {
      rarest = token;
    }
  }

  console.log(rarest);

  const data: any = await HTTPClient.get(`https://api.poap.tech/metadata/${rarest.event.id}/${rarest.id}`);
  console.log(data);

  const response: HighlightResponse = {
    title: `Your rarest POAP is *${data.name}*`,
    metadata: ``,
    icon: "/img/graph.png",
    color: "#4b35ad",
    statistic: `Only *${rarest.event.tokenCount}* people own this POAP`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "graph-poap-rarest",
  resolve: getGraphPOAPs,
};

export default handler;
