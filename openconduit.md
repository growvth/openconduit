# OpenConduit — spec.md
**Version:** 1.0.0-draft  
**Domain:** openconduit.dev  
**Status:** Pre-implementation  
**Target:** Solo operators primarily; small teams (2–10 agents) as a secondary target

---

## 1. Overview

OpenConduit is a self-hostable, open-source WhatsApp CRM built for solo operators and small teams who manage customer relationships primarily through WhatsApp. It provides a unified interface for conversation history, contact management, lead pipelines, and follow-up reminders — all linked to a WhatsApp Business API gateway.

The core application is self-hosted. WhatsApp connectivity is delegated to an external provider (Meta Cloud API, 360dialog, or Twilio). OpenConduit does not attempt to circumvent WhatsApp's official API requirements; it provides the tooling layer on top of them.

**Primary users:** Freelancers, small agencies, indie SaaS founders, local businesses, and consultants in emerging markets (India, Southeast Asia, LATAM) who already use WhatsApp as their primary business communication channel.

---

## 2. Design Principles

- **Solo-first, team-ready.** The default experience is optimized for one operator. Multi-user support is additive, not the default assumption.
- **Honest self-hosting.** The core app runs locally or on a VPS. Message routing always touches a third-party WhatsApp provider — the spec is explicit about this and does not overclaim data sovereignty.
- **Compliance-aware by default.** Broadcast messaging is restricted to opted-in contacts with Meta-approved templates. The system does not enable spam.
- **Phased scope.** A working v1 ships with contact management, conversation history, and basic tagging. Kanban pipelines, broadcast messaging, and analytics are v2+.
- **No lock-in.** All contact and conversation data can be exported as JSON or CSV at any time.

---

## 3. Architecture

### 3.1 High-Level Components

```
┌──────────────────────────────────────────────────────────┐
│                    OpenConduit App                        │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Frontend   │  │   Backend    │  │   Database     │  │
│  │  (React)    │◄─┤  (REST API)  │◄─┤  (PostgreSQL)  │  │
│  └─────────────┘  └──────┬───────┘  └────────────────┘  │
│                           │                              │
│                    ┌──────▼───────┐                      │
│                    │  Webhook     │                      │
│                    │  Receiver    │                      │
│                    └──────┬───────┘                      │
└───────────────────────────┼──────────────────────────────┘
                            │ HTTPS (public endpoint)
                 ┌──────────▼──────────┐
                 │  WhatsApp Provider  │
                 │  (360dialog / Meta  │
                 │   Cloud API /       │
                 │   Twilio)           │
                 └─────────────────────┘
```

### 3.2 Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React + TypeScript | Widely maintained, good ecosystem |
| Backend | Node.js + Express (or Fastify) | Lightweight, good WhatsApp SDK support |
| Database | PostgreSQL | Relational model fits CRM data well |
| ORM | Prisma | Type-safe schema management |
| Auth | JWT + bcrypt | Simple, self-contained |
| Deployment | Docker + Docker Compose | Single-command self-hosting |
| Reverse proxy | Caddy or Nginx | TLS termination, webhook exposure |

### 3.3 Webhook Architecture

Incoming WhatsApp messages arrive via HTTP POST to a publicly accessible webhook endpoint. This is a hard requirement from all WhatsApp API providers — the self-hosted instance must be reachable from the internet.

**Webhook endpoint:** `POST /webhooks/whatsapp`

**Development:** Use `ngrok` or `cloudflared tunnel` to expose localhost.  
**Production:** The app must run behind a reverse proxy with a valid TLS certificate and a public domain/IP.

The webhook receiver validates the request signature (provider-specific HMAC), parses the payload, and queues the message for processing via an internal job queue (BullMQ or similar).

### 3.4 Provider Hierarchy

Providers are listed in recommended order for new users:

1. **360dialog** — lowest cost for high-volume; direct Meta BSP; recommended default
2. **Meta Cloud API** — free tier available; direct integration; requires Meta Business verification
3. **Twilio** — most developer-friendly; higher per-message cost; good for prototyping

The gateway layer is abstracted behind a `WhatsAppProvider` interface so switching providers requires only config changes, not code changes.

---

## 4. Data Models

### 4.1 Contact

```
Contact {
  id              UUID (PK)
  phone           String (E.164 format, unique)
  name            String
  notes           Text (nullable)
  tags            Tag[] (many-to-many)
  waId            String (WhatsApp contact ID, nullable)
  optedIn         Boolean (default: false)
  optedInAt       DateTime (nullable)
  createdAt       DateTime
  updatedAt       DateTime
  assignedTo      User (nullable, FK)
  pipelineStage   PipelineStage (nullable, FK)
}
```

