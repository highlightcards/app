import firstTransaction from "./chain/FirstTransaction";
import Uniswap from "./chain/Uniswap";
import LensInterests from "./chain/LensInterests";
import LensActivity from "./chain/LensActivity";

const highlights = [
  firstTransaction(1),
  firstTransaction(10),
  firstTransaction(137),
  Uniswap,
  LensInterests,
  LensActivity,
];

export default highlights;
