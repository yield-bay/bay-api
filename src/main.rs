#![feature(decl_macro, proc_macro_hygiene)]

use rocket::response::content;
use rocket::State;

// use juniper::tests::fixtures::starwars::schema::{Database, Query};
use juniper::{Context, EmptyMutation, EmptySubscription, GraphQLEnum, RootNode};
#[macro_use]
extern crate juniper;

///

#[derive(GraphQLEnum, Clone, Copy, Debug, Eq, PartialEq)]
pub enum Chain {
    Moonriver,
    Moonbeam,
}

#[derive(Default, Clone)]
pub struct Database {
    farms: Vec<String>,
}

impl Context for Database {}

impl Database {
    pub fn new() -> Database {
        let mut farms = vec!["SOLAR-MOVR".to_owned()];
        farms.push("GLMR-USDC".to_owned());

        Database { farms }
    }

    pub fn get_farms(&self) -> Option<Vec<String>> {
        Some(self.farms.clone())
    }
}

pub struct Query;

#[graphql_object(context = Database)]
/// The root query object of the schema
impl Query {
    fn farms(#[graphql(context)] database: &Database) -> Option<Vec<String>> {
        database.get_farms()
    }
}

///

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
