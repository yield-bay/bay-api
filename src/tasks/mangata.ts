import { Mangata } from '@mangata-finance/sdk';
import { BN } from 'bn.js';

import Farm from "../models/farm";

import { collections } from '../services/database.service';

import axios from 'axios';


export const runMangataTask = async () => {
    const MAINNET_1 = 'wss://mangata-x.api.onfinality.io/public-ws'
    const MAINNET_2 = 'wss://prod-kusama-collator-01.mangatafinance.cloud'
    const mangata = Mangata.getInstance([MAINNET_1, MAINNET_2])

    let assetsInfo = await mangata.getAssetsInfo()
    const balance40: any = await mangata.getAmountOfTokenIdInPool('4', '0')
    const balance07: any = await mangata.getAmountOfTokenIdInPool('0', '7')
    console.log(`\nbal(0, 7): ${balance07}\nbal(4, 0): ${balance40}`);

    let rwd_pools_count = 2

    let mgxDecimals: number = assetsInfo['0']['decimals']
    let ksmDecimals: number = assetsInfo['4']['decimals']
    let turDecimals: number = assetsInfo['7']['decimals']

    console.log("mgxDecimals", mgxDecimals, "turDecimals", turDecimals, "ksmDecimals", ksmDecimals);

    let mgxBal4_0: number = balance40[1] / 10 ** mgxDecimals // ksm_mgx
    let mgxBal0_7: number = balance07[0] / 10 ** mgxDecimals // mgx_tur

    console.log("mgxBal4_0", mgxBal4_0, "mgxBal0_7", mgxBal0_7);

    let ksm_mgx_apr = 100 * (300 * 10 ** 6 / rwd_pools_count) / (mgxBal4_0 * 2)
    let mgx_tur_apr = 100 * (300 * 10 ** 6 / rwd_pools_count) / (mgxBal0_7 * 2)

    console.log("ksm_mgx_apr", ksm_mgx_apr, "mgx_tur_apr", mgx_tur_apr);

    let b0 = balance40.toString().split(",")[0]
    let b1 = balance40.toString().split(",")[1]

    let c0 = balance07.toString().split(",")[0]
    let c1 = balance07.toString().split(",")[1]


    console.log("balance40[0]", balance40[0], "balance40[1]", balance40[1], "b0", new BN(b0), "b1", new BN(b1));



    const amountPool40 = await mangata.getAmountOfTokenIdInPool("4", "0");
    const ksmReserve40 = amountPool40[0];
    const mgxReserve40 = amountPool40[1];

    const mgxBuyPriceInKsm = await mangata.calculateBuyPrice(
        ksmReserve40,
        mgxReserve40,
        new BN((10 ** mgxDecimals).toString()) // 1mgx = 1_000_000_000_000_000_000
    );

    const amountPool07 = await mangata.getAmountOfTokenIdInPool("0", "7");
    const mgxReserve07 = amountPool07[0];
    const turReserve07 = amountPool07[1];

    const turBuyPriceInMgx = await mangata.calculateBuyPrice(
        mgxReserve07,
        turReserve07,
        new BN((10 ** turDecimals).toString()) // 1tur = 1_000_000_000_0
    );


    console.log("mgxBuyPriceInKsm", mgxBuyPriceInKsm, "turBuyPriceInMgx", turBuyPriceInMgx);

    // // fromBN method is used to display nice value
    // // 12 here means decimals for KSM
    // const mgxToKsm = fromBN(mgxBuyPriceInKsm, 12); // 1 mgx = ?? ksm
    const mgxInKsm = mgxBuyPriceInKsm.toNumber() / 10 ** ksmDecimals;

    const turInMgx = turBuyPriceInMgx.div(new BN((10 ** mgxDecimals).toString())).toNumber();
    const turInKsm = turInMgx * mgxInKsm;

    console.log(mgxInKsm, turInKsm, turInMgx);

    let cgkres = await axios.get("https://api.coingecko.com/api/v3/simple/price?ids=kusama&vs_currencies=usd")
    const ksmInUsd = cgkres?.data?.kusama?.usd ?? 35.66;
    console.log("ksmInUsd", ksmInUsd);

    // console.log("ksmres", parseInt(b0), parseInt(b0) / 10 ** ksmDecimals, "mgxres", parseInt(b1), parseInt(b1) / 10 ** mgxDecimals);

    console.log("ksm-mgx tvl: $", ksmInUsd * (parseInt(b0) / 10 ** ksmDecimals + (mgxInKsm * parseInt(b1) / 10 ** mgxDecimals)));
    console.log("mgx-tur tvl: $", ksmInUsd * (mgxInKsm * parseInt(c0) / 10 ** mgxDecimals + (turInKsm * parseInt(c1) / 10 ** turDecimals)));

    const rewards_per_day = ksmInUsd * mgxInKsm * (300 * 10 ** 6 / (2 * 365))
    console.log("rewards_per_day: $", rewards_per_day, "or ", (300 * 10 ** 6 / (2 * 365)), "mgx");

    collections.farms?.findOneAndUpdate({
        "id": 5,
        "chef": "xyk",
        "chain": "Kusama",
        "protocol": "Mangata X",
    }, {
        "$set": {
            "id": 5,
            "chef": "xyk",
            "chain": "Kusama",
            "protocol": "Mangata X",
            "farmType": "StandardAmm",
            "farmImpl": "Pallet",
            "asset": {
                "symbol": "KSM-MGX LP",
                "address": "KSM-MGX LP",
                "price": 0.0,
                "logos": [
                    "https://raw.githubusercontent.com/yield-bay/assets/main/list/KSM.png",
                    "https://raw.githubusercontent.com/yield-bay/assets/main/list/MGX.png",
                ],
            },
            "tvl": ksmInUsd * (parseInt(b0) / 10 ** ksmDecimals + (mgxInKsm * parseInt(b1) / 10 ** mgxDecimals)),
            "apr.reward": rewards_per_day,
            "apr.base": 0.0,
            "rewards": [
                {
                    "amount": (300 * 10 ** 6 / (2 * 365)),
                    "asset": "MGX",
                    "valueUSD": rewards_per_day,
                    "freq": "Daily",
                }
            ],
            "allocPoint": 1,
            "lastUpdatedAtUTC": new Date().toUTCString(),
        }
    }, {
        upsert: true
    }).then(r => {
        console.log("xyk 5");
    }).catch(e => {
        console.log("error xyk 5", e);

    })

    collections.farms?.findOneAndUpdate({
        "id": 8,
        "chef": "xyk",
        "chain": "Kusama",
        "protocol": "Mangata X",
    }, {
        "$set": {
            "id": 8,
            "chef": "xyk",
            "chain": "Kusama",
            "protocol": "Mangata X",
            "farmType": "StandardAmm",
            "farmImpl": "Pallet",
            "asset": {
                "symbol": "MGX-TUR LP",
                "address": "MGX-TUR LP",
                "price": 0.0,
                "logos": [
                    "https://raw.githubusercontent.com/yield-bay/assets/main/list/MGX.png",
                    "https://raw.githubusercontent.com/yield-bay/assets/main/list/TUR.png",
                ],
            },
            "tvl": ksmInUsd * (mgxInKsm * parseInt(c0) / 10 ** mgxDecimals + (turInKsm * parseInt(c1) / 10 ** turDecimals)),
            "apr.reward": rewards_per_day,
            "apr.base": 0.0,
            "rewards": [
                {
                    "amount": (300 * 10 ** 6 / (2 * 365)),
                    "asset": "MGX",
                    "valueUSD": rewards_per_day,
                    "freq": "Daily",
                }
            ],
            "allocPoint": 1,
            "lastUpdatedAtUTC": new Date().toUTCString(),
        }
    }, {
        upsert: true
    }).then(r => {
        console.log("xyk 8");
    }).catch(e => {
        console.log("error xyk 8", e);

    })
}
