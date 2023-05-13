export function shortenAddress(
  address: `0x${string}`,
  frontLength = 5,
  backLength = 4
) {
  // Check if the address is valid
  if (!address) {
    return "";
  }

  // Shorten the address
  return `${address.substring(0, frontLength)}...${address.substring(
    address.length - backLength
  )}`;
}
