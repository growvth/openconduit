import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { isValidEmail } from "@openconduit/shared";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function authRoutes(app: FastifyInstance): Promise<void> {
  app.post("/login", async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Invalid email or password format",
        statusCode: 400,
      });
    }

    const { email, password } = parsed.data;

    if (!isValidEmail(email)) {
      return reply.status(400).send({
        error: "Bad Request",
        message: "Invalid email format",
        statusCode: 400,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "Invalid credentials",
        statusCode: 401,
      });
    }

    const token = app.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  });

  app.post("/logout", { preHandler: [authenticate] }, async () => {
    return { message: "Logged out" };
  });

  app.get("/me", { preHandler: [authenticate] }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return user;
  });
}
