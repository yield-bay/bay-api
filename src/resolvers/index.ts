import { LpTokenPricesResolver, TokenPricesResolver } from "./assets.resolver"
import { FarmsResolver } from "./farms.resolver"
import { CreateAutocompoundSetupEventResolver, AutocompoundSetupEventResolver, AutocompoundEventsResolver, XCMPTasksResolver, AddTaskResolver, UpdateTaskStatusResolver, CreateLiquidityEventResolver, CreateAutocompoundEventResolver, UpdateAutocompoundEventStatusResolver } from "./xcmpTasks.resolver"

export const resolvers = {
  Query: {
    farms: FarmsResolver,
    lpTokenPrices: LpTokenPricesResolver,
    tokenPrices: TokenPricesResolver,
    xcmpTasks: XCMPTasksResolver,
    autocompoundEvents: AutocompoundEventsResolver,
    autocompoundSetupEvent: AutocompoundSetupEventResolver,
  },
  Mutation: {
    addTask: AddTaskResolver,
    updateTaskStatus: UpdateTaskStatusResolver,
    createLiquidityEvent: CreateLiquidityEventResolver,
    createAutocompoundEvent: CreateAutocompoundEventResolver,
    updateAutocompoundEventStatus: UpdateAutocompoundEventStatusResolver,
    createAutocompoundSetupEvent: CreateAutocompoundSetupEventResolver,
  }
}
