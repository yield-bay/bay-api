import { collections } from "../services/database.service"
import Farm from "../models/farm"
import XCMPTask from "../models/xcmpTask"

export const AutocompoundSetupEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;
    const lpName = args?.lpName;
    const timestamp = args?.timestamp;

    try {
        let cur = collections.autocompoundSetupEvents?.find({ userAddress: userAddress, chain: chain, lpName: lpName, timestamp: timestamp })
        const allValues = await cur?.toArray();
        if (allValues !== undefined) {
            return allValues[0];
        }
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const CreateAutocompoundSetupEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;
    const lpName = args?.lpName;
    const timestamp = args?.timestamp;

    let obj = { userAddress: userAddress, chain: chain, lpName: lpName, timestamp: timestamp };
    try {
        let res = collections.autocompoundSetupEvents?.insertOne(obj)
        return obj;
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const AutocompoundEventsResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;

    try {
        let cur = collections.autocompoundEvents?.find({ userAddress: userAddress, chain: chain, status: {$eq: "RUNNING" } })
        const allValues = await cur?.toArray();
        return allValues
    } catch (error: any) {
        console.log(error.message)
        return JSON.stringify({
            error: error.message
        })
    }
}

export const XCMPTasksResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;

    try {
        let cur = collections.xcmpTasks?.find({ userAddress: userAddress, chain: chain, status: {$eq: "RUNNING" } })
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
            // taskId: taskId,
            // userAddress: userAddress,
            // lpName: lpName,
            // chain: chain,
            status: newStatus
        }
        let res = await collections.xcmpTasks?.findOneAndUpdate(
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


export const CreateLiquidityEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;
    const token0 = args?.token0;
    const token1 = args?.token1;
    const lp = args?.lp;
    const timestamp = args?.timestamp;
    const gasFee = args?.gasFee;
    const eventType = args?.eventType;
    console.log("args.lp", lp);

    try {
        let obj = {
            userAddress: userAddress,
            chain: chain,
            token0: token0,
            token1: token1,
            lp: lp,
            timestamp: timestamp,
            gasFee: gasFee,
            eventType: eventType,
        }

        let res = await collections.liquidityEvents?.updateOne(
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
export const CreateAutocompoundEventResolver = async (parents: any, args: any, context: any) => {
    const userAddress = args?.userAddress;
    const chain = args?.chain;
    const taskId = args?.taskId;
    const lp = args?.lp;
    const duration = args?.duration;
    const frequency = args?.frequency;
    const timestamp = args?.timestamp;
    const executionFee = args?.executionFee;
    const xcmpFee = args?.xcmpFee;
    const status = args?.status;
    const eventType = args?.eventType;
    const percentage = args?.percentage;
    console.log("args.lp", lp);

    try {
        let obj = {
            userAddress: userAddress,
            chain: chain,
            taskId: taskId,
            lp: lp,
            duration: duration,
            frequency: frequency,
            timestamp: timestamp,
            executionFee: executionFee,
            xcmpFee: xcmpFee,
            status: status,
            eventType: eventType,
            percentage: percentage,
        }

        let res = await collections.autocompoundEvents?.updateOne(
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
export const UpdateAutocompoundEventStatusResolver = async (parents: any, args: any, context: any) => {
    const taskId = args?.taskId;
    const userAddress = args?.userAddress;
    const lpName = args?.lpName;
    const chain = args?.chain;
    const newStatus = args?.newStatus;
    try {
        let obj = {
            // taskId: taskId,
            // userAddress: userAddress,
            // lpName: lpName,
            // chain: chain,
            status: newStatus
        }
        let res = await collections.autocompoundEvents?.findOneAndUpdate(
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