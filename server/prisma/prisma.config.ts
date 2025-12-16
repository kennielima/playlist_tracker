import 'dotenv/config'
import type { PrismaConfig } from "./config";
import { env } from "./config";

export default {
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: 'tsx prisma/seed.ts',
        initShadowDb: env("DATABASE_URL")
    },
    datasource: {
        url: env("DATABASE_URL")
    }
} satisfies PrismaConfig;