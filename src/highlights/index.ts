import firstTransaction from "./chain/FirstTransaction";
import Uniswap from "./chain/Uniswap";
import LensInterests from "./chain/LensInterests";
import LensActivity from "./chain/LensActivity";

const highlights = [
  firstTransaction(1),
  firstTransaction(10),
  firstTransaction(56),
  firstTransaction(100),
  firstTransaction(137),
  firstTransaction(42161),
  firstTransaction(43114),
  Uniswap,
  LensInterests,
  LensActivity,
];

export default highlights;