### 4.2 Conversation

```
Conversation {
  id          UUID (PK)
  contact     Contact (FK)
  status      Enum: OPEN | RESOLVED | PENDING
  createdAt   DateTime
  updatedAt   DateTime
  assignedTo  User (nullable, FK)
}
```

### 4.3 Message

```
Message {
  id              UUID (PK)
  conversation    Conversation (FK)
  direction       Enum: INBOUND | OUTBOUND
  type            Enum: TEXT | IMAGE | DOCUMENT | AUDIO | VIDEO | TEMPLATE
  body            Text (nullable — empty for media-only messages)
  mediaUrl        String (nullable)
  mediaType       String (nullable, MIME type)
  providerMsgId   String (WhatsApp message ID from provider)
  status          Enum: SENT | DELIVERED | READ | FAILED
  sentAt          DateTime
  createdAt       DateTime
}
```

### 4.4 Tag

```
Tag {
  id      UUID (PK)
  name    String (unique)
  color   String (hex)
}
```

### 4.5 PipelineStage

```
PipelineStage {
  id       UUID (PK)
  name     String
  order    Int
  color    String (hex)
}
```

Default stages (seeded on first run): `New Lead → Contacted → Proposal Sent → Converted → Closed`

### 4.6 User

```
User {
  id           UUID (PK)
  name         String
  email        String (unique)
  passwordHash String
  role         Enum: ADMIN | AGENT
  createdAt    DateTime
}
```

### 4.7 Reminder

```
Reminder {
  id          UUID (PK)
  contact     Contact (FK)
  user        User (FK)
  note        Text
  dueAt       DateTime
  completed   Boolean (default: false)
  createdAt   DateTime
}
```

### 4.8 MessageTemplate

```
MessageTemplate {
  id              UUID (PK)
  name            String
  body            Text
  providerTemplateId  String (nullable — Meta-approved template ID)
  isApproved      Boolean (default: false)
  createdAt       DateTime
}
```

---

## 5. Feature Specification

### 5.1 WhatsApp Integration

**Gateway connection**
- Admin configures provider credentials in Settings (API key, phone number ID, webhook secret)
- App verifies the connection on save by calling the provider's health/status endpoint
- Webhook URL is displayed in Settings for the user to paste into their provider dashboard

**Incoming messages**
- Webhook receiver validates HMAC signature from provider
- Message is parsed and matched to an existing Contact by phone number (E.164)
- If no Contact exists, one is auto-created with `name = phone number` and tagged `Unknown`
- Message is stored and the relevant Conversation is opened or re-opened

**Outgoing messages**
- Send plain text messages from the conversation view
- Send pre-approved templates (required for initiating new conversations per WhatsApp policy)
- File attachments: images (JPEG, PNG), documents (PDF), audio (MP3, OGG)
- Media is uploaded to the provider and stored as a URL reference; OpenConduit does not store media files locally by default

**Message status**
- Delivery receipts (sent → delivered → read) are updated via status webhook callbacks
- Failed messages are flagged with an error reason

**24-hour session window**
- WhatsApp allows free-form messages only within 24 hours of the last inbound message
- The UI shows a visible indicator when a conversation is outside the session window
- Outside the window, only template messages can be sent; the UI enforces this

### 5.2 Contact Management

- Create, edit, and delete contacts
- Phone number stored in E.164 format; input accepts local formats and normalizes on save
- Attach multiple tags per contact
- Free-text notes field per contact
- Assign contact to a pipeline stage
- Assign contact to a team member (v1: admin only; v2: any agent)
- Search contacts by name, phone, tag, or pipeline stage
- Filter contacts by tag, stage, assigned agent, or date created
- Bulk tag / bulk assign (v2)

### 5.3 Conversation History

- Full message log per contact, ordered chronologically
- Threaded view: inbound messages on the left, outbound on the right (standard chat UI)
- Media messages show inline previews for images; download link for documents
- Search within a conversation (client-side, full conversation loaded)
- Export conversation as plain text or JSON
- Mark conversation as Resolved or Pending

### 5.4 Lead Tagging

- Tags are free-form, user-defined, with a color picker
- Default seed tags: `New Lead`, `Interested`, `Trial Done`, `Converted`, `Churned`
- Auto-tagging rules: if an inbound message contains a keyword (configurable), apply a tag automatically
  - Example: message contains "pricing" → apply tag `Interested`
  - Rules are evaluated on message receipt
  - Rules are simple keyword matches in v1; regex support in v2

