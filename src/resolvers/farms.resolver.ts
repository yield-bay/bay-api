import { collections } from "../services/database.service"
import Farm from "../models/farm"

enum Chain {
    MOONRIVER = "moonriver",
    MOONBEAM = "moonbeam",
    ASTAR = "astar"
}

enum FarmType {
    STANDARD_AMM,
    STABLE_AMM,
    SINGLE_STAKING
}

enum FarmImplementation {
    SOLIDITY,
    INK,
    PALLET
}

enum Freq {
    DAILY,
    WEEKLY,
    MONTHLY,
    ANNUALLY
}

export const FarmsResolver = async (parents: any, args: any, context: any) => {

    try {
        const dbFarms: Farm[] = (await collections.farms
            ?.find({
                ap: {$exists:true, $gt: 0}
            })
            .sort({ tvl: -1 })
            // .limit(lim)
            .toArray()) as unknown as Farm[]
        console.log("dksjdksj", dbFarms.length)


        const farms = dbFarms.map((f: Farm) => {
            return {
                chain: f.chain,// == "moonriver" ? Chain.MOONRIVER : Chain.MOONBEAM,
                protocol: f.protocol,
                farm_type: f.farm_type,// == "StandardAmm" ? FarmType.STANDARD_AMM : FarmType.STABLE_AMM,
                farm_implementation: f.farm_implementation,// FarmImplementation.SOLIDITY,
                asset: f.asset,
                id: f.id,
                tvl: f.tvl,
                rewards: f.rewards,
                apr: f.apr,
                url: f.url,
            }
        })
        return farms
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
