import Redis from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL);

export const GENERATED_METADATA_KEY = (url: string) =>
  `generated-metadata-${url}`;

export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7;
