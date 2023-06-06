import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const API_URL = "https://api.lens.dev";

const authLink = setContext((_, { headers }) => {
  const localStorageToken = window.localStorage.getItem("lensToken")
  const token = localStorageToken ? JSON.parse(localStorageToken) : "";
  console.log("token", token)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = createHttpLink({
  uri: API_URL,
});

export const lensClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const challenge = gql`
  query Challenge($address: EthereumAddress!) {
    challenge(request: { address: $address }) {
      text
    }
  }
`;

export const authenticate = gql`
  mutation Authenticate($address: EthereumAddress!, $signature: Signature!) {
    authenticate(request: { address: $address, signature: $signature }) {
      accessToken
      refreshToken
    }
  }
`;

export const getProfile = gql`
query DefaultProfile($address: EthereumAddress!) {
    defaultProfile(request: { ethereumAddress: $address }) {
      handle
      id
  }
}
  `;

export const postPublicationQuery = gql`
  mutation CreatePostTypedData($profileId: ProfileId!, $contentURI: Url!) {
    createPostTypedData(
      request: {
        profileId: $profileId
        contentURI: $contentURI
        collectModule: { revertCollectModule: true }
        referenceModule: { followerOnlyReferenceModule: false }
      }
    ) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;
