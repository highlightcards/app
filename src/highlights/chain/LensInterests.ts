import { HighlightHandler, HighlightRequest, HighlightResponse } from "@/types";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const apolloClient = new ApolloClient({
  uri: "https://api.lens.dev/",
  cache: new InMemoryCache(),
});

async function getLensInterests(query: HighlightRequest) {
  const defaultProfile = await apolloClient.query({
    query: gql(`query DefaultProfile {
      defaultProfile(request: { ethereumAddress: "0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3"}) {
        id
      }
    }`),
  });

  const profileId = defaultProfile.data.defaultProfile.id;

  const profileInterests = await apolloClient.query({
    query: gql(`query Profile {
      profile(request: { profileId: "${profileId}" }) {
        id
        interests
      }
    }
    `),
  });

  const interests = profileInterests.data.profile.interests;

  const response: HighlightResponse = {
    title: `Interested in ${getInterestsTitle(interests)}`,
    metadata: "",
    icon: "/img/lens.png",
    color: "#216435",
    statistic: `According to *Lens Protocol*`,
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
