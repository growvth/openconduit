import { FastifyRequest, FastifyReply } from "fastify";
import { UserRole } from "@openconduit/shared";

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  try {
    await request.jwtVerify();
  } catch {
    reply.status(401).send({ error: "Unauthorized", message: "Invalid or expired token", statusCode: 401 });
  }
}

export async function requireAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  await authenticate(request, reply);
  if (request.user?.role !== "ADMIN") {
    reply.status(403).send({ error: "Forbidden", message: "Admin access required", statusCode: 403 });
  }
}
