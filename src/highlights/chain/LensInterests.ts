import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api.lens.dev/",
  cache: new InMemoryCache(),
});

async function getLensInterests(query: HighlightRequest) {
  const defaultProfile = await apolloClient.query({
    query: gql(`query DefaultProfile($walletAddress: EthereumAddress!) {
      defaultProfile(request: { ethereumAddress: $walletAddress }) {
        id
      }
    }
    `),
    variables: {
      walletAddress: query.walletAddress,
    },
  });

  const profileId = defaultProfile?.data?.defaultProfile?.id;
  if (!profileId) return null;

  const profileInterests = await apolloClient.query({
    query: gql(`query Profile($profileId: ProfileId!) {
      profile(request: { profileId: $profileId }) {
        id
        interests
      }
    }
    `),
    variables: {
      profileId,
    },
  });

  const interests = profileInterests?.data?.profile?.interests;
  if (interests.length === 0) return null;

  const response: HighlightResponse = {
    title: `Interested in ${getInterestsTitle(interests)}`,
    metadata: "",
    icon: "/img/lens.png",
    color: "#216435",
    statistic: `According to *Lens Protocol*`,
    multiple: true,
  };
  return response;
}

const handler: HighlightHandler = {
  id: "lens-interests",
  resolve: getLensInterests,
};

const getInterestsTitle = (interests: string[]) => {
  const firstInterest = interests[0].substring(
    interests[0].lastIndexOf("_") + 1,
    interests[0].length
  );
  if (interests.length === 1) {
    return `*${firstInterest}*`.toLowerCase();
  }
  return `*${firstInterest}* & *${interests[1].substring(
    interests[1].lastIndexOf("_") + 1,
    interests[1].length
  )}*`.toLowerCase();
};

export default handler;
