import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import jwt from "@fastify/jwt";
import { config } from "./config.js";
import { prisma, disconnectDb } from "./db.js";
import { authRoutes } from "./routes/auth.js";
import { contactRoutes } from "./routes/contacts.js";
import { messageRoutes } from "./routes/messages.js";
import { tagRoutes } from "./routes/tags.js";
import { pipelineRoutes } from "./routes/pipeline.js";
import { reminderRoutes } from "./routes/reminders.js";
import { templateRoutes } from "./routes/templates.js";
import { settingsRoutes } from "./routes/settings.js";
import { userRoutes } from "./routes/users.js";
import { webhookRoutes } from "./routes/webhooks.js";
import { conversationRoutes } from "./routes/conversations.js";

const app = Fastify({
  logger: {
    level: config.isProduction ? "info" : "debug",
  },
});

// Security plugins
await app.register(helmet, {
  contentSecurityPolicy: config.isProduction ? undefined : false,
});
await app.register(cors, {
  origin: config.isProduction ? config.publicUrl : config.corsOrigin,
  credentials: true,
});
await app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute",
});
await app.register(jwt, {
  secret: config.jwtSecret,
  sign: { expiresIn: config.jwtExpiry },
});

// Decorate with prisma
app.decorate("prisma", prisma);

// Register routes
await app.register(authRoutes, { prefix: "/api/v1/auth" });
await app.register(contactRoutes, { prefix: "/api/v1/contacts" });
await app.register(conversationRoutes, { prefix: "/api/v1/conversations" });
await app.register(messageRoutes, { prefix: "/api/v1/messages" });
await app.register(tagRoutes, { prefix: "/api/v1/tags" });
await app.register(pipelineRoutes, { prefix: "/api/v1/pipeline" });
await app.register(reminderRoutes, { prefix: "/api/v1/reminders" });
await app.register(templateRoutes, { prefix: "/api/v1/templates" });
await app.register(settingsRoutes, { prefix: "/api/v1/settings" });
await app.register(userRoutes, { prefix: "/api/v1/users" });
await app.register(webhookRoutes, { prefix: "/webhooks" });

// Health check
app.get("/health", async () => ({ status: "ok" }));

// Graceful shutdown
const shutdown = async () => {
  app.log.info("Shutting down...");
  await app.close();
  await disconnectDb();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server
try {
  await app.listen({ port: config.port, host: config.host });
  app.log.info(`Server running at http://${config.host}:${config.port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export { app };
