interface FarmPruned {
    id: number
    chef: string
    chain: string
    protocol: string
    assetSymbol: string
}

interface Amount {
    amount: number
    asset: string
    valueUSD: number
}

export default interface UnstakeEvent {
    userAddress: string
    walletType: string
    walletProvider: string
    timestamp: string
    farm: FarmPruned
    lpAmount: Amount
}
