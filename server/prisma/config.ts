export declare type PrismaConfig = {

    // Whether features with an unstable API are enabled.
    experimental?: {
        externalTables: boolean;
    },

    // The path to the schema file, or path to a folder that shall be recursively searched for *.prisma files.
    schema?: string;

    // Configuration for Prisma migrations.
    migrations?: {
        path: string;
        seed: string;
        initShadowDb: string;
    };

    // Configuration for the database view entities.
    views?: {
        path: string;
    };

    // Configuration for the `typedSql` preview feature.
    typedSql?: {
        path: string;
    };

    // Database connection configuration
    datasource?: {
        url: string;
        shadowDatabaseUrl?: string;
    }

};

// Helper function to get environment variables
export function env(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not defined`);
    }
    return value;
}