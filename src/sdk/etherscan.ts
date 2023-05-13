import { HTTPClient } from "./http";

const chains: Record<number, string> = {
  1: "api.etherscan.io",
  42161: "api.arbiscan.io",
  10: "api-optimistic.etherscan.io",
  100: "api.gnosisscan.io",
  137: "api.polygonscan.com",
  56: "api.bscscan.com",
  43114: "api.snowtrace.io",
  250: "api.ftmscan.com",
};

const keys: Partial<Record<number, string>> = {
  1: process.env.ETHERSCAN_KEY_1,
  42161: process.env.ETHERSCAN_KEY_42161,
  10: process.env.ETHERSCAN_KEY_10,
  100: process.env.ETHERSCAN_KEY_100,
  137: process.env.ETHERSCAN_KEY_137,
  56: process.env.ETHERSCAN_KEY_56,
  43114: process.env.ETHERSCAN_KEY_43114,
  250: process.env.ETHERSCAN_KEY_250,
};

export class Etherscan {
  private static keys = keys;

  static async query<T>(params: Record<string, string>, chain: number) {
    const domain = chains[chain];
    if (!domain) {
      throw new Error(`Unsupported chain ${chain}`);
    }

    const key = this.keys?.[chain];
    if (!key) {
      throw new Error("No API Key for chain " + chain);
    }

    const urlParams = new URLSearchParams(params);
    urlParams.append("apikey", this.keys[chain] || "");

    const result = await HTTPClient.get<{
      status: string;
      message: string;
      result: T;
    }>(`https://${domain}/api?${urlParams}`);
    if (result.status !== "1") {
      throw new Error(
        `Error with Etherscan query: ${result.message || result.result}`
      );
    }

    return result.result;
  }
}
