import { ethers } from "ethers"
import { collections } from "../services/database.service"
import Pool from "../models/pool"
import { getChainIdForNetwork } from "../util/util"

export const PoolResolver = async (parents: any, args: any, context: any) => {
  if (!(args.network == "moonriver" || args.network == "moonbeam" || args.network == "moonbaseAlpha" || args.network == "hardhat") || args.app !== "solarbeam") {
    return JSON.stringify({
      error: "invalid network or app"
    })
  }
  const chainId = getChainIdForNetwork(args.network)

  try {
    const p: Pool = (await collections.pools?.findOne({
      address: ethers.utils.getAddress(args.address.toLowerCase()),
      chainId: chainId,
    })) as unknown as Pool
    const pool = {
      address: p.address,
      price: p.price,
      feesAPR: p.feesAPR,
      oneDayVolumeUSD: p.oneDayVolumeUSD,
      liquidityUSD: p.reserveUSD,
      totalSupply: p.totalSupply,
      reserve0: p.reserve0,
      reserve1: p.reserve1,
      token0Address: p.token0address,
      token1Address: p.token1address,
      token0Symbol: p.token0symbol,
      token1Symbol: p.token1symbol,
      token0Logo: p.token0Logo,
      token1Logo: p.token1Logo,
      poolAllocation: [{
        token: p.token0symbol,
        allocation: p.token0Allocation
      }, {
        token: p.token1symbol,
        allocation: p.token1Allocation
      }]
    }
    return pool
  } catch (error: any) {
    console.log(error.message)
    return JSON.stringify({
      error: error.message
    })
  }
}

export const PoolsResolver = async (parents: any, args: any, context: any) => {
  console.log("args", args, "args.first", args.first)
  if (!(args.network == "moonriver" || args.network == "moonbeam" || args.network == "moonbaseAlpha" || args.network == "hardhat") || args.app !== "solarbeam") {
    return JSON.stringify({
      error: "invalid network or app"
    })
  }
  const chainId = getChainIdForNetwork(args.network)
  console.log("chainId", chainId, "args.network", args.network, "args.first", args.first)


  let lim = 1000
  if (args.first !== null && args.first !== undefined && typeof args.first == typeof 10)
    lim = args.first

  console.log("lim", lim)

  try {
    const dbPools: Pool[] = (await collections.pools
      ?.find({
        chainId: chainId,
        $or: [
          { token0official: true, token1official: true },
          { token0official: true, token1community: true },
          { token0community: true, token1official: true, },
          { token0community: true, token1community: true },
        ],
        reserveUSD: { $gt: 0 },
        totalSupply: { $gt: 0 },
        address: {
          $nin: ["0x069C2065100b4D3D982383f7Ef3EcD1b95C05894", "0xcf06cFB361615C49403B45a5E56E3B7da3462EEA"]
        }
      })
      .sort({ reserveUSD: -1 })
      .limit(lim)
      .toArray()) as unknown as Pool[]
    console.log("dksjdksj", dbPools.length)


    const pools = dbPools.map((p: Pool) => {
      return {
        address: p.address,
        price: p.price,
        feesAPR: p.feesAPR,
        oneDayVolumeUSD: p.oneDayVolumeUSD,
        liquidityUSD: p.reserveUSD,
        totalSupply: p.totalSupply,
        reserve0: p.reserve0,
        reserve1: p.reserve1,
        token0Address: p.token0address,
        token1Address: p.token1address,
        token0Symbol: p.token0symbol,
        token1Symbol: p.token1symbol,
        token0Logo: p.token0Logo,
        token1Logo: p.token1Logo
      }
    })
    return pools
  } catch (error: any) {
    console.log(error.message)
    return JSON.stringify({
      error: error.message
    })
  }
}
