import { CodeBlock } from "../../components/CodeBlock";

export function ContributingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Contributing</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        OpenConduit is open source and welcomes contributions. This guide covers how to set up the development environment, coding standards, and the pull request process.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Development Setup</h2>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Prerequisites</h3>
      <ul className="mt-2 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Node.js 20 or later
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          npm 9 or later
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Docker and Docker Compose (for the database)
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Git
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">1. Clone and Install</h3>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`git clone https://github.com/growvth/openconduit.git
cd openconduit
npm install`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        This is a monorepo using npm workspaces. <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">npm install</code> at the root installs dependencies for all packages.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">2. Start the Database</h3>
      <p className="mt-2 text-sm text-gray-600">
        Spin up PostgreSQL and Redis using Docker:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`docker compose up db redis -d`}
        />
      </div>

      <h3 className="mt-6 text-base font-semibold text-gray-900">3. Configure Environment</h3>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`cp .env.example .env`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        For local development, the default values in <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.env.example</code> work out of the box with the Docker database.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">4. Run Migrations and Seed</h3>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`npm run db:migrate
npm run db:seed`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        This creates the database tables and seeds default data (pipeline stages, tags, and an admin user).
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">5. Start Dev Servers</h3>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`# Start the API server (port 3000)
npm run dev:api

# In another terminal, start the web app (port 5173)
npm run dev:web

# Or start the marketing website (port 5174)
npm run dev:website`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Project Structure</h2>
      <div className="mt-3">
        <CodeBlock
          language="text"
          code={`openconduit/
  apps/
    api/          # Fastify backend (REST API, webhooks, providers)
    web/          # React frontend (CRM dashboard)
    website/      # Marketing site (openconduit.dev)
  packages/
    shared/       # Shared types, constants, and validation utilities
  docker-compose.yml
  Caddyfile`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Coding Standards</h2>

      <h3 className="mt-6 text-base font-semibold text-gray-900">TypeScript</h3>
      <ul className="mt-2 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Strict TypeScript everywhere. No <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">any</code> types unless absolutely necessary.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Use shared types from <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">@openconduit/shared</code> for API contracts between frontend and backend.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Validate all input at API boundaries using Zod schemas.</span>
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">API Routes</h3>
      <ul className="mt-2 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Every route must have authentication (use the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">authenticate</code> or <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">requireAdmin</code> middleware).</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Validate request bodies with Zod before processing.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Return consistent error shapes: <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">{`{ error: string }`}</code>.</span>
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">React Components</h3>
      <ul className="mt-2 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Functional components only.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Use Tailwind CSS for styling. No CSS modules or styled-components.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0">Keep components focused. Split large components into smaller ones.</span>
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Commit Conventions</h2>
      <p className="mt-2 text-sm text-gray-600">
        Use short, descriptive commit messages. Prefix with the area of change:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="text"
          code={`api: add reminder endpoints
web: fix conversation polling interval
website: update quick start guide
shared: add MessageDirection enum
docker: add redis health check`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Pull Request Process</h2>
      <ol className="mt-3 space-y-3 text-sm text-gray-600">
        <li>
          <strong>1. Fork and branch.</strong> Create a feature branch from <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">main</code>. Use a descriptive name like <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">feat/auto-tag-regex</code> or <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">fix/conversation-close-bug</code>.
        </li>
        <li>
          <strong>2. Keep it focused.</strong> One PR per feature or fix. Avoid mixing unrelated changes.
        </li>
        <li>
          <strong>3. Test locally.</strong> Make sure the API server starts, the web app builds, and your changes work as expected.
        </li>
        <li>
          <strong>4. Write a clear description.</strong> Explain what the PR does, why it's needed, and how to test it.
        </li>
        <li>
          <strong>5. Submit.</strong> Open the PR against <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">main</code>. A maintainer will review and provide feedback.
        </li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Adding a WhatsApp Provider</h2>
      <p className="mt-2 text-sm text-gray-600">
        To add support for a new WhatsApp Business API provider:
      </p>
      <ol className="mt-3 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Create a new file in <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">apps/api/src/providers/</code> that implements the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">WhatsAppProviderInterface</code>.</li>
        <li><strong>2.</strong> Register it in the provider factory (<code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">apps/api/src/providers/factory.ts</code>).</li>
        <li><strong>3.</strong> Add the provider option to the Settings UI in the web app.</li>
        <li><strong>4.</strong> Document the setup steps.</li>
      </ol>
      <div className="mt-3">
        <CodeBlock
          language="typescript"
          title="Provider interface"
          code={`interface WhatsAppProviderInterface {
  sendMessage(to: string, text: string): Promise<{ messageId: string }>;
  parseWebhook(body: unknown): ParsedMessage | null;
  validateWebhookSignature(payload: string, signature: string): boolean;
  handleVerification(query: Record<string, string>): string | null;
  healthCheck(): Promise<boolean>;
}`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Database Migrations</h2>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit uses Prisma for database management. To create a migration:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`# Edit the schema
# apps/api/prisma/schema.prisma

# Generate and apply the migration
npm run db:migrate`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Always review the generated SQL before committing. Include the migration files in your PR.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Questions?</h2>
      <p className="mt-2 text-sm text-gray-600">
        Open a discussion on{" "}
        <a
          href="https://github.com/growvth/openconduit/discussions"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 hover:text-brand-700 underline"
        >
          GitHub Discussions
        </a>
        . For bugs, use{" "}
        <a
          href="https://github.com/growvth/openconduit/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-600 hover:text-brand-700 underline"
        >
          GitHub Issues
        </a>.
      </p>
    </div>
  );
}
