use dotenv::dotenv;
use juniper::{FieldResult, RootNode};
use mongodb::sync::Collection;
use mongodb::{bson::doc, sync::Client};
use serde::{Deserialize, Serialize};
use std::fmt;
use std::str::FromStr;

////
///
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
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

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum FarmType {
    StandardAmm,
    StableAmm,
    SingleStaking,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum FarmImplementation {
    Solidity,
    Ink,
    Pallet,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Token {
    name: String,
    address: String,
    symbol: String,
    decimals: i32,
    price: f64,
    logo: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Asset {
    name: String,
    address: String,
    tokens: Vec<Token>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize, Deserialize)]
pub enum Freq {
    Daily,
    Weekly,
    Monthly,
    Annually,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Reward {
    amount: f64,
    token: Token,
    value_usd: f64,
    freq: Freq,
}

#[derive(Clone)]
pub struct APR {
    farm: f64,
    trading: f64,
}

#[derive(Clone)]
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
//////
///
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

impl fmt::Display for Chain {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{:?}", self)
        // or, alternatively:
        // fmt::Debug::fmt(self, f)
    }
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
////
///
#[derive(Debug, Serialize, Deserialize)]
struct Todo {
    title: String,
    description: String,
    completed: bool,
}

fn connect_to_db() -> FieldResult<Client> {
    dotenv().ok();
    let db_url = std::env::var("MONGO_URI").expect("MONGO_URI must be set");
    let client = Client::with_uri_str(&db_url)?;
    return Ok(client);
}

#[juniper::object(description = "A farm")]
impl DBFarm {
    pub fn id(&self) -> i32 {
        self.id
    }
    pub fn chain(&self) -> String {
        self.chain.to_string()
    }
    pub fn protocol(&self) -> String {
        self.protocol.clone()
    }
}

#[juniper::object(description = "A todo")]
impl Todo {
    pub fn title(&self) -> &str {
        self.title.as_str()
    }

    pub fn description(&self) -> &str {
        self.description.as_str()
    }

    pub fn completed(&self) -> bool {
        self.completed
    }
}

pub struct QueryRoot;

#[juniper::object]
impl QueryRoot {
    fn todos() -> FieldResult<Vec<Todo>> {
        let client = connect_to_db()?;
        let collection = client.database("todos").collection("todos");
        let cursor = collection.find(None, None).unwrap();
        let mut todos = Vec::new();
        for result in cursor {
            todos.push(result?);
        }
        return Ok({ todos });
    }
    fn farms() -> FieldResult<Vec<DBFarm>> {
        let client = connect_to_db()?;
        let collection: Collection<DBFarm> = client.database("myFirstDatabase").collection("farms");
        let cursor = collection.find(None, None).unwrap();
        let mut farms = Vec::new();
        for result in cursor {
            farms.push(result?);
        }
        return Ok({ farms });
    }
}

pub struct MutationRoot;

#[derive(juniper::GraphQLInputObject, Debug, Clone)]
pub struct NewTodo {
    pub title: String,
    pub description: String,
    pub completed: bool,
}
#[juniper::object]
impl MutationRoot {
    fn create_todo(new_todo: NewTodo) -> FieldResult<Todo> {
        let client = connect_to_db()?;
        let collection = client.database("todos").collection("todos");
        let todo = doc! {
            "title": new_todo.title,
            "description": new_todo.description,
            "completed": new_todo.completed
        };
        let result = collection.insert_one(todo, None).unwrap();
        let id = result.inserted_id.as_object_id().unwrap().to_hex();
        let inserted_todo = collection
            .find_one(Some(doc! {"_id": id}), None)
            .unwrap()
            .unwrap();
        return Ok(Todo {
            title: inserted_todo
                .get("title")
                .unwrap()
                .as_str()
                .unwrap()
                .to_string(),
            description: inserted_todo
                .get("description")
                .unwrap()
                .as_str()
                .unwrap()
                .to_string(),
            completed: inserted_todo.get("completed").unwrap().as_bool().unwrap(),
        });
    }
}

pub type Schema = RootNode<'static, QueryRoot, MutationRoot>;

pub fn create_schema() -> Schema {
    return Schema::new(QueryRoot, MutationRoot);
}
