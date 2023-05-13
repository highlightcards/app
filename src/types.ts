export interface HighlightHandler {
  id: string;
  resolve: (query: HighlightRequest) => Promise<HighlightResponse>;
}

export interface HighlightUniswayHandler {
  id: string;
  resolve: (query: HighlightUniswapRequest) => Promise<HighlightResponse>;
}

export interface HighlightRequest {
  walletAddress: string;
  chainId?: number;
}

export interface HighlightUniswapRequest {
  walletAddress: string;
  tokenAddress: string;
}

export interface HighlightResponse {
  title: string;
  metadata: string;
  icon: string;
  color: string;
  statistic: string;
  multiple?: boolean;
}