### 5.5 Pipeline

**v1 — Status field on contact**
- Each contact has a pipeline stage (a simple dropdown)
- Stages are configurable (name, order, color)
- Contacts can be filtered by stage in the contact list

**v2 — Kanban board**
- Drag-and-drop Kanban view of contacts by stage
- Stage transition timestamps logged
- Conversion funnel chart on dashboard

### 5.6 Follow-up Reminders

- Create a reminder for any contact with a due date/time and a note
- Reminders are listed in a dedicated "Reminders" view, sorted by due date
- In-app notification when a reminder is due (polling or WebSocket)
- Overdue reminders are highlighted
- Mark reminder as complete
- v2: Calendar export (ICS file download)

### 5.7 Messaging Features

**Quick reply templates**
- Store reusable message snippets (not the same as Meta-approved templates)
- Accessible via `/` shortcut in the message input box
- Stored locally, no Meta approval needed (used as pre-fill, not auto-sent)

**Broadcast messaging** *(v2 only)*
- Send a message to multiple opted-in contacts at once
- Restricted to Meta-approved template messages only — no free-form broadcast
- Contacts must have `optedIn = true`
- Rate-limited at the provider level; OpenConduit adds a configurable send delay between messages to reduce ban risk
- Broadcast history logged per contact

### 5.8 Dashboard

**v1 widgets**
- Total open conversations
- New contacts this week
- Reminders due today
- Recent activity feed (last 20 message events)

**v2 widgets**
- Conversion rate by pipeline stage (funnel chart)
- Average response time (inbound to first outbound reply)
- Message volume over time (line chart, 7d / 30d)
- Top tags by contact count

### 5.9 Multi-User Support *(v1: basic; v2: full)*

**v1**
- ADMIN role: full access to all contacts, conversations, settings
- AGENT role: access to assigned contacts and conversations only
- Invite user by email (email + temp password, no email sending in v1 — admin copies the link)
- No team inbox in v1; conversations are assigned to individual agents

**v2**
- Team inbox: unassigned conversations visible to all agents
- Agent-level analytics
- Audit log for sensitive actions (contact deletion, data export)

---

## 6. API Design

All routes are prefixed with `/api/v1`.

### Authentication
- `POST /auth/login` — returns JWT
- `POST /auth/logout`
- `GET /auth/me`

### Contacts
- `GET /contacts` — list with filters (tag, stage, assignee, search)
- `POST /contacts` — create
- `GET /contacts/:id`
- `PUT /contacts/:id`
- `DELETE /contacts/:id`
- `GET /contacts/:id/messages` — full conversation history
- `POST /contacts/:id/tags` — add tags
- `DELETE /contacts/:id/tags/:tagId`

### Messages
- `POST /messages` — send a message `{ contactId, type, body, templateId? }`
- `GET /messages/:id`

### Webhooks
- `GET /webhooks/whatsapp` — webhook verification (provider challenge)
- `POST /webhooks/whatsapp` — incoming message/status callback

### Tags
- `GET /tags`
- `POST /tags`
- `PUT /tags/:id`
- `DELETE /tags/:id`

### Pipeline
- `GET /pipeline/stages`
- `POST /pipeline/stages`
- `PUT /pipeline/stages/:id`
- `DELETE /pipeline/stages/:id`
- `PUT /contacts/:id/stage` — move contact to stage

### Reminders
- `GET /reminders` — list (filter: due today, overdue, upcoming)
- `POST /reminders`
- `PUT /reminders/:id`
- `DELETE /reminders/:id`

### Templates
- `GET /templates`
- `POST /templates`
- `PUT /templates/:id`
- `DELETE /templates/:id`

### Settings
- `GET /settings`
- `PUT /settings`
- `POST /settings/test-connection` — verify WhatsApp provider credentials

### Users *(admin only)*
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

---

## 7. Security and Compliance

### Authentication and Authorization
- All API routes (except `/webhooks/whatsapp` and `/auth/login`) require a valid JWT
- Role-based access: ADMIN and AGENT roles enforced at the route level
- Passwords hashed with bcrypt (cost factor ≥ 12)
- JWT expiry: 7 days with refresh token rotation (v2); 24h with re-login in v1

### Webhook Security
- Provider webhook signature validated on every incoming request (HMAC-SHA256)
- Requests failing validation are rejected with 401 and logged

