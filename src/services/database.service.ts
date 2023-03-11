// External Dependencies
import * as mongoDB from "mongodb"
import * as dotenv from "dotenv"

// Global Variables
export const collections: {
  assets?: mongoDB.Collection
  farms?: mongoDB.Collection
  xcmpTasks?: mongoDB.Collection
} = {}

// Initialize Connection
export async function connectToDatabase() {
  dotenv.config()

  const dbConnUrl: string = process.env.DB_CONN_STRING!

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(dbConnUrl)

  await client.connect()

  const db: mongoDB.Db = client.db(process.env.DB_NAME)

  const assetsCollection: mongoDB.Collection = db.collection("assets")
  const farmsCollection: mongoDB.Collection = db.collection("farms")
  const xcmpTasksCollection: mongoDB.Collection = db.collection("xcmpTasks")


  collections.assets = assetsCollection
  collections.farms = farmsCollection
  collections.xcmpTasks = xcmpTasksCollection

  console.log(`Successfully connected to database: ${db.databaseName}`)
}
