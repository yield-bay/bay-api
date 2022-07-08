import { ethers, utils } from "ethers"
import { collections } from "../services/database.service"
import Pool from "../models/pool"
import DBToken from "../models/token"
import LiquidityPosition from "../models/liquidityPosition"
import TokenBalance from "../models/tokenBalance"
import axios from "axios"
import { Pair, Trade, Route } from "@uniswap/v2-sdk"
import JSBI from "jsbi"
import {
  Ether,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
  WETH9,
  Price
} from "@uniswap/sdk-core"
// const SolarPair = require("../../artifacts/contracts/interface/solarbeam/ISolarPair.sol/ISolarPair.json");
import SolarPair from "../artifacts/contracts/interface/solarbeam/ISolarPair.sol/ISolarPair.json"
import SolarERC20 from "../artifacts/contracts/interface/solarbeam/ISolarERC20.sol/ISolarERC20.json"
import SolarFactory from "../artifacts/contracts/interface/solarbeam/ISolarFactory.sol/ISolarFactory.json"
import SolarRouter from "../artifacts/contracts/interface/solarbeam/ISolarRouter02.sol/ISolarRouter02.json"
import {
  ROUTER,
  FACTORY,
  USDC,
  ETH,
  BUSD,
  FRAX,
  WMOVR,
  SOLAR,
  BNB,
  MATIC
} from "../lib/constants"

const SOLAR_FEE = 25

export async function makePair(
  PAIR_ADDRESS: string,
  provider: ethers.providers.StaticJsonRpcProvider
) {
  return new ethers.Contract(PAIR_ADDRESS, SolarPair.abi, provider)
}

export async function makeToken(TOKEN: string, provider: ethers.providers.StaticJsonRpcProvider
) {
  return new ethers.Contract(TOKEN, SolarERC20.abi, provider)
}

export async function getAmountsOut(router: any, amount: any, path: any) {
  const amountsOut = await router.getAmountsOut(amount, path, SOLAR_FEE)
  return amountsOut[path.length - 1]
}

export function countDecimals(value: any) {
  if (Math.floor(value) === value) return 0
  return value.toString().split(".")[1].length || 0
}

export function bnDiv1e18(num: any) {
  return num.div(ethers.BigNumber.from(10).pow(18))
}

export function sortTokens(token0: any, token1: any) {
  return token0 < token1 ? [token0, token1] : [token1, token0]
}

export async function calculateMinimumLP(
  pair: any,
  totalSupply: any,
  reserve0: any,
  reserve1: any,
  amount0: any,
  amount1: any,
  slippage: any
) {
  /**
   * LP Tokens received ->
   * Minimum of the following -
   *  1. (amount0 * totalSupply) / reserve0
   *  2. (amount1 * totalSupply) / reserve1
   */

  console.log("reserve0", reserve0, "reserve1", reserve1, "totalSupply", totalSupply.toString())
  console.log("amount0", amount0.toString(), "amount1", amount1.toString())
  const _totalSupply = ethers.BigNumber.from(
    (totalSupply * 10 ** 18).toLocaleString("fullwide", { useGrouping: false })
  )
  console.log("conv", _totalSupply)

  const value0 = amount0.mul(_totalSupply).div(ethers.BigNumber.from(
    (reserve0 * 10 ** 18).toLocaleString("fullwide", { useGrouping: false })
  ))
  const value1 = amount1.mul(_totalSupply).div(ethers.BigNumber.from(
    (reserve1 * 10 ** 18).toLocaleString("fullwide", { useGrouping: false })
  ))

  // const { reserve0x, reserve1x } = await pair.getReserves()
  // const totalSupplyx: ethers.BigNumberish = await pair.totalSupply()
  // console.log("reserve0x", reserve0x.toString(), "reserve1x", reserve1x.toString(), "totalSupplyx", totalSupplyx.toString())
  // const value0 = amount0.mul(totalSupplyx).div(reserve0x)
  // const value1 = amount1.mul(totalSupplyx).div(reserve1x)

  const minLP = value0.lt(value1) ? value0 : value1

  // `slippage` should be a number between 0 & 100.
  return minLP.mul(100 - slippage).div(100)
}

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
