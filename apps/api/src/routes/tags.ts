import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { isValidHexColor } from "@openconduit/shared";

const tagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export async function tagRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.get("/", async () => {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  });

  app.post("/", async (request, reply) => {
    const parsed = tagSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    if (!isValidHexColor(parsed.data.color)) {
      return reply.status(400).send({ error: "Bad Request", message: "Invalid color format", statusCode: 400 });
    }

    try {
      const tag = await prisma.tag.create({ data: parsed.data });
      return reply.status(201).send(tag);
    } catch {
      return reply.status(409).send({ error: "Conflict", message: "Tag with this name already exists", statusCode: 409 });
    }
  });

  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const parsed = tagSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    try {
      const tag = await prisma.tag.update({
        where: { id: request.params.id },
        data: parsed.data,
      });
      return tag;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Tag not found", statusCode: 404 });
    }
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.tag.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Tag not found", statusCode: 404 });
    }
  });
}
