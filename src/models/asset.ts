interface UnderlyingAsset {
    symbol: string
    address: string
    decimals: number
}
export default interface Asset {
    address: string
    chain: string
    protocol: string
    name: string
    symbol: string
    decimals: number
    logos: Array<string>
    price: number
    liquidity: number
    totalSupply: number
    isLP: boolean
    feesAPR: number
    underlyingAssets: Array<UnderlyingAsset>
    underlyingAssetsAlloc: Array<number>
    lastUpdatedAtUTC: string
}
