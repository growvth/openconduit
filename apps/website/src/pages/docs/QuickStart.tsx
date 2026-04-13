import { CodeBlock } from "../../components/CodeBlock";

export function QuickStartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Quick Start</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Get OpenConduit running on your server in under 5 minutes with Docker Compose.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Prerequisites</h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          A Linux VPS (Ubuntu 22.04+ recommended) or any Docker-capable host
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          A registered domain name with DNS pointing to your server
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          A WhatsApp Business API provider account (360dialog, Meta Cloud API, or Twilio)
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Docker and Docker Compose installed on the server
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">1. Clone the Repository</h2>
      <p className="mt-2 text-sm text-gray-600">
        Clone the OpenConduit repository and navigate into it.
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`git clone https://github.com/growvth/openconduit.git
cd openconduit`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">2. Configure Environment</h2>
      <p className="mt-2 text-sm text-gray-600">
        Copy the example environment file and edit it with your settings.
      </p>
      <div className="mt-3">
        <CodeBlock language="bash" code="cp .env.example .env" />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Open <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">.env</code> and
        set the required values:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="env"
          title=".env"
          code={`DATABASE_URL=postgresql://openconduit:your-secure-password@db:5432/openconduit
JWT_SECRET=generate-a-random-64-character-string-here
PUBLIC_URL=https://crm.yourdomain.com`}
        />
      </div>
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Important</p>
        <p className="mt-1 text-sm text-amber-700">
          Use a strong, random string for <code className="rounded bg-amber-100 px-1 py-0.5 text-xs font-mono">JWT_SECRET</code>.
          You can generate one with: <code className="rounded bg-amber-100 px-1 py-0.5 text-xs font-mono">openssl rand -hex 32</code>
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">3. Start the Stack</h2>
      <p className="mt-2 text-sm text-gray-600">
        Docker Compose brings up all services: the API server, PostgreSQL, Redis, the web frontend, and Caddy as a reverse proxy with automatic TLS.
      </p>
      <div className="mt-3">
        <CodeBlock language="bash" code="docker compose up -d" />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Wait a minute for all services to start, then verify:
      </p>
      <div className="mt-3">
        <CodeBlock language="bash" code="docker compose ps" />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">4. First Login</h2>
      <p className="mt-2 text-sm text-gray-600">
        Open your domain in a browser. Log in with the default admin credentials:
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-2.5 font-medium text-gray-500">Email</td>
              <td className="px-4 py-2.5 font-mono text-gray-900">admin@openconduit.dev</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-500">Password</td>
              <td className="px-4 py-2.5 font-mono text-gray-900">admin123</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Change the default password immediately after your first login.</p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">5. Connect WhatsApp</h2>
      <ol className="mt-3 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Go to <strong>Settings</strong> in the sidebar.</li>
        <li><strong>2.</strong> Select your WhatsApp provider and enter your API credentials.</li>
        <li><strong>3.</strong> Copy the <strong>Webhook URL</strong> displayed on the settings page.</li>
        <li><strong>4.</strong> Paste it into your provider's dashboard as the callback URL.</li>
        <li><strong>5.</strong> Click <strong>Test Connection</strong> to verify everything works.</li>
      </ol>
      <p className="mt-4 text-sm text-gray-600">
        Messages will start flowing into OpenConduit as soon as the webhook is registered with your provider.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Environment Variables Reference</h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Variable</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Description</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">DATABASE_URL</td><td className="px-4 py-2.5 text-gray-600">PostgreSQL connection string</td><td className="px-4 py-2.5 text-gray-600">Yes</td></tr>
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">JWT_SECRET</td><td className="px-4 py-2.5 text-gray-600">Random string for signing auth tokens (64+ chars)</td><td className="px-4 py-2.5 text-gray-600">Yes</td></tr>
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">PUBLIC_URL</td><td className="px-4 py-2.5 text-gray-600">Public-facing URL for webhook registration</td><td className="px-4 py-2.5 text-gray-600">Yes</td></tr>
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">REDIS_URL</td><td className="px-4 py-2.5 text-gray-600">Redis connection string</td><td className="px-4 py-2.5 text-gray-600">No</td></tr>
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">CORS_ORIGIN</td><td className="px-4 py-2.5 text-gray-600">Allowed CORS origin (development)</td><td className="px-4 py-2.5 text-gray-600">No</td></tr>
            <tr><td className="px-4 py-2.5 font-mono text-xs text-gray-900">PORT</td><td className="px-4 py-2.5 text-gray-600">API server port (default: 3000)</td><td className="px-4 py-2.5 text-gray-600">No</td></tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-500">
        WhatsApp provider credentials are configured through the Settings UI after deployment, not through environment variables.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Updating</h2>
      <p className="mt-2 text-sm text-gray-600">
        To update to the latest version:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`cd openconduit
git pull origin main
docker compose build
docker compose up -d`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Troubleshooting</h2>
      <div className="mt-3 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Containers not starting?</p>
          <p className="mt-1 text-sm text-gray-600">Check the logs:</p>
          <div className="mt-2">
            <CodeBlock language="bash" code="docker compose logs -f" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Database connection errors?</p>
          <p className="mt-1 text-sm text-gray-600">
            Make sure the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">DATABASE_URL</code> in
            your <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.env</code> matches the
            PostgreSQL credentials in <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">docker-compose.yml</code>.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">TLS certificate not working?</p>
          <p className="mt-1 text-sm text-gray-600">
            Ensure your domain's DNS A record points to your server's IP address. Caddy handles certificate issuance
            automatically, but it needs to be reachable on ports 80 and 443.
          </p>
        </div>
      </div>
    </div>
  );
}
