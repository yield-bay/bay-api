export async function asyncForEach(array: any[], callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

export const getChainIdForNetwork = (network: string) => {
  let chainId = 1285
  switch (network) {
    case "moonriver": // || "hardhat":
      chainId = 1285
      break
    case "moonbeam":
      chainId = 1284
      break
    case "moonbaseAlpha":
      chainId = 1287
      break
    default:
      break
  }
  return chainId
}

export const getNetworkForChainId = (chainId: string) => {
  let network = "moonriver"
  switch (chainId) {
    case "1285":
      network = "moonriver"
      break
    case "1284":
      network = "moonbeam"
      break
    case "1287":
      network = "moonbaseAlpha"
      break
    case "31337":
      network = "hardhat"
      break
    default:
      break
  }
  return network
}

export const isAllowedChainId = (chainId: string) => {
  switch (chainId) {
    case "31337":
      return true
    case "1285":
      return true
    case "1284":
      return true
    case "1287":
      return true
    default:
      return false
  }
}
