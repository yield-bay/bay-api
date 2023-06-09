import { collections } from "../services/database.service"
import Farm from "../models/farm"

export const FarmsResolver = async (parents: any, args: any, context: any) => {
    try {
        const dbFarms: Farm[] = (await collections.farms
            ?.find({
                $and: [
                    {
                        $or: [
                            { protocol: "sushiswap" },
                            { protocol: { $nin: ["sushiswap"] }, allocPoint: { $exists: true, $gt: 0 } }
                        ]
                    },
                    {
                        $or: [
                            { id: { $nin: [31, 34, 10, 29, 30, 28] } },
                            { chef: { $nin: ["0xF3a5454496E26ac57da879bf3285Fa85DEBF0388"] } },
                        ]
                    }
                ],
                "asset.symbol": { $nin: ["xStella", "veSOLAR", "veFLARE", "veFLARE-veSOLAR LP"] },
            })
            .sort({ tvl: -1 })
            .toArray()) as unknown as Farm[]
        console.log("farms count", dbFarms.length)

        const isChain = (f: Farm, chain: string) => {
            return f.chain == chain;
        }

        const isProtocol = (f: Farm, protocol: string) => {
            return f.protocol == protocol;
        }

        let farms: any[] = [];

        if (args?.chain !== undefined && args?.protocol !== undefined) {
            console.log("c1", args?.chain);
            farms = dbFarms.filter((f: Farm) => {
                if (isChain(f, args?.chain) && isProtocol(f, args?.protocol)) {
                    console.log("valid");
                    return {
                        id: f.id,
                        chef: f.chef,
                        chain: f.chain,
                        protocol: f.protocol,
                        router: f.router,
                        farmType: f.farmType,
                        farmImpl: f.farmImpl,
                        asset: f.asset,
                        tvl: f.tvl,
                        apr: f.apr,
                        rewards: f.rewards,
                        allocPoint: f.allocPoint,
                        lastUpdatedAtUTC: f.lastUpdatedAtUTC,
                        safetyScore: f.totalScore,
                    }
                }
            })
        } else if (args?.chain !== undefined && args?.protocol == undefined) {
            console.log("c2", args?.chain);
            farms = dbFarms.filter((f: Farm) => {
                if (isChain(f, args?.chain))
                    return {
                        id: f.id,
                        chef: f.chef,
                        chain: f.chain,
                        protocol: f.protocol,
                        router: f.router,
                        farmType: f.farmType,
                        farmImpl: f.farmImpl,
                        asset: f.asset,
                        tvl: f.tvl,
                        apr: f.apr,
                        rewards: f.rewards,
                        allocPoint: f.allocPoint,
                        lastUpdatedAtUTC: f.lastUpdatedAtUTC,
                        safetyScore: f.totalScore,
                    }
            })
        } else if (args?.chain == undefined && args?.protocol !== undefined) {
            console.log("c3", args?.chain);
            farms = dbFarms.filter((f: Farm) => {
                if (isProtocol(f, args?.protocol))
                    return {
                        id: f.id,
                        chef: f.chef,
                        chain: f.chain,
                        protocol: f.protocol,
                        router: f.router,
                        farmType: f.farmType,
                        farmImpl: f.farmImpl,
                        asset: f.asset,
                        tvl: f.tvl,
                        apr: f.apr,
                        rewards: f.rewards,
                        allocPoint: f.allocPoint,
                        lastUpdatedAtUTC: f.lastUpdatedAtUTC,
                        safetyScore: f.totalScore,
                    }
            })
        } else {
            console.log("c1undef");
            farms = dbFarms.map((f: Farm) => {
                return {
                    id: f.id,
                    chef: f.chef,
                    chain: f.chain,
                    protocol: f.protocol,
                    router: f.router,
                    farmType: f.farmType,
                    farmImpl: f.farmImpl,
                    asset: f.asset,
                    tvl: f.tvl,
                    apr: f.apr,
                    rewards: f.rewards,
                    allocPoint: f.allocPoint,
                    lastUpdatedAtUTC: f.lastUpdatedAtUTC,
                    safetyScore: f.totalScore,
                }
            })
        }

        console.log("flen", farms.length);

        return farms
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
