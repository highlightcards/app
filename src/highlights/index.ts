import firstTransaction from "./chain/FirstTransaction";
import UniswapAPE from "./chain/UniswapAPE";
import UniswapENS from "./chain/UniswapENS";
import LensInterests from "./chain/LensInterests";
import LensActivity from "./chain/LensActivity";
import AirstackNFTs from "./chain/AirstackNFTs";
import WorldCoin from "./chain/WorldCoin";
import AirstackLens from "./chain/AirstackLens";
import AirstackFarcaster from "./chain/AirstackFarcaster";
import GraphPOAPCount from "./chain/GraphPOAPCount";
import GraphPOAPRarest from "./chain/GraphPOAPRarest";

const highlights = [
  AirstackLens,
  AirstackFarcaster,
  GraphPOAPCount,
  GraphPOAPRarest,
  LensActivity,
  LensInterests,
  UniswapAPE,
  UniswapENS,
  AirstackNFTs,
  WorldCoin,
  firstTransaction(1),
  firstTransaction(10),
  firstTransaction(56),
  firstTransaction(100),
  firstTransaction(137),
  firstTransaction(42161),
  firstTransaction(43114),
];

export default highlights;
