import { CodeBlock } from "../../components/CodeBlock";

function Endpoint({
  method,
  path,
  description,
  auth,
  body,
  response,
  notes,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  auth?: string;
  body?: string;
  response?: string;
  notes?: string;
}) {
  const methodColors: Record<string, string> = {
    GET: "bg-blue-100 text-blue-700",
    POST: "bg-green-100 text-green-700",
    PUT: "bg-amber-100 text-amber-700",
    DELETE: "bg-red-100 text-red-700",
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-bold ${methodColors[method]}`}>
          {method}
        </span>
        <div className="min-w-0 flex-1">
          <code className="text-sm font-mono font-semibold text-gray-900 break-all">{path}</code>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          {auth && <p className="mt-1 text-xs text-gray-400">Auth: {auth}</p>}
          {notes && (
            <p className="mt-2 rounded bg-gray-50 p-2 text-xs text-gray-500">{notes}</p>
          )}
        </div>
      </div>
      {body && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-gray-400">Request Body</p>
          <CodeBlock language="json" code={body} />
        </div>
      )}
      {response && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium text-gray-400">Response</p>
          <CodeBlock language="json" code={response} />
        </div>
      )}
    </div>
  );
}

export function ApiReferencePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">API Reference</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Complete REST API documentation for OpenConduit. All routes are prefixed
        with <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-mono">/api/v1</code>.
      </p>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          All API routes (except <code className="font-mono text-xs">/webhooks/whatsapp</code> and <code className="font-mono text-xs">/auth/login</code>)
          require a valid JWT token in the <code className="font-mono text-xs">Authorization: Bearer &lt;token&gt;</code> header.
        </p>
      </div>

      {/* Authentication */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Authentication</h2>
      <p className="mt-2 text-sm text-gray-600">
        Authenticate with email and password to receive a JWT token. Include this token in all subsequent requests.
      </p>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="POST"
          path="/api/v1/auth/login"
          description="Authenticate and receive a JWT token."
          auth="None"
          body={`{
  "email": "admin@openconduit.dev",
  "password": "your-password"
}`}
          response={`{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@openconduit.dev",
    "role": "ADMIN"
  }
}`}
        />
        <Endpoint
          method="POST"
          path="/api/v1/auth/logout"
          description="Log out the current session."
          auth="JWT"
        />
        <Endpoint
          method="GET"
          path="/api/v1/auth/me"
          description="Get the currently authenticated user."
          auth="JWT"
          response={`{
  "id": "uuid",
  "name": "Admin",
  "email": "admin@openconduit.dev",
  "role": "ADMIN",
  "createdAt": "2026-01-01T00:00:00.000Z"
}`}
        />
      </div>

      {/* Contacts */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Contacts</h2>
      <p className="mt-2 text-sm text-gray-600">
        Manage WhatsApp contacts. Phone numbers are stored in E.164 format. Agents can only see contacts assigned to them.
      </p>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="GET"
          path="/api/v1/contacts"
          description="List contacts with optional filters."
          auth="JWT"
          notes="Query params: page, pageSize, search, tag (UUID), stage (UUID), assignee (UUID)"
          response={`{
  "data": [
    {
      "id": "uuid",
      "phone": "+919876543210",
      "name": "Rahul Sharma",
      "optedIn": true,
      "tags": [{ "tag": { "id": "uuid", "name": "Interested", "color": "#3b82f6" } }],
      "pipelineStage": { "id": "uuid", "name": "Contacted", "color": "#3b82f6" },
      "assignedTo": { "id": "uuid", "name": "Admin" }
    }
  ],
  "total": 42,
  "page": 1,
  "pageSize": 25
}`}
        />
        <Endpoint
          method="POST"
          path="/api/v1/contacts"
          description="Create a new contact."
          auth="JWT"
          body={`{
  "phone": "+919876543210",
  "name": "Rahul Sharma",
  "notes": "Met at conference",
  "tags": ["tag-uuid-1", "tag-uuid-2"]
}`}
        />
        <Endpoint
          method="GET"
          path="/api/v1/contacts/:id"
          description="Get a single contact with tags, pipeline stage, and conversations."
          auth="JWT"
        />
        <Endpoint
          method="PUT"
          path="/api/v1/contacts/:id"
          description="Update a contact."
          auth="JWT"
          body={`{
  "name": "Updated Name",
  "notes": "Updated notes",
  "pipelineStageId": "stage-uuid",
  "assignedToId": "user-uuid",
  "optedIn": true
}`}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/contacts/:id"
          description="Delete a contact and all associated data (messages, reminders). Hard delete."
          auth="JWT (Admin)"
        />
        <Endpoint
          method="GET"
          path="/api/v1/contacts/:id/messages"
          description="Get full message history for a contact across all conversations."
          auth="JWT"
        />
        <Endpoint
          method="POST"
          path="/api/v1/contacts/:id/tags"
          description="Add tags to a contact."
          auth="JWT"
          body={`{
  "tagIds": ["tag-uuid-1", "tag-uuid-2"]
}`}
        />
        <Endpoint
          method="DELETE"
          path="/api/v1/contacts/:id/tags/:tagId"
          description="Remove a tag from a contact."
          auth="JWT"
        />
        <Endpoint
          method="PUT"
          path="/api/v1/contacts/:id/stage"
          description="Move a contact to a pipeline stage."
          auth="JWT"
          body={`{
  "stageId": "stage-uuid"
}`}
        />
      </div>

      {/* Conversations */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Conversations</h2>
      <p className="mt-2 text-sm text-gray-600">
        Conversations are automatically created when a message is received from a new contact or when you send a message. Each contact can have multiple conversations over time.
      </p>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="GET"
          path="/api/v1/conversations"
          description="List conversations with the most recent message."
          auth="JWT"
          notes="Query params: page, pageSize, status (OPEN | PENDING | RESOLVED)"
        />
        <Endpoint
          method="GET"
          path="/api/v1/conversations/:id"
          description="Get a conversation with all messages."
          auth="JWT"
        />
        <Endpoint
          method="PUT"
          path="/api/v1/conversations/:id"
          description="Update conversation status or assignment."
          auth="JWT"
          body={`{
  "status": "RESOLVED",
  "assignedToId": "user-uuid"
}`}
        />
      </div>

      {/* Messages */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Messages</h2>
      <p className="mt-2 text-sm text-gray-600">
        Send messages through the WhatsApp Business API. The 24-hour session window is enforced server-side.
      </p>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="POST"
          path="/api/v1/messages"
          description="Send a message to a contact."
          auth="JWT"
          body={`{
  "contactId": "contact-uuid",
  "type": "TEXT",
  "body": "Hello! Thanks for reaching out."
}`}
          notes="type can be: TEXT, IMAGE, DOCUMENT, AUDIO, VIDEO, TEMPLATE. For TEMPLATE, include templateId. For media types, include mediaUrl."
        />
        <Endpoint
          method="GET"
          path="/api/v1/messages/:id"
          description="Get a single message with conversation and contact details."
          auth="JWT"
        />
      </div>

      {/* Tags */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Tags</h2>
      <div className="mt-4 space-y-4">
        <Endpoint method="GET" path="/api/v1/tags" description="List all tags." auth="JWT" />
        <Endpoint
          method="POST"
          path="/api/v1/tags"
          description="Create a new tag."
          auth="JWT"
          body={`{
  "name": "VIP",
  "color": "#8b5cf6"
}`}
        />
        <Endpoint method="PUT" path="/api/v1/tags/:id" description="Update a tag." auth="JWT" body={`{ "name": "VIP Client", "color": "#7c3aed" }`} />
        <Endpoint method="DELETE" path="/api/v1/tags/:id" description="Delete a tag." auth="JWT" />
      </div>

      {/* Pipeline */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Pipeline Stages</h2>
      <div className="mt-4 space-y-4">
        <Endpoint method="GET" path="/api/v1/pipeline/stages" description="List all pipeline stages in order." auth="JWT" />
        <Endpoint
          method="POST"
          path="/api/v1/pipeline/stages"
          description="Create a new pipeline stage."
          auth="JWT (Admin)"
          body={`{
  "name": "Negotiation",
  "order": 3,
  "color": "#f59e0b"
}`}
        />
        <Endpoint method="PUT" path="/api/v1/pipeline/stages/:id" description="Update a pipeline stage." auth="JWT (Admin)" />
        <Endpoint method="DELETE" path="/api/v1/pipeline/stages/:id" description="Delete a pipeline stage." auth="JWT (Admin)" />
      </div>

      {/* Reminders */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Reminders</h2>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="GET"
          path="/api/v1/reminders"
          description="List reminders for the current user."
          auth="JWT"
          notes="Query param: filter (today | overdue | upcoming)"
        />
        <Endpoint
          method="POST"
          path="/api/v1/reminders"
          description="Create a reminder."
          auth="JWT"
          body={`{
  "contactId": "contact-uuid",
  "note": "Follow up on pricing proposal",
  "dueAt": "2026-04-15T10:00:00.000Z"
}`}
        />
        <Endpoint
          method="PUT"
          path="/api/v1/reminders/:id"
          description="Update a reminder (edit note, reschedule, or mark complete)."
          auth="JWT"
          body={`{ "completed": true }`}
        />
        <Endpoint method="DELETE" path="/api/v1/reminders/:id" description="Delete a reminder." auth="JWT" />
      </div>

      {/* Templates */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Message Templates</h2>
      <p className="mt-2 text-sm text-gray-600">
        Manage quick reply templates and Meta-approved message templates.
      </p>
      <div className="mt-4 space-y-4">
        <Endpoint method="GET" path="/api/v1/templates" description="List all message templates." auth="JWT" />
        <Endpoint
          method="POST"
          path="/api/v1/templates"
          description="Create a message template."
          auth="JWT"
          body={`{
  "name": "greeting",
  "body": "Hi {{name}}, thanks for reaching out! How can I help you today?",
  "providerTemplateId": "meta_template_id",
  "isApproved": false
}`}
        />
        <Endpoint method="PUT" path="/api/v1/templates/:id" description="Update a template." auth="JWT" />
        <Endpoint method="DELETE" path="/api/v1/templates/:id" description="Delete a template." auth="JWT" />
      </div>

      {/* Settings */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Settings</h2>
      <p className="mt-2 text-sm text-gray-600">Admin-only endpoints for app configuration.</p>
      <div className="mt-4 space-y-4">
        <Endpoint
          method="GET"
          path="/api/v1/settings"
          description="Get current settings. Sensitive fields (API keys) are masked."
          auth="JWT (Admin)"
        />
        <Endpoint
          method="PUT"
          path="/api/v1/settings"
          description="Update settings."
          auth="JWT (Admin)"
          body={`{
  "whatsappProvider": "meta",
  "whatsappApiKey": "your-api-key",
  "whatsappPhoneNumberId": "phone-number-id",
  "whatsappWebhookSecret": "webhook-secret",
  "autoOptInOnFirstMessage": true
}`}
        />
        <Endpoint
          method="POST"
          path="/api/v1/settings/test-connection"
          description="Test the WhatsApp provider connection."
          auth="JWT (Admin)"
          response={`{ "connected": true }`}
        />
      </div>

      {/* Users */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Users</h2>
      <p className="mt-2 text-sm text-gray-600">Admin-only endpoints for managing team members.</p>
      <div className="mt-4 space-y-4">
        <Endpoint method="GET" path="/api/v1/users" description="List all users." auth="JWT (Admin)" />
        <Endpoint
          method="POST"
          path="/api/v1/users"
          description="Create a new user."
          auth="JWT (Admin)"
          body={`{
  "name": "John Agent",
  "email": "john@example.com",
  "password": "secure-password",
  "role": "AGENT"
}`}
          notes="Roles: ADMIN (full access) or AGENT (assigned contacts only). Passwords must be at least 8 characters."
        />
        <Endpoint method="PUT" path="/api/v1/users/:id" description="Update a user." auth="JWT (Admin)" />
        <Endpoint method="DELETE" path="/api/v1/users/:id" description="Delete a user. Cannot delete yourself." auth="JWT (Admin)" />
      </div>

      {/* Error Format */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Error Responses</h2>
      <p className="mt-2 text-sm text-gray-600">
        All error responses follow a consistent format:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="json"
          code={`{
  "error": "Not Found",
  "message": "Contact not found",
  "statusCode": 404
}`}
        />
      </div>
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Meaning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr><td className="px-4 py-2 font-mono text-xs">400</td><td className="px-4 py-2 text-gray-600">Invalid request body or parameters</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">401</td><td className="px-4 py-2 text-gray-600">Missing or invalid JWT token</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">403</td><td className="px-4 py-2 text-gray-600">Insufficient permissions (e.g. Agent accessing admin route)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">404</td><td className="px-4 py-2 text-gray-600">Resource not found</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">409</td><td className="px-4 py-2 text-gray-600">Conflict (e.g. duplicate phone number or email)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">422</td><td className="px-4 py-2 text-gray-600">Unprocessable (e.g. outside 24h session window)</td></tr>
            <tr><td className="px-4 py-2 font-mono text-xs">429</td><td className="px-4 py-2 text-gray-600">Rate limited (100 requests/minute)</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
