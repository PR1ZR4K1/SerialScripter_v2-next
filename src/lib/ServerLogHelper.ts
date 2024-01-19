'use server';

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma'; 

export async function createLogEntry({email, success, module, message}: Prisma.ServerLogCreateInput) {
    
    try {
        await prisma.serverLog.create({
            data: {
                email,
                success,
                module,
                message,
            },
        });
        console.log('tried to add server log!')
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.message) {
                console.log(error.message);
            }
        } else {
            console.log(error);
        }
    }
}

export async function getServerLogs(): Promise<Prisma.ServerLogCreateManyInput[]> {
    try {
        const logs = await prisma.serverLog.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return logs;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.message) {
                return [{email: error.message, success: false, module: 'getServerLogs', message: 'Failed to get server logs'}];
            }
        } else {
            return [{email: 'error', success: false, module: 'getServerLogs', message: 'Failed to get server logs'}];
        }
    }
    return []; // Add a return statement with a default value of an empty array
}
