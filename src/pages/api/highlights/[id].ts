import highlights from "@/highlights";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, address, chainId } = req.query;
  const highlight = highlights.find((highlight) => highlight.id === id);

  if (!highlight) {
    res.status(404).json({ message: "Not found" });
    return;
  }

  const response = await highlight.resolve({
    walletAddress: address as string,
    chainId: chainId ? parseInt(chainId as string) : undefined,
  });

  res.status(200).json(response);
};

export default handler;