### Data Handling
- Phone numbers and contact data stored in PostgreSQL on the self-hosted instance
- Message content stored in PostgreSQL; media stored as provider URLs (not local files) by default
- Optional: local media caching (admin-configurable) for privacy-sensitive setups
- No analytics, telemetry, or data sent to OpenConduit servers — the app is fully self-contained

### Consent Management
- `optedIn` field on Contact; must be `true` for broadcast messages
- Opt-in can be set manually or triggered automatically when a contact initiates a conversation (configurable)
- Consent timestamp (`optedInAt`) logged for audit purposes

### Compliance Notes (India / Emerging Markets)
- Data localization: all data remains on the operator's own server — compliant with Indian data localization requirements by design
- WhatsApp Business Policy compliance: broadcast restricted to templates + opted-in contacts
- GDPR-adjacent: contact deletion purges all associated messages and reminders (hard delete, no soft delete in v1)
- Export-before-delete: UI prompts admin to export contact data before permanent deletion

---

## 8. Self-Hosting Guide (Spec-Level)

### Requirements
- A Linux VPS (Ubuntu 22.04+ recommended) or any Docker-capable host
- A registered domain name with DNS pointed to the server (required for TLS and webhook URLs)
- A WhatsApp Business API provider account (360dialog, Twilio, or Meta Cloud API)
- Docker and Docker Compose installed

### Deployment
- Single `docker-compose.yml` ships with the repository
- Services: `app` (Node.js backend + React frontend served as static), `db` (PostgreSQL), `proxy` (Caddy for TLS)
- Configuration via a single `.env` file
- First-run setup: `docker compose up` → navigate to `https://yourdomain.com/setup` → create admin account → enter provider credentials

### Environment Variables (`.env`)
```
DATABASE_URL=postgresql://user:pass@db:5432/openconduit
JWT_SECRET=<random 64-char string>
WHATSAPP_PROVIDER=360dialog          # or: meta | twilio
WHATSAPP_API_KEY=<provider key>
WHATSAPP_PHONE_NUMBER_ID=<id>
WHATSAPP_WEBHOOK_SECRET=<secret>
PUBLIC_URL=https://openconduit.yourdomain.com
PORT=3000
```

### Webhook Registration
After deployment, the admin copies the webhook URL from Settings (`PUBLIC_URL/webhooks/whatsapp`) and registers it in the provider dashboard. The app handles the provider's challenge/verification automatically on first request.

---

## 9. Roadmap

### Phase 1 — Foundation (v0.1)
- [ ] Project scaffolding (monorepo, Docker setup, CI)
- [ ] Database schema + Prisma migrations
- [ ] Auth (login, JWT, roles)
- [ ] WhatsApp provider abstraction layer
- [ ] Webhook receiver + message ingestion pipeline
- [ ] Contact CRUD
- [ ] Basic conversation view (read-only first)
- [ ] Send text messages

### Phase 2 — Core CRM (v0.2)
- [ ] Tags + auto-tagging rules
- [ ] Pipeline stages (status field on contact)
- [ ] Reminders
- [ ] Quick reply templates
- [ ] Message status updates (delivered/read)
- [ ] 24-hour session window indicator
- [ ] Media message support (send + receive)

### Phase 3 — Dashboard + Polish (v0.3)
- [ ] v1 dashboard widgets
- [ ] Conversation export (text + JSON)
- [ ] Contact search and filtering
- [ ] Settings UI (provider config, user management)
- [ ] Self-hosting documentation

### Phase 4 — Team Features (v0.4)
- [ ] Multi-agent assignment
- [ ] Team inbox
- [ ] Agent-level access control
- [ ] Audit log

### Phase 5 — Growth Features (v1.0)
- [ ] Kanban board
- [ ] Broadcast messaging (opted-in + templates only)
- [ ] v2 dashboard (funnel, response time, volume charts)
- [ ] Calendar export for reminders
- [ ] Auto-tagging with regex support

---

## 10. Out of Scope

The following are explicitly outside the scope of OpenConduit:

- **AI-powered reply suggestions** — not planned; this is a utility tool
- **Email or SMS channels** — WhatsApp only in v1; multi-channel is a separate product decision
- **Native mobile app** — web-first; the frontend is responsive but no dedicated iOS/Android app
- **End-to-end encryption of stored messages** — messages are stored in plaintext in PostgreSQL; the operator is responsible for database-level security (disk encryption, backups)
- **WhatsApp account provisioning** — OpenConduit does not help users get a WhatsApp Business account; that is the user's responsibility with their chosen provider
- **Billing or subscription management** — self-hosted tool; no SaaS billing layer
