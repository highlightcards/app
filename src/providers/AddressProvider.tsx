import { Alert, Center, Loader } from "@mantine/core";
import { useRouter } from "next/router";
import React, { PropsWithChildren, createContext, useMemo } from "react";
import { isAddress } from "viem";
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

  const isValidAddress = isAddress(address);

  if (!isValidAddress) {
    return (
      <Alert title="That doesn't look right!" color="red" mt="xl">
        Looks like we could not find an address at <b>{addressStr}</b>. Please
        double check the address and try again.
      </Alert>
    );
  }

  if (!address) {
    return (
      <Center h="calc(100vh - 80px)">
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
