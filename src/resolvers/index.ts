import { FarmsResolver } from "./farms.resolver"

export const resolvers = {
  Query: {
    farms: FarmsResolver
  },
}
