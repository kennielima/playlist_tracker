import Redis from "ioredis";
import { REDIS_URL, UPSTASH_REDIS_URL } from "./config";

export const redis = new Redis(`${UPSTASH_REDIS_URL}`);