#![feature(decl_macro, proc_macro_hygiene)]

use dotenv::dotenv;
use futures::stream::TryStreamExt;
use futures::TryFutureExt;
use mongodb::{
    bson::{bson, doc, Array, Bson, Document},
    options::{ClientOptions, FindOneAndUpdateOptions},
    Client, Database,
};
use std::{convert::TryFrom, fmt, sync::Arc};

use rocket::response::content;
use rocket::State;
use serde::{Deserialize, Serialize};
// use juniper::tests::fixtures::starwars::schema::{Database, Query};
use juniper::{Context, EmptyMutation, EmptySubscription, GraphQLEnum, RootNode};
#[macro_use]
extern crate juniper;
// extern crate mongodb;

use std::str::FromStr;

mod db;

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum Chain {
    Moonriver,
    Moonbeam,
}

impl FromStr for Chain {
    type Err = ();

    fn from_str(input: &str) -> Result<Chain, Self::Err> {
        match input {
            "moonriver" => Ok(Chain::Moonriver),
            "moonbeam" => Ok(Chain::Moonbeam),
            _ => Err(()),
        }
    }
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum FarmType {
    StandardAmm,
    StableAmm,
    SingleStaking,
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum FarmImplementation {
    Solidity,
    Ink,
    Pallet,
}

#[derive(GraphQLObject, Clone, Debug, Serialize, Deserialize)]
pub struct Token {
    name: String,
    address: String,
    symbol: String,
    decimals: i32,
    price: f64,
    logo: String,
}

#[derive(GraphQLObject, Debug, Serialize, Deserialize, Clone)]
pub struct Asset {
    name: String,
    address: String,
    tokens: Vec<Token>,
}

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum Freq {
    Daily,
    Weekly,
    Monthly,
    Annually,
}

#[derive(GraphQLObject, Debug, Serialize, Deserialize, Clone)]
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
pub struct MDatabase {
    farms: Vec<Farm>,
}

impl Context for MDatabase {}

impl MDatabase {
    pub fn new() -> MDatabase {
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

        MDatabase { farms }
    }

    // pub fn get_farms(&self, db: &State<Database>) -> Option<Vec<Farm>> {
    pub fn get_farms(&self) -> Option<Vec<Farm>> {
        // let farms_collection = db.collection::<Farm>("farms");

        Some(self.farms.clone())
    }
}

// #[derive(Default, Clone)]
pub struct RootDatabase {
    mongo: Database,
}

impl Context for RootDatabase {}
impl RootDatabase {}

pub struct PrimaryDB(Database);
impl Context for PrimaryDB {}
impl PrimaryDB {}

pub struct Query;

// #[graphql_object(context = RootDatabase)]
// #[graphql_object(context = MDatabase)]
// #[graphql_object(context = PrimaryDB)]
// impl Query {
//     // fn farms(#[graphql(context)] mdatabase: &MDatabase) -> Option<Vec<Farm>> {
//     //     mdatabase.get_farms()
//     // }
//     fn farms(#[graphql(context)] pdb: &PrimaryDB) {}
// }

// #[graphql_object(context = Database)]
// impl Query {
//     async fn farms(#[graphql(context)] database: &Database)  {
//     }
// }

// mongodb
#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
enum DBFarmType {
    StandardAmm,
    StableAmm,
    SingleStaking,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum DBFarmImplementation {
    Solidity,
    Ink,
    Pallet,
}

impl fmt::Display for FarmType {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
}

impl fmt::Display for FarmImplementation {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DBToken {
    name: String,
    address: String,
    symbol: String,
    decimals: i32,
    price: f64,
    logo: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DBAsset {
    name: String,
    address: String,
    tokens: Vec<Token>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub enum DBFreq {
    Daily,
    Weekly,
    Monthly,
    Annually,
}

impl fmt::Display for DBFreq {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DBReward {
    amount: f64,
    token: DBToken,
    value_usd: f64,
    freq: DBFreq,
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy)]
pub struct DBAPR {
    farm: f64,
    trading: f64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
struct DBFarm {
    chain: String,
    protocol: String,
    farm_type: FarmType,
    farm_implementation: FarmImplementation,
    asset: DBAsset,
    id: i32,
    tvl: f64,
    rewards: Vec<Reward>,
    apr: DBAPR,
    url: String,
}
#[graphql_object(context = MDatabase)]
impl Query {
    async fn farms(#[graphql(context)] database: &MDatabase) -> Option<Vec<Farm>> {
        dotenv().ok();

        // Parse a connection string into an options struct.
        let mongo_uri = dotenv::var("MONGO_URI").unwrap();
        println!("mongo_uri: {}", mongo_uri);

        // Parse a connection string into an options struct.
        let mut client_options = ClientOptions::parse(mongo_uri).await.unwrap();

        // Manually set an option.
        client_options.app_name = Some("My App".to_string());

        // Get a handle to the deployment.
        let client = Client::with_options(client_options).unwrap();

        // Get a handle to a database.
        let db = client.database("myFirstDatabase");

        let farms_collection = db.collection::<DBFarm>("farms");
        let mut cursor = farms_collection.find(None, None).await.unwrap();

        let mut fs = vec![];
        while let Some(farm) = cursor.try_next().await.unwrap() {
            println!("f: {:?}, {:?}, {:?}", farm, farm.apr, farm.chain.clone());
            let c = Chain::from_str(&farm.chain.clone()).unwrap(); //_or(Chain::Moonriver);
            fs.push(Farm {
                chain: c,
                protocol: farm.protocol,
                farm_type: farm.farm_type,
                farm_implementation: farm.farm_implementation,
                asset: Asset {
                    name: farm.asset.name,
                    address: farm.asset.address,
                    tokens: farm.asset.tokens,
                },
                id: farm.id,
                tvl: farm.tvl,
                rewards: farm.rewards,
                apr: APR {
                    farm: farm.apr.farm,
                    trading: farm.apr.trading,
                },
                url: farm.url,
            })
        }
        // while cursor.advance().await.unwrap() {
        //     println!("cur: {:?}", cursor.current());
        // }

        Some(fs)
        // database.get_farms()
    }
}

type Schema = RootNode<'static, Query, EmptyMutation<MDatabase>, EmptySubscription<MDatabase>>;
// type Schema = RootNode<'static, Query, EmptyMutation<Database>, EmptySubscription<Database>>;

#[rocket::get("/")]
fn graphiql() -> content::RawHtml<String> {
    juniper_rocket::graphiql_source("/graphql", None)
}

#[rocket::get("/graphql?<request>")]
fn get_graphql_handler(
    context: &State<MDatabase>,
    // context: &State<PrimaryDB>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute_sync(&*schema, &*context)
}

#[rocket::post("/graphql", data = "<request>")]
async fn post_graphql_handler(
    // database: &State<Database>,
    // context: &Database,
    context: &State<MDatabase>,
    // context: &State<PrimaryDB>,
    request: juniper_rocket::GraphQLRequest,
    schema: &State<Schema>,
) -> juniper_rocket::GraphQLResponse {
    request.execute(&*schema, &*context).await
    // request.execute_sync(&*schema, &*context)
}

#[rocket::main]
async fn main() {
    dotenv().ok();

    let _ = rocket::build()
        // .attach(db::init())
        .manage(MDatabase::new())
        .manage(Schema::new(
            Query,
            EmptyMutation::<MDatabase>::new(),
            EmptySubscription::<MDatabase>::new(),
        ))
        .mount(
            "/",
            rocket::routes![graphiql, get_graphql_handler, post_graphql_handler],
        )
        .launch()
        .await
        .expect("server to launch");
}
