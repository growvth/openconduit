import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { normalizePhoneE164, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@openconduit/shared";

const createContactSchema = z.object({
  phone: z.string().min(7).max(16),
  name: z.string().min(1).max(255),
  notes: z.string().max(5000).optional(),
  tags: z.array(z.string().uuid()).optional(),
});

const updateContactSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(7).max(16).optional(),
  notes: z.string().max(5000).optional(),
  pipelineStageId: z.string().uuid().nullable().optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  optedIn: z.boolean().optional(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  search: z.string().optional(),
  tag: z.string().uuid().optional(),
  stage: z.string().uuid().optional(),
  assignee: z.string().uuid().optional(),
});

export async function contactRoutes(app: FastifyInstance): Promise<void> {
  app.addHook("preHandler", authenticate);

  // List contacts with filters
  app.get("/", async (request) => {
    const query = querySchema.parse(request.query);
    const where: Record<string, unknown> = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { phone: { contains: query.search } },
      ];
    }
    if (query.tag) {
      where.tags = { some: { tagId: query.tag } };
    }
    if (query.stage) {
      where.pipelineStageId = query.stage;
    }
    if (query.assignee) {
      where.assignedToId = query.assignee;
    }

    // Agent-level access: only see assigned contacts
    if (request.user.role === "AGENT") {
      where.assignedToId = request.user.id;
    }

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: {
          tags: { include: { tag: true } },
          pipelineStage: true,
          assignedTo: { select: { id: true, name: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.contact.count({ where }),
    ]);

    return { data, total, page: query.page, pageSize: query.pageSize };
  });

  // Get single contact
  app.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const contact = await prisma.contact.findUnique({
      where: { id: request.params.id },
      include: {
        tags: { include: { tag: true } },
        pipelineStage: true,
        assignedTo: { select: { id: true, name: true } },
        conversations: { orderBy: { updatedAt: "desc" }, take: 1 },
      },
    });

    if (!contact) {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }

    if (request.user.role === "AGENT" && contact.assignedToId !== request.user.id) {
      return reply.status(403).send({ error: "Forbidden", message: "Access denied", statusCode: 403 });
    }

    return contact;
  });

  // Create contact
  app.post("/", async (request, reply) => {
    const parsed = createContactSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const phone = normalizePhoneE164(parsed.data.phone);
    if (!phone) {
      return reply.status(400).send({ error: "Bad Request", message: "Invalid phone number format", statusCode: 400 });
    }

    const existing = await prisma.contact.findUnique({ where: { phone } });
    if (existing) {
      return reply.status(409).send({ error: "Conflict", message: "Contact with this phone number already exists", statusCode: 409 });
    }

    const contact = await prisma.contact.create({
      data: {
        phone,
        name: parsed.data.name,
        notes: parsed.data.notes,
        tags: parsed.data.tags
          ? { create: parsed.data.tags.map((tagId) => ({ tagId })) }
          : undefined,
      },
      include: { tags: { include: { tag: true } } },
    });

    return reply.status(201).send(contact);
  });

  // Update contact
  app.put<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const parsed = updateContactSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    const data: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) data.name = parsed.data.name;
    if (parsed.data.notes !== undefined) data.notes = parsed.data.notes;
    if (parsed.data.pipelineStageId !== undefined) data.pipelineStageId = parsed.data.pipelineStageId;
    if (parsed.data.assignedToId !== undefined) data.assignedToId = parsed.data.assignedToId;
    if (parsed.data.optedIn !== undefined) {
      data.optedIn = parsed.data.optedIn;
      if (parsed.data.optedIn) data.optedInAt = new Date();
    }

    if (parsed.data.phone !== undefined) {
      const phone = normalizePhoneE164(parsed.data.phone);
      if (!phone) {
        return reply.status(400).send({ error: "Bad Request", message: "Invalid phone number format", statusCode: 400 });
      }
      data.phone = phone;
    }

    try {
      const contact = await prisma.contact.update({
        where: { id: request.params.id },
        data,
        include: { tags: { include: { tag: true } }, pipelineStage: true },
      });
      return contact;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }
  });

  // Delete contact
  app.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    try {
      await prisma.contact.delete({ where: { id: request.params.id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }
  });

  // Get contact messages (conversation history)
  app.get<{ Params: { id: string } }>("/:id/messages", async (request, reply) => {
    const contact = await prisma.contact.findUnique({
      where: { id: request.params.id },
      include: {
        conversations: {
          include: {
            messages: { orderBy: { createdAt: "asc" } },
          },
        },
      },
    });

    if (!contact) {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }

    const messages = contact.conversations.flatMap((c) => c.messages);
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return messages;
  });

  // Add tags to contact
  app.post<{ Params: { id: string } }>("/:id/tags", async (request, reply) => {
    const schema = z.object({ tagIds: z.array(z.string().uuid()) });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    await prisma.contactTag.createMany({
      data: parsed.data.tagIds.map((tagId) => ({
        contactId: request.params.id,
        tagId,
      })),
      skipDuplicates: true,
    });

    // Auto-remove "Unknown" tag when a real tag is added
    const unknownTag = await prisma.tag.findUnique({ where: { name: "Unknown" } });
    if (unknownTag && !parsed.data.tagIds.includes(unknownTag.id)) {
      await prisma.contactTag.deleteMany({
        where: { contactId: request.params.id, tagId: unknownTag.id },
      });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: request.params.id },
      include: { tags: { include: { tag: true } } },
    });

    return contact;
  });

  // Remove tag from contact
  app.delete<{ Params: { id: string; tagId: string } }>("/:id/tags/:tagId", async (request, reply) => {
    try {
      await prisma.contactTag.delete({
        where: {
          contactId_tagId: {
            contactId: request.params.id,
            tagId: request.params.tagId,
          },
        },
      });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Tag assignment not found", statusCode: 404 });
    }
  });

  // Move contact to pipeline stage
  app.put<{ Params: { id: string } }>("/:id/stage", async (request, reply) => {
    const schema = z.object({ stageId: z.string().uuid().nullable() });
    const parsed = schema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: "Bad Request", message: parsed.error.message, statusCode: 400 });
    }

    try {
      const contact = await prisma.contact.update({
        where: { id: request.params.id },
        data: { pipelineStageId: parsed.data.stageId },
        include: { pipelineStage: true },
      });
      return contact;
    } catch {
      return reply.status(404).send({ error: "Not Found", message: "Contact not found", statusCode: 404 });
    }
  });
}
