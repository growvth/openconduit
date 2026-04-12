import { JWT_EXPIRY, BCRYPT_COST_FACTOR } from "@openconduit/shared";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const config = {
  port: parseInt(optionalEnv("PORT", "3000"), 10),
  host: optionalEnv("HOST", "0.0.0.0"),
  databaseUrl: requireEnv("DATABASE_URL"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiry: JWT_EXPIRY,
  bcryptCostFactor: BCRYPT_COST_FACTOR,
  publicUrl: optionalEnv("PUBLIC_URL", "http://localhost:3000"),
  redisUrl: optionalEnv("REDIS_URL", "redis://localhost:6379"),
  nodeEnv: optionalEnv("NODE_ENV", "development"),
  isProduction: optionalEnv("NODE_ENV", "development") === "production",
  corsOrigin: optionalEnv("CORS_ORIGIN", "http://localhost:5173"),
} as const;
