import { collections } from "../services/database.service"
import Farm from "../models/farm"


export const FarmsResolver = async (parents: any, args: any, context: any) => {

    try {
        const dbFarms: Farm[] = (await collections.farms
            ?.find({
                allocPoint: { $exists: true, $gt: 0 },
                "asset.symbol": { $nin: ["xStella", "veSOLAR", "veFLARE", "veFLARE-veSOLAR LP"] }
            })
            .sort({ tvl: -1 })
            // .limit(lim)
            .toArray()) as unknown as Farm[]
        console.log("dksjdksj", dbFarms.length)


        const farms = dbFarms.map((f: Farm) => {
            return {
                id: f.id,
                chef: f.chef,
                chain: f.chain,// == "moonriver" ? Chain.MOONRIVER : Chain.MOONBEAM,
                protocol: f.protocol,
                farmType: f.farmType,// == "StandardAmm" ? FarmType.STANDARD_AMM : FarmType.STABLE_AMM,
                farmImpl: f.farmImpl,// FarmImplementation.SOLIDITY,
                asset: f.asset,
                tvl: f.tvl,
                apr: f.apr,
                rewards: f.rewards,
                allocPoint: f.allocPoint,
                lastUpdatedAtUTC: f.lastUpdatedAtUTC,
                safetyScore: {
                    total: f.totalScore,
                    tvl: f.tvlScore,
                    baseAPR: f.baseAPRScore,
                    rewardAPR: f.rewardAPRScore,
                    rewards: f.rewardsScore,
                },
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
