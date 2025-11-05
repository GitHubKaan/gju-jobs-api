import { createClient } from 'redis';
import { CONSOLE } from './console.util';
import { ENV } from './envReader.util';
import { NodeEnv } from '../enums';

export const redis = createClient();

/**
 * Run Redis
 */
export async function runRedis() {
    try {
        await redis.connect();
        
        if (ENV.NODE_ENV !== NodeEnv.Testing) {
            CONSOLE.SUCCESS("Redis is online.");
        }
    } catch (error: any) {
        CONSOLE.ERROR("Redis is offline or not installed.");
    }
}