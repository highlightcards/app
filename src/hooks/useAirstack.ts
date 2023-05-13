import { init, useQuery } from "@airstack/airstack-react";
init("77ff93b489744141961c26b6dd89a1d4");

const useAirstack = (query: string, variables: any = {}) => {
  return useQuery(query, variables, { cache: false });
};
export default useAirstack;
