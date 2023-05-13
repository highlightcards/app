import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

const apolloClient = new ApolloClient({
  uri: "https://api.lens.dev/",
  cache: new InMemoryCache(),
});

async function getLensProfile(query: HighlightRequest) {
  var _response = await apolloClient.query({
    query: gql(`query DefaultProfile {
        defaultProfile(request: { ethereumAddress: "${query.walletAddress}"}) {
          handle
        }
      }`),
  });
  const handle = _response?.data?.defaultProfile?.handle;

  return {
    handle,
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.query;
  if (!address) {
    res.status(400).json({
      error: "Missing address",
    });
    return;
  }
  const handle = await getLensProfile({ walletAddress: address as string });

  res.status(200).json({
    profile: handle,
  });
};

export default handler;
