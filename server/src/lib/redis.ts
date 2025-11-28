import Redis from "ioredis";
import { REDIS_URL } from "./config";

export const redis = new Redis(`${REDIS_URL}`);

// export const redis = new Redis({
//     port: 6379,
//     host: "127.0.0.1",
// });
