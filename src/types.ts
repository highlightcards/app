export interface HighlightHandler {
  id: string;
  resolve: (query: HighlightRequest) => Promise<HighlightResponse | null>;
}

export interface HighlightRequest {
  walletAddress: string;
  chainId?: number;
}

export interface HighlightResponse {
  title: string;
  metadata?: string;
  icon?: string;
  color: string;
  statistic: string;
  multiple?: boolean;
}
