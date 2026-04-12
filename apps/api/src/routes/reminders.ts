import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const reminderSchema = z.object({
  contactId: z.string().uuid(),
  note: z.string().min(1).max(2000),
  dueAt: z.string().datetime(),
});

const updateReminderSchema = z.object({
  note: z.string().min(1).max(2000).optional(),
  dueAt: z.string().datetime().optional(),
  completed: z.boolean().optional(),
});

export async function reminderRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  app.get("/", async (request) => {
    const filter = (request.query as Record<string, string>).filter;
    const where: Record<string, unknown> = { userId: request.user.id };

    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    if (filter === "today") {
      where.dueAt = { lte: endOfDay };
      where.completed = false;
    } else if (filter === "overdue") {
      where.dueAt = { lt: now };
      where.completed = false;
    } else if (filter === "upcoming") {
      where.dueAt = { gt: endOfDay };
      where.completed = false;
    }

    return prisma.reminder.findMany({
      where,
      include: { contact: { select: { id: true, name: true, phone: true } } },
      orderBy: { dueAt: "asc" },
    });
  });

  app.post("/", async (request, reply) => {
    const parsed = reminderSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const reminder = await prisma.reminder.create({
      data: {
        contactId: parsed.data.contactId,
        userId: request.user.id,
        note: parsed.data.note,
        dueAt: new Date(parsed.data.dueAt),
      },
      include: { contact: { select: { id: true, name: true, phone: true } } },
    });

    return reply.status(201).send(reminder);
  });

  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const parsed = updateReminderSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.note !== undefined) data.note = parsed.data.note;
    if (parsed.data.dueAt !== undefined) data.dueAt = new Date(parsed.data.dueAt);
    if (parsed.data.completed !== undefined) data.completed = parsed.data.completed;

    try {
      const reminder = await prisma.reminder.update({
        where: { id: request.params.id, userId: request.user.id },
        data,
        include: { contact: { select: { id: true, name: true, phone: true } } },
      });
      return reminder;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Reminder not found", statusCode: 404 });
    }
  });

  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.reminder.delete({
        where: { id: request.params.id, userId: request.user.id },
      });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Reminder not found", statusCode: 404 });
    }
  });
}
