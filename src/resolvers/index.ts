import { LpTokenPricesResolver, TokenPricesResolver } from "./assets.resolver"
import { FarmsResolver } from "./farms.resolver"
import { CreateAutocompoundSetupEventResolver, AutocompoundSetupEventResolver, AutocompoundEventsResolver, XCMPTasksResolver, AddTaskResolver, UpdateTaskStatusResolver, CreateLiquidityEventResolver, CreateAutocompoundEventResolver, UpdateAutocompoundEventStatusResolver } from "./xcmpTasks.resolver"
import { CreateAddLiquidityEventResolver, CreateClaimRewardsEventResolver, CreateRemoveLiquidityEventResolver, CreateStakeEventResolver, CreateUnstakeEventResolver, CreateWalletConnectEventResolver } from "./tracking.resolver"

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
    createAddLiquidityEvent: CreateAddLiquidityEventResolver,
    createRemoveLiquidityEvent: CreateRemoveLiquidityEventResolver,
    createStakeEvent: CreateStakeEventResolver,
    createUnstakeEvent: CreateUnstakeEventResolver,
    createClaimRewardsEvent: CreateClaimRewardsEventResolver,
    addTask: AddTaskResolver,
    updateTaskStatus: UpdateTaskStatusResolver,
    createLiquidityEvent: CreateLiquidityEventResolver,
    createAutocompoundEvent: CreateAutocompoundEventResolver,
    updateAutocompoundEventStatus: UpdateAutocompoundEventStatusResolver,
    createAutocompoundSetupEvent: CreateAutocompoundSetupEventResolver,
    createWalletConnectEvent: CreateWalletConnectEventResolver,
  }
}
