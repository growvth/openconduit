import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { config } from "../config.js";
import { isValidEmail } from "@openconduit/shared";

const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(["ADMIN", "AGENT"]),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(128).optional(),
  role: z.enum(["ADMIN", "AGENT"]).optional(),
});

export async function userRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", requireAdmin);

  app.get("/", async () => {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  });

  app.post("/", async (request, reply) => {
    const parsed = createUserSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    if (!isValidEmail(parsed.data.email)) {
      return reply.status(400).send({ error: "Bad Request", message: "Invalid email format", statusCode: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return reply.status(409).send({ error: "Conflict", message: "User with this email already exists", statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, config.bcryptCostFactor);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
        role: parsed.data.role,
      },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    return reply.status(201).send(user);
  });

  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const parsed = updateUserSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.email !== undefined) data.email = parsed.data.email;
    if (parsed.data.role !== undefined) data.role = parsed.data.role;
    if (parsed.data.password !== undefined) {
      data.passwordHash = await bcrypt.hash(parsed.data.password, config.bcryptCostFactor);
    }

    try {
      const user = await prisma.user.update({
        where: { id: request.params.id },
        data,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
      return user;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "User not found", statusCode: 404 });
    }
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    if (request.params.id === request.user.id) {
      return reply.status(400).send({ error: "Bad Request", message: "Cannot delete your own account", statusCode: 400 });
    }

    try {
      await prisma.user.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "User not found", statusCode: 404 });
    }
  });
}
