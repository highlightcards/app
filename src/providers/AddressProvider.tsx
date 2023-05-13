import { Center, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import React, { PropsWithChildren, createContext, useMemo } from "react";
import { useEnsAddress } from "wagmi";

const AddressContext = createContext({
  address: "",
  chainId: 1,
});

export const AddressProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();

  const addressStr = router.query.address as string;
  const chainIdStr = router.query.chain;

  const { data: ensAddress } = useEnsAddress({
    name: addressStr,
    enabled: addressStr?.endsWith(".eth"),
  });

  const chainId = useMemo(() => {
    try {
      return Number.parseInt(chainIdStr as string);
    } catch (e) {
      return 1;
    }
  }, [chainIdStr]);

  const address = useMemo(() => {
    if (ensAddress) return ensAddress;
    return addressStr;
  }, [ensAddress, addressStr]);

  if (!address) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    );
  }

  return (
    <AddressContext.Provider value={{ address, chainId }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = React.useContext(AddressContext);
  if (context === undefined) {
    throw new Error("useAddress must be used within a AddressProvider");
  }
  return context;
};
