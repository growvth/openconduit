import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const templateSchema = z.object({
  name: z.string().min(1).max(100),
  body: z.string().min(1).max(4096),
  providerTemplateId: z.string().max(255).optional(),
  isApproved: z.boolean().optional(),
});

export async function templateRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.get("/", async () => {
    return prisma.messageTemplate.findMany({ orderBy: { name: "asc" } });
  });

  app.post("/", async (request, reply) => {
    const parsed = templateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const template = await prisma.messageTemplate.create({ data: parsed.data });
    return reply.status(201).send(template);
  });

  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const parsed = templateSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    try {
      const template = await prisma.messageTemplate.update({
        where: { id: request.params.id },
        data: parsed.data,
      });
      return template;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Template not found", statusCode: 404 });
    }
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.messageTemplate.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Template not found", statusCode: 404 });
    }
  });
}
