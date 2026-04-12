import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@openconduit/shared";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  status: z.enum(["OPEN", "RESOLVED", "PENDING"]).optional(),
});

export async function conversationRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  // List conversations
  app.get("/", async (request) => {
    const query = querySchema.parse(request.query);
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (request.user.role === "AGENT") {
      where.assignedToId = request.user.id;
    }

    const [data, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: {
          contact: { select: { id: true, name: true, phone: true } },
          assignedTo: { select: { id: true, name: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.conversation.count({ where }),
    ]);

    return { data, total, page: query.page, pageSize: query.pageSize };
  });

  // Get conversation with messages
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const conversation = await prisma.conversation.findUnique({
      where: { id: request.params.id },
      include: {
        contact: true,
        assignedTo: { select: { id: true, name: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!conversation) {
      return reply.status(404).send({ error: "Not Found", message: "Conversation not found", statusCode: 404 });
    }

    if (request.user.role === "AGENT" && conversation.assignedToId !== request.user.id) {
      return reply.status(403).send({ error: "Forbidden", message: "Access denied", statusCode: 403 });
    }

    return conversation;
  });

  // Update conversation status
  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const schema = z.object({
      status: z.enum(["OPEN", "RESOLVED", "PENDING"]).optional(),
      assignedToId: z.string().uuid().nullable().optional(),
    });

    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    try {
      const conversation = await prisma.conversation.update({
        where: { id: request.params.id },
        data: parsed.data,
        include: {
          contact: { select: { id: true, name: true, phone: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      });
      return conversation;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Conversation not found", statusCode: 404 });
    }
  });
}
