import { FarmsResolver } from "./farms.resolver"
import { AutocompoundEventsResolver, XCMPTasksResolver, AddTaskResolver, UpdateTaskStatusResolver, CreateLiquidityEventResolver, CreateAutocompoundEventResolver, UpdateAutocompoundEventStatusResolver } from "./xcmpTasks.resolver"

export const resolvers = {
  Query: {
    farms: FarmsResolver,
    xcmpTasks: XCMPTasksResolver,
    autocompoundEvents: AutocompoundEventsResolver,
  },
  Mutation: {
    addTask: AddTaskResolver,
    updateTaskStatus: UpdateTaskStatusResolver,
    createLiquidityEvent: CreateLiquidityEventResolver,
    createAutocompoundEvent: CreateAutocompoundEventResolver,
    updateAutocompoundEventStatus: UpdateAutocompoundEventStatusResolver,
  }
}
