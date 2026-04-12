import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const stageSchema = z.object({
  name: z.string().min(1).max(100),
  order: z.number().int().min(0),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export async function pipelineRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.get("/stages", async () => {
    return prisma.pipelineStage.findMany({ orderBy: { order: "asc" } });
  });

  app.post("/stages", { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = stageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const stage = await prisma.pipelineStage.create({ data: parsed.data });
    return reply.status(201).send(stage);
  });

  app.put<{ Params: { id: string } }>("/stages/:id", { preHandler: [requireAdmin] }, async (request, reply) => {
    const parsed = stageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    try {
      const stage = await prisma.pipelineStage.update({
        where: { id: request.params.id },
        data: parsed.data,
      });
      return stage;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Stage not found", statusCode: 404 });
    }
  });

  app.delete<{ Params: { id: string } }>("/stages/:id", { preHandler: [requireAdmin] }, async (request, reply) => {
    try {
      await prisma.pipelineStage.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Stage not found", statusCode: 404 });
    }
  });
}
