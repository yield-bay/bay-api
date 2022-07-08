// External Dependencies
import * as mongoDB from "mongodb"
import * as dotenv from "dotenv"

// Global Variables
export const collections: {
  tokens?: mongoDB.Collection
  pools?: mongoDB.Collection
  moonwell?: mongoDB.Collection
  solarbeam?: mongoDB.Collection
  // accounts?: mongoDB.Collection
  farms?: mongoDB.Collection

} = {}

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config()

  const dbConnUrl: string = process.env.DB_CONN_STRING!

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbConnUrl)

  await client.connect()

  const db: mongoDB.Db = client.db(process.env.DB_NAME)

  const tokensCollection: mongoDB.Collection = db.collection("tokens")
  const poolsCollection: mongoDB.Collection = db.collection("pools")
  const moonwellCollection: mongoDB.Collection = db.collection("moonwell")
  const solarbeamCollection: mongoDB.Collection = db.collection("solarbeam")
  // const accountsCollection: mongoDB.Collection = db.collection("accounts");
  const farmsCollection: mongoDB.Collection = db.collection("farms")


  collections.tokens = tokensCollection
  collections.pools = poolsCollection
  collections.moonwell = moonwellCollection
  collections.solarbeam = solarbeamCollection
  // collections.accounts = accountsCollection;
  collections.farms = farmsCollection

  console.log(`Successfully connected to database: ${db.databaseName}`)
}
