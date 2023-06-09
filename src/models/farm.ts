interface Reward {
    amount: number
    asset: string
    valueUSD: number
    freq: string
}

interface UnderlyingAsset {
    symbol: string
    address: string
    decimals: number
}

export default interface Farm {
    id: number
    chef: string
    chain: string
    protocol: string
    router: string
    farmType: string
    farmImpl: string
    asset: {
        symbol: string
        address: string
        price: number
        logos: Array<string>
        underlyingAssets: Array<UnderlyingAsset>
    }
    tvl: number
    apr: {
        reward: number
        base: number
    }
    rewards: Array<Reward>
    allocPoint: number
    lastUpdatedAtUTC: string
    totalScore: number
    tvlScore: number
    baseAPRScore: number
    rewardAPRScore: number
    rewardsScore: number
}
