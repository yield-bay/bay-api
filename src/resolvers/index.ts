import { FarmsResolver } from "./farms.resolver"
import { XCMPTasksResolver, AddTaskResolver, UpdateTaskStatusResolver } from "./xcmpTasks.resolver"

export const resolvers = {
  Query: {
    farms: FarmsResolver,
    xcmpTasks: XCMPTasksResolver
  },
  Mutation: {
    addTask: AddTaskResolver,
    updateTaskStatus: UpdateTaskStatusResolver,
  }
}
