import { HighlightResponse, HighlightRequest, HighlightHandler } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";
import { formatDistanceToNow } from "date-fns";

const apolloClient = new ApolloClient({
  uri: "https://api.airstack.xyz/gql",
  cache: new InMemoryCache(),
});

async function getAirstackFarcaster(query: HighlightRequest) {
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

  const farcaster = _response?.data.Wallet?.socials?.[0];
  if (!farcaster) return null;

  const createdAt = Date.parse(farcaster.profileCreatedAtBlockTimestamp);

  const response: HighlightResponse = {
    title: `Holder of *${farcaster.profileName}*`,
    metadata: `Profile created ${formatDistanceToNow(createdAt, {
      addSuffix: true,
    })}`,
    icon: "/img/airstack.png",
    color: "#BD00FF",
    statistic: `Registered on *Farcaster*`,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "airstack-farcaster",
  resolve: getAirstackFarcaster,
};

export default handler;
