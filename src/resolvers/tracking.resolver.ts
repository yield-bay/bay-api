import { collections } from "../services/database.service"
import Farm from "../models/farm"
import WalletConnectEvent from "../models/walletConnectEvent"


export const CreateWalletConnectEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp }
    try {
        collections.walletConnectEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateAddLiquidityEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp
    const farm = args?.farm
    const underlyingAmounts = args?.underlyingAmounts
    const lpAmount = args?.lpAmount

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp, farm: farm, underlyingAmounts: underlyingAmounts, lpAmount: lpAmount }
    try {
        collections.addLiquidityEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateRemoveLiquidityEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp
    const farm = args?.farm
    const underlyingAmounts = args?.underlyingAmounts
    const lpAmount = args?.lpAmount

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp, farm: farm, underlyingAmounts: underlyingAmounts, lpAmount: lpAmount }
    try {
        collections.removeLiquidityEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateStakeEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp
    const farm = args?.farm
    // const underlyingAmounts = args?.underlyingAmounts
    const lpAmount = args?.lpAmount

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp, farm: farm, lpAmount: lpAmount }
    try {
        collections.stakeEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateUnstakeEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp
    const farm = args?.farm
    // const underlyingAmounts = args?.underlyingAmounts
    const lpAmount = args?.lpAmount

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp, farm: farm, lpAmount: lpAmount }
    try {
        collections.unstakeEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateClaimRewardsEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress
    const walletType = args?.walletType
    const walletProvider = args?.walletProvider
    const timestamp = args?.timestamp
    const farm = args?.farm
    const rewards = args?.rewards
    // const lpAmount = args?.lpAmount

    const obj = { userAddress: userAddress, walletType: walletType, walletProvider: walletProvider, timestamp: timestamp, farm: farm, rewards: rewards }
    try {
        collections.claimRewardsEvents?.insertOne(obj)
        return obj
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}