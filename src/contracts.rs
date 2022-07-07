use ethers::middleware::SignerMiddleware;
use ethers::{
    abi::Abi,
    contract::Contract,
    providers::{Http, Provider},
    signers::LocalWallet,
    types::Address,
};
#[path = "./utils/abis/abis.rs"]
mod abis;
#[path = "./utils/addresses.rs"]
mod addresses;

fn get_solar_distributor(
    provider: &SignerMiddleware<Provider<Http>, LocalWallet>,
) -> Contract<&SignerMiddleware<Provider<Http>, LocalWallet>> {
    let abi_original: String = abis::solar_distributor();
    let abi: Abi = serde_json::from_str(&abi_original).expect("failed");
    let address: Address = (addresses::contracts()).i_solar_distributor_v2;
    let contract = Contract::new(address, abi, provider);
    return contract;
}

pub fn get_contracts(
    provider: &SignerMiddleware<Provider<Http>, LocalWallet>,
) -> Vec<Contract<&SignerMiddleware<Provider<Http>, LocalWallet>>> {
    // Vec<(
    //     Contract<&SignerMiddleware<Provider<Http>, LocalWallet>>,
    //     Address,
    // )>

    // let abi_original: String = abis::solar_distributor();
    // let abi: Abi = serde_json::from_str(&abi_original).expect("failed");

    // let mut contracts: Vec<(
    //     Contract<&SignerMiddleware<Provider<Http>, LocalWallet>>,
    //     Address,
    // )> = vec![];
    let mut contracts: Vec<Contract<&SignerMiddleware<Provider<Http>, LocalWallet>>> = vec![];

    let static_provider = &provider;

    let solar_distributor = get_solar_distributor(static_provider);
    // contracts.push((solar_distributor, solar_distributor.address()));
    contracts.push(solar_distributor);

    // for v in (addresses::contracts()).vaults.iter() {
    //     let va: Address = v.1.clone().i_bay_vault;
    //     let sa: Address = v.1.clone().i_strategy;

    //     let vac = Contract::new(va, abi.clone(), provider);
    //     let sac = Contract::new(sa, abi.clone(), provider);

    //     contracts.push((vac, sac, va, sa));
    // }

    return contracts;
}
