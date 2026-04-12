# OpenConduit

Self-hostable, open-source WhatsApp CRM for solo operators and small teams.

## What is OpenConduit?

OpenConduit is a CRM built specifically for businesses that run on WhatsApp. It provides conversation management, contact organization, lead pipelines, and follow-up reminders — all connected to the WhatsApp Business API through your chosen provider.

**Your data stays on your server. No telemetry. No tracking. No vendor lock-in.**

## Features

- **WhatsApp Integration** — Send and receive messages via Meta Cloud API, 360dialog, or Twilio
- **Contact Management** — Organize contacts with tags, notes, and pipeline stages
- **Conversation History** — Full chat interface with delivery status tracking
- **Lead Pipeline** — Track contacts from New Lead to Converted
- **Auto-Tagging** — Automatically tag contacts based on message keywords
- **Follow-up Reminders** — Set reminders with due dates and overdue alerts
- **Quick Reply Templates** — Reusable message snippets for faster responses
- **Role-Based Access** — Admin and Agent roles with fine-grained permissions
- **Compliance** — Opt-in consent tracking, template-only broadcasts, data export

## Quick Start

### Prerequisites

- Docker and Docker Compose
- A domain name with DNS configured
- A WhatsApp Business API provider account

### Deploy

```bash
git clone https://github.com/maskedsyntax/openconduit.git
cd openconduit
cp .env.example .env
# Edit .env with your settings
docker compose up -d
```

Visit `https://yourdomain.com` and log in with the default admin credentials, then configure your WhatsApp provider in Settings.

### Default Admin

- Email: `admin@openconduit.dev`
- Password: `admin123`

**Change this immediately after first login.**

## Development

```bash
# Install dependencies
npm install

# Start the API
npm run dev:api

# Start the frontend
npm run dev:web

# Start the marketing site
npm run dev:website
```

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React + TypeScript + Tailwind CSS |
| Backend | Node.js + Fastify |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| Deployment | Docker + Docker Compose + Caddy |

## Project Structure

```
openconduit/
├── apps/
│   ├── api/          # Backend API (Fastify + Prisma)
│   ├── web/          # Frontend app (React + Vite)
│   └── website/      # Marketing site (openconduit.dev)
├── packages/
│   └── shared/       # Shared types and utilities
├── docker-compose.yml
├── Caddyfile
└── .env.example
```

## License

MIT
