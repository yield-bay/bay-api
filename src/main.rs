#![feature(decl_macro, proc_macro_hygiene)]

use rocket::response::content;
use rocket::State;

// use juniper::tests::fixtures::starwars::schema::{Database, Query};
use juniper::{Context, EmptyMutation, EmptySubscription, GraphQLEnum, RootNode};
#[macro_use]
extern crate juniper;

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum Chain {
    Moonriver,
    Moonbeam,
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum FarmType {
    StandardAmm,
    StableAmm,
    SingleStaking,
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum FarmImplementation {
    Solidity,
    Ink,
    Pallet,
}

#[derive(GraphQLObject, Clone)]
pub struct Token {
    name: String,
    address: String,
    symbol: String,
    decimals: i32,
    price: f64,
    logo: String,
}

#[derive(GraphQLObject, Clone)]
pub struct Asset {
    name: String,
    address: String,
    tokens: Vec<Token>,
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum Freq {
    Daily,
    Weekly,
    Monthly,
    Annually,
}

#[derive(GraphQLObject, Clone)]
pub struct Reward {
    amount: f64,
    token: Token,
    value_usd: f64,
    freq: Freq,
}

#[derive(GraphQLObject, Clone)]
pub struct APR {
    farm: f64,
    trading: f64,
}

#[derive(GraphQLObject, Clone)]
pub struct Farm {
    chain: Chain,
    protocol: String,
    farm_type: FarmType,
    farm_implementation: FarmImplementation,
    asset: Asset,
    id: i32,
    tvl: f64,
    rewards: Vec<Reward>,
    apr: APR,
    url: String,
}

#[derive(Default, Clone)]
pub struct Database {
    farms: Vec<Farm>,
}

impl Context for Database {}

impl Database {
    pub fn new() -> Database {
        let farms = vec![Farm {
            chain: Chain::Moonriver,
            protocol: String::from("Solarbeam"),
            farm_type: FarmType::StandardAmm,
            farm_implementation: FarmImplementation::Solidity,
            asset: Asset {
                name: "SOLAR-MOVR".to_owned(),
                address: "0x7eDA899b3522683636746a2f3a7814e6fFca75e1".to_owned(),
                tokens: vec![
                    Token {
                        name: "SolarBeam Token".to_owned(),
                        address: "0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B".to_owned(),
                        symbol: "SOLAR".to_owned(),
                        decimals: 18,
                        price: 0.10,
                        logo: "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/logo.png".to_owned(),
                    },
                    Token {
                        name: "Wrapped MOVR".to_owned(),
                        address: "0x98878B06940aE243284CA214f92Bb71a2b032B8A".to_owned(),
                        symbol: "WMOVR".to_owned(),
                        decimals: 18,
                        price: 12.23,
                        logo: "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x98878B06940aE243284CA214f92Bb71a2b032B8A/logo.png".to_owned(),
                    },
                ],
            },
            id: 18,
            tvl: 545730.0,
            rewards: vec![
                Reward {
                    amount: 6714.0,
                    token: Token {
                        name: "SolarBeam Token".to_owned(),
                        address: "0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B".to_owned(),
                        symbol: "SOLAR".to_owned(),
                        decimals: 18,
                        price: 0.10,
                        logo: "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x6bD193Ee6D2104F14F94E2cA6efefae561A4334B/logo.png".to_owned(),
                    },
                    value_usd: 6714.0 * 0.10,
                    freq: Freq::Daily,
                },
                Reward {
                    amount: 32.20,
                    token: Token {
                        name: "Wrapped MOVR".to_owned(),
                        address: "0x98878B06940aE243284CA214f92Bb71a2b032B8A".to_owned(),
                        symbol: "WMOVR".to_owned(),
                        decimals: 18,
                        price: 12.23,
                        logo: "https://raw.githubusercontent.com/solarbeamio/solarbeam-tokenlist/main/assets/moonriver/0x98878B06940aE243284CA214f92Bb71a2b032B8A/logo.png".to_owned(),
                    },
                    value_usd: 32.20 * 12.23,
                    freq: Freq::Daily,
                },
            ],
            apr: APR {
                farm: 72.98,
                trading: 0.64,
            },
            url: String::from("https://app.solarbeam.io/farm"),
        }];

        Database { farms }
    }

    pub fn get_farms(&self) -> Option<Vec<Farm>> {
        Some(self.farms.clone())
    }
}

pub struct Query;

#[graphql_object(context = Database)]
/// The root query object of the schema
impl Query {
    fn farms(#[graphql(context)] database: &Database) -> Option<Vec<Farm>> {
        database.get_farms()
    }
}

type Schema = RootNode<'static, Query, EmptyMutation<Database>, EmptySubscription<Database>>;

#[rocket::get("/")]
fn graphiql() -> content::RawHtml<String> {
    juniper_rocket::graphiql_source("/graphql", None)
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    context: &State<Database>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[rocket::post("/graphql", data = "<request>")]
fn post_graphql_handler(
    context: &State<Database>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[rocket::main]
async fn main() {
    let _ = rocket::build()
        .manage(Database::new())
        .manage(Schema::new(
            Query,
            EmptyMutation::<Database>::new(),
            EmptySubscription::<Database>::new(),
        ))
        .mount(
            "/",
            rocket::routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch()
        .await
        .expect("server to launch");
}
