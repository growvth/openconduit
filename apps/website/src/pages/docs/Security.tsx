import { CodeBlock } from "../../components/CodeBlock";

export function SecurityPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Security Best Practices</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        OpenConduit handles sensitive customer data and WhatsApp credentials. Follow these practices to keep your deployment secure.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Authentication</h2>

      <h3 className="mt-6 text-base font-semibold text-gray-900">JWT Configuration</h3>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit uses JWT tokens for API authentication. The <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">JWT_SECRET</code> environment variable is the signing key for all tokens.
      </p>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Use at least 64 random characters. Generate with:
        </li>
      </ul>
      <div className="mt-3">
        <CodeBlock language="bash" code="openssl rand -hex 32" />
      </div>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Never reuse JWT secrets across environments (dev, staging, production)
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Tokens expire after 7 days by default. Adjust this in the API configuration if your security policy requires shorter sessions
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          If you suspect a JWT secret is compromised, rotate it immediately. All existing tokens become invalid and users must log in again
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Password Policy</h3>
      <p className="mt-2 text-sm text-gray-600">
        Passwords are hashed with bcrypt at cost factor 12. The default admin credentials must be changed immediately after first login.
      </p>
      <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm font-medium text-red-800">Critical</p>
        <p className="mt-1 text-sm text-red-700">
          The default admin password (<code className="rounded bg-red-100 px-1 py-0.5 text-xs font-mono">admin123</code>) is publicly documented. Change it before exposing your instance to the internet.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Webhook Security</h2>

      <h3 className="mt-6 text-base font-semibold text-gray-900">HMAC Signature Validation</h3>
      <p className="mt-2 text-sm text-gray-600">
        Every inbound webhook request is validated using HMAC-SHA256 with timing-safe comparison. This ensures:
      </p>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Only your WhatsApp provider can send messages to your webhook endpoint
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Payloads cannot be tampered with in transit
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Timing attacks on the signature comparison are mitigated
        </li>
      </ul>
      <p className="mt-3 text-sm text-gray-600">
        Never disable signature validation in production. If you receive signature errors, re-check that your webhook secret matches the one in your provider dashboard.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Network Security</h2>

      <h3 className="mt-6 text-base font-semibold text-gray-900">TLS/HTTPS</h3>
      <p className="mt-2 text-sm text-gray-600">
        The default Docker Compose setup includes Caddy, which automatically provisions and renews TLS certificates from Let's Encrypt. All traffic is encrypted in transit.
      </p>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Never run OpenConduit over plain HTTP in production
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          WhatsApp providers require HTTPS for webhook registration
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Firewall Rules</h3>
      <p className="mt-2 text-sm text-gray-600">
        Restrict access to only the ports you need:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`# Allow SSH, HTTP, HTTPS only
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        The API server, PostgreSQL, and Redis should not be exposed to the internet directly. The Docker Compose configuration keeps them on an internal network, accessible only through Caddy.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Rate Limiting</h3>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit applies rate limiting at the API level to prevent brute-force attacks and abuse:
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Endpoint</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">POST /auth/login</td>
              <td className="px-4 py-2.5 text-gray-600">5 requests per minute per IP</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">All API routes</td>
              <td className="px-4 py-2.5 text-gray-600">100 requests per minute per IP</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">Webhook endpoints</td>
              <td className="px-4 py-2.5 text-gray-600">No rate limit (validated by signature)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">HTTP Security Headers</h2>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit sets security headers via Helmet middleware:
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Header</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">X-Content-Type-Options</td>
              <td className="px-4 py-2.5 text-gray-600">Prevents MIME type sniffing</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">X-Frame-Options</td>
              <td className="px-4 py-2.5 text-gray-600">Prevents clickjacking</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">Strict-Transport-Security</td>
              <td className="px-4 py-2.5 text-gray-600">Forces HTTPS connections</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">X-XSS-Protection</td>
              <td className="px-4 py-2.5 text-gray-600">Legacy XSS filter</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Database Security</h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Use a strong, unique password for the PostgreSQL user
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          PostgreSQL is not exposed outside the Docker network by default. Do not add port mappings to <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">docker-compose.yml</code> unless you have a specific need
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          All queries use Prisma ORM, which parameterizes queries to prevent SQL injection
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Back up your database regularly. Use <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">pg_dump</code> or a managed backup solution
        </li>
      </ul>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`# Manual backup
docker compose exec db pg_dump -U openconduit openconduit > backup_$(date +%Y%m%d).sql

# Restore from backup
cat backup_20260412.sql | docker compose exec -T db psql -U openconduit openconduit`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Environment Variables</h2>
      <ul className="mt-3 space-y-2 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Never commit <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.env</code> to version control. It is already in <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.gitignore</code>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Use different secrets for each environment (development, staging, production)
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Consider using a secrets manager (Vault, AWS Secrets Manager, etc.) for production deployments
        </li>
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Role-Based Access Control</h2>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit has two roles:
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Role</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Permissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Admin</td>
              <td className="px-4 py-2.5 text-gray-600">Full access. Manage users, settings, tags, pipeline stages, auto-tag rules, and all contacts/conversations.</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Agent</td>
              <td className="px-4 py-2.5 text-gray-600">View and manage contacts and conversations. Cannot access settings, user management, or system configuration.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Follow the principle of least privilege: only grant Admin access to users who need to manage system settings.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Reporting Vulnerabilities</h2>
      <p className="mt-2 text-sm text-gray-600">
        If you discover a security vulnerability in OpenConduit, please do not open a public issue. Use GitHub's private vulnerability reporting instead:
      </p>
      <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-700">
          Report vulnerabilities at{" "}
          <a
            href="https://github.com/growvth/openconduit/security/advisories/new"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline"
          >
            github.com/growvth/openconduit/security/advisories/new
          </a>
        </p>
      </div>
    </div>
  );
}
