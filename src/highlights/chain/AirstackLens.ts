import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";

const apolloClient = new ApolloClient({
  uri: "https://api.airstack.xyz/gql",
  cache: new InMemoryCache(),
});

async function getAirstackLens(query: HighlightRequest) {
  var _response = await apolloClient.query({
    query: gql(`query SocialHandle {
      Wallet(input: {identity: "${query.walletAddress}", blockchain: ethereum}) {
        socials {
          dappName
          profileName
          profileCreatedAtBlockTimestamp
        }
      }
    }`),
  });

  const lens = _response?.data.Wallet?.socials?.[1];
  if (!lens) return null;

  const createdAt = Date.parse(lens.profileCreatedAtBlockTimestamp);

  const response: HighlightResponse = {
    title: `Holder of *${lens.profileName}*`,
    metadata: `Profile created ${formatDistanceToNow(createdAt, {
      addSuffix: true,
    })}`,
    icon: "/img/airstack.png",
    color: "#BD00FF",
    statistic: `Registered on *Lens protocol*`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "airstack-lens",
  resolve: getAirstackLens,
};

export default handler;
