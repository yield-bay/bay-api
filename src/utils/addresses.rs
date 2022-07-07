use ethers::types::Address;

use std::collections::HashMap;

pub struct Contracts {
    pub i_solar_distributor_v2: Address,
}

pub fn contracts() -> Contracts {
    Contracts {
        i_solar_distributor_v2: "0x0329867a8c457e9F75e25b0685011291CD30904F"
            .parse::<Address>()
            .expect("fail"),
    }
}
