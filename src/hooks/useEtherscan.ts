import axios, { AxiosInstance } from "axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

type TOptions = UseQueryOptions<any, Error>;

export const _query = (
  query: string,
  options?: Partial<TOptions>
): TOptions => ({
  queryKey: ["etherscan"],
  queryFn: () =>
    axios
      .get(query)
      .then(({ data: { data } }) => data)
      .catch(({ data: { error } }) => Promise.reject(error)),
  onError: (e) => console.error("useEtherscan error: ", e),
  ...options,
});

const useEtherscan = (query: string, options?: Partial<TOptions>) => {
  return useQuery(_query(query, options));
};

export default useEtherscan;
