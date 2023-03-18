import { collections } from "../services/database.service"
import Farm from "../models/farm"
import XCMPTask from "../models/xcmpTask"

export const XCMPTasksResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;

    try {
        let cur = collections.xcmpTasks?.find({ userAddress: userAddress, chain: chain })
        const allValues = await cur?.toArray();
        return allValues
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
export const AddTaskResolver = async (parents: any, args: any, context: any) => {
    const taskId = args?.taskId;
    const userAddress = args?.userAddress;
    const lpName = args?.lpName;
    const chain = args?.chain;
    try {
        let obj = {
            taskId: taskId,
            userAddress: userAddress,
            lpName: lpName,
            chain: chain,
            status: "RUNNING"
        }

        let res = await collections.xcmpTasks?.updateOne(
            obj,
            {
                $setOnInsert: obj
            },
            { upsert: true }
        )
        return obj;
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
export const UpdateTaskStatusResolver = async (parents: any, args: any, context: any) => {
    const taskId = args?.taskId;
    const userAddress = args?.userAddress;
    const lpName = args?.lpName;
    const chain = args?.chain;
    const newStatus = args?.newStatus;
    try {
        let obj = {
            taskId: taskId,
            userAddress: userAddress,
            lpName: lpName,
            chain: chain,
            status: newStatus
        }
        let res = await collections.xcmpTasks?.updateOne(
            {
                taskId: taskId,
                userAddress: userAddress,
                lpName: lpName,
                chain: chain
            },
            { $set: obj },
            { upsert: true }
        )
        return newStatus;
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}
