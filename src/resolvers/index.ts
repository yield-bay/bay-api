import Token from "../models/token"
import { collections } from "../services/database.service"
import { FarmsResolver } from "./farms.resolver"


export const resolvers = {
  Query: {
    farms: FarmsResolver
  },
}
