import Token from "./token"

export default interface Reward {
    amount: number
    token: Token
    value_usd: number
    freq: string
}

enum Chain {
    Moonriver,
    Moonbeam
}

export default interface Farm {
    chain: string
    id: number
    protocol: string
    apr: {
        farm: number
        trading: number
        reward: number
        base: number
    }
    asset: {
        name: string
        address: string
        tokens: Array<Token>
    }
    farm_implementation: string
    farm_type: string
    rewards: Array<Reward>
    tvl: number
    url: string
}


