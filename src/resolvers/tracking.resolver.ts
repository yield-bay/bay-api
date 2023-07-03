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
