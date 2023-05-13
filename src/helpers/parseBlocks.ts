import { formattedDay } from "./time"


export interface TransactionStatus {
    message: string;
    result: Transaction[];
    status: string;
}
export interface Transaction {
  blockHash: string;
  blockNumber: string;
  confirmations: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  from: string;
  functionName: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  hash: string;
  input: string;
  isError: string;
  methodId: string;
  nonce: string;
  timeStamp: string;
  to: string;
  transactionIndex: string;
  txreceipt_status: string;
  value: string;
}

export function parseBlocks(transactions: Transaction[]) {
  const heatMapDataPoint: Record<string, number> = {};
  transactions.forEach((transaction) => {
    const day = formattedDay(Number(transaction.timeStamp))
    
    if (heatMapDataPoint[day]) {
      heatMapDataPoint[day]++;
    } else {
      heatMapDataPoint[day] = 1;
    }
  });
  const heatmap = Object.entries(heatMapDataPoint).map(([day, value]) => ({
    day,
    value,
  }));
  return heatmap;
}
