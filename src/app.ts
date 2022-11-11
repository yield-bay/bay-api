import { createServer } from "http"
import { ApolloServer } from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import express from "express"
import { resolvers } from "./resolvers/index"
import { connectToDatabase } from "./services/database.service"
import { readFileSync } from "fs"
import NodeCache from "node-cache"
import { runMangataTask } from "./tasks/mangata"

const gqlSchema = readFileSync("./src/schema.graphql").toString("utf-8")

async function fun() {
  console.log("hello worldlskfsdjfkdsjfksj")
}
async function startApolloServer(typeDefs: any, resolvers: any) {
  const corsOptions = {
    origin: "*",
    credentials: false
  }
  const app = express()

  app.use(express.json({ limit: "50mb" }))

  const httpServer = createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()

  server.applyMiddleware({ app, cors: corsOptions })

  await new Promise((resolve: any) => {
    const listener = httpServer.listen({ port: 4000 }, resolve)
    return listener
  })

  await runMangataTask()

  setInterval(runMangataTask, 1000 * 60 * 5) // every 5 min

  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}


export const cache = new NodeCache({ stdTTL: 15 })

connectToDatabase()
  .then(() => {
    startApolloServer(gqlSchema, resolvers)
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error)
    process.exit()
  })
