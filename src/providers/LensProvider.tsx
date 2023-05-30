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
  getLensProfile: () => any;
  postPublication: (profileId: string, ipfsHash: string) => any;
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
    return data;
  };

  return (
    <LensContext.Provider
      value={{
        token,
        login,
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
