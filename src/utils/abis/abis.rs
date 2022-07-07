#[path = "./ISolarDistributorV2ABI.rs"]
mod solar_distributor;

pub fn solar_distributor() -> String {
    return solar_distributor::i_solar_distributor_v2_abi();
}
