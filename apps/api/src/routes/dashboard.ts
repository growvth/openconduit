import { FastifyInstance } from "fastify";
import { startOfDay, subDays, format } from "date-fns";

export async function dashboardRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/", async () => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const weekAgoStart = startOfDay(subDays(now, 7));

    const [
      openConversations,
      totalContacts,
      remindersDueToday,
      pipelineStats,
      tagStats,
      messageStats,
      recentConversations,
    ] = await Promise.all([
      // 1. Basic Stats
      app.prisma.conversation.count({ where: { status: "OPEN" } }),
      app.prisma.contact.count(),
      app.prisma.reminder.count({
        where: {
          dueAt: { gte: todayStart, lt: startOfDay(subDays(todayStart, -1)) },
          completed: false,
        },
      }),

      // 2. Pipeline Stats (Funnel)
      app.prisma.pipelineStage.findMany({
        include: { _count: { select: { contacts: true } } },
        orderBy: { order: "asc" },
      }),

      // 3. Tag Stats (Top 5)
      app.prisma.tag.findMany({
        include: { _count: { select: { contacts: true } } },
        orderBy: { contacts: { _count: "desc" } },
        take: 5,
      }),

      // 4. Message Volume (Last 7 Days)
      app.prisma.message.groupBy({
        by: ["direction", "createdAt"],
        where: { createdAt: { gte: weekAgoStart } },
        _count: true,
      }),

      // 5. Recent Conversations
      app.prisma.conversation.findMany({
        where: { status: "OPEN" },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: {
          contact: {
            select: { name: true, phone: true },
          },
          messages: {
            take: 1,
            orderBy: { createdAt: "desc" },
            select: { body: true, createdAt: true },
          },
        },
      }),
    ]);

    // Process Message Stats for Charting
    const messageVolume = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(todayStart, 6 - i);
      const dateStr = format(date, "MMM dd");
      
      const dayMessages = messageStats.filter(m => 
        startOfDay(new Date(m.createdAt)).getTime() === date.getTime()
      );

      return {
        name: dateStr,
        inbound: dayMessages.filter(m => m.direction === "INBOUND").reduce((acc, m) => acc + m._count, 0),
        outbound: dayMessages.filter(m => m.direction === "OUTBOUND").reduce((acc, m) => acc + m._count, 0),
      };
    });

    return {
      stats: {
        openConversations,
        totalContacts,
        remindersDueToday,
      },
      pipeline: pipelineStats.map(s => ({
        name: s.name,
        value: s._count.contacts,
      })),
      tags: tagStats.map(t => ({
        name: t.name,
        value: t._count.contacts,
      })),
      messageVolume,
      recentConversations: recentConversations.map(c => ({
        id: c.id,
        contactName: c.contact.name,
        phone: c.contact.phone,
        lastMessage: c.messages[0]?.body ?? "No messages",
        time: c.messages[0]?.createdAt ?? c.updatedAt,
      })),
    };
  });
}
