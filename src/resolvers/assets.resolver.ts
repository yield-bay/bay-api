import { collections } from "../services/database.service"
import Asset from "../models/asset"

export const LpTokenPricesResolver = async (parents: any, args: any, context: any) => {
    const protocols = args?.protocols
    console.log("protocols", protocols)

    try {
        const dbAssets: Asset[] = (await collections.assets?.find({
            isLP: true,
            // $or: [{ chain: "", protocol: "" }]
            $or: protocols
        }).toArray()) as unknown as Asset[]
        console.log("assets count", dbAssets.length)
        const lpTokenPrices = dbAssets.map((asset: Asset) => {
            return {
                chain: asset.chain,
                protocol: asset.protocol,
                symbol: asset.symbol,
                address: asset.address,
                price: asset.price,
            }
        })
        return lpTokenPrices
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const TokenPricesResolver = async (parents: any, args: any, context: any) => {
    const protocols = args?.protocols
    console.log("protocols", protocols)

    try {
        const dbAssets: Asset[] = (await collections.assets?.find({
            isLP: false,
            // $or: [{ chain: "", protocol: "" }]
            $or: protocols
        }).toArray()) as unknown as Asset[]
        console.log("assets count", dbAssets.length)
        const lpTokenPrices = dbAssets.map((asset: Asset) => {
            return {
                chain: asset.chain,
                protocol: asset.protocol,
                symbol: asset.symbol,
                address: asset.address,
                price: asset.price,
            }
        })
        return lpTokenPrices
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
