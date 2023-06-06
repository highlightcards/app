import React, { PropsWithChildren, createContext, useMemo } from "react";
import {
  lensClient,
  challenge,
  authenticate,
  getProfile,
  postPublicationQuery,
} from "../sdk/lens";
import { useAccount, useWalletClient } from "wagmi";
import { useLocalStorage } from "@mantine/hooks";

type LensContextType = {
  token: string;
  login: () => Promise<void>;
  sign: (typedData: any) => Promise<`0x${string}`>;
  getLensProfile: () => any;
  postPublication: (profileId: string, ipfsHash: string) => any;
};

const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  prop: K
): Omit<T, K> => {
  const { [prop]: _, ...rest } = obj;
  return rest;
};

const getSignature = (
  typedData: any
): {
  primaryType: string;
  domain: Record<string, any>;
  types: Record<string, any>;
  message: Record<string, any>;
} => {
  const { domain, types, value } = typedData;

  return {
    primaryType: Object.keys(omit(types, "__typename"))[0],
    domain: omit(domain, "__typename"),
    types: omit(types, "__typename"),
    message: omit(value, "__typename"),
  };
};

const LensContext = createContext<LensContextType | undefined>(undefined);

export const LensProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();
  const { data: signer } = useWalletClient();
  const [token, setToken] = useLocalStorage({
    key: "lensToken",
    defaultValue: "",
  });
  async function login() {
    if (!signer || token) return;
    try {
      /* first request the challenge from the API server */
      const challengeInfo = await lensClient.query({
        query: challenge,
        variables: { address },
      });

      /* ask the user to sign a message with the challenge info returned from the server */
      const signature = await signer?.signMessage({
        message: challengeInfo.data.challenge.text,
      });
      /* authenticate the user */
      const authData = await lensClient.mutate({
        mutation: authenticate,
        variables: {
          address,
          signature,
        },
      });
      /* if user authentication is successful, you will receive an accessToken and refreshToken */
      const {
        data: {
          authenticate: { accessToken },
        },
      } = authData;
      setToken(accessToken);
    } catch (err) {
      console.log("Error signing in: ", err);
    }
  }

  async function sign(typedData: any) {
    if (!signer || token) return;

    const parsed = getSignature(typedData);
    const signature = await signer?.signTypedData(parsed);
    return signature;
  }

  const getLensProfile = async () => {
    if (!token) return;
    const { data } = await lensClient.query({
      query: getProfile,
      variables: { address },
    });
    console.log({ data });
    return data?.defaultProfile;
  };

  const postPublication = async (profileId: string, ipfsHash: string) => {
    if (!token) return;
    const { data } = await lensClient.mutate({
      mutation: postPublicationQuery,
      variables: {
        profileId: profileId,
        contentURI: ipfsHash,
      },
    });
    return data?.createPostTypedData;
  };

  return (
    <LensContext.Provider
      value={{
        token,
        login,
        sign,
        getLensProfile,
        postPublication,
      }}
    >
      {children}
    </LensContext.Provider>
  );
};

export const useLens = () => {
  const context = React.useContext(LensContext);
  if (context === undefined) {
    throw new Error("useLens must be used within a LensProvider");
  }
  return context;
};
