import { CodeBlock } from "../../components/CodeBlock";

export function WebhooksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Webhook Configuration</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        Webhooks are how WhatsApp providers deliver inbound messages to OpenConduit. This guide covers how they work, how to expose your instance, and how to troubleshoot common problems.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">How Webhooks Work</h2>
      <p className="mt-2 text-sm text-gray-600">
        When someone sends a message to your WhatsApp Business number, your provider (Meta, 360dialog, or Twilio) forwards the message payload to a URL you configure. OpenConduit exposes two webhook endpoints:
      </p>
      <div className="mt-3 overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Method</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Endpoint</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2.5"><span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">GET</span></td>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">/webhooks/whatsapp</td>
              <td className="px-4 py-2.5 text-gray-600">Webhook verification (challenge-response)</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5"><span className="rounded bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">POST</span></td>
              <td className="px-4 py-2.5 font-mono text-xs text-gray-900">/webhooks/whatsapp</td>
              <td className="px-4 py-2.5 text-gray-600">Inbound message and status delivery</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Verification Flow</h2>
      <p className="mt-2 text-sm text-gray-600">
        When you register a webhook URL with Meta Cloud API, they send a GET request with a challenge to verify you own the endpoint. OpenConduit handles this automatically.
      </p>
      <div className="mt-3">
        <CodeBlock
          language="text"
          code={`GET /webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE_STRING`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        OpenConduit checks that <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">hub.verify_token</code> matches the token you set in Settings, and responds with the challenge string. No action needed on your part beyond setting the verify token.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Message Ingestion</h2>
      <p className="mt-2 text-sm text-gray-600">
        When a message arrives, the provider sends a POST request with the message payload. OpenConduit processes it through these steps:
      </p>
      <ol className="mt-3 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> <strong>Signature validation</strong> - verifies the HMAC-SHA256 signature to ensure the request came from your provider.</li>
        <li><strong>2.</strong> <strong>Payload parsing</strong> - extracts the sender phone number, message text, timestamp, and message ID.</li>
        <li><strong>3.</strong> <strong>Contact lookup/creation</strong> - finds the existing contact by phone number, or creates a new one.</li>
        <li><strong>4.</strong> <strong>Conversation management</strong> - creates or reopens a conversation for the contact.</li>
        <li><strong>5.</strong> <strong>Message storage</strong> - saves the message to the database linked to the conversation.</li>
        <li><strong>6.</strong> <strong>Auto-tagging</strong> - runs any configured auto-tag rules against the message content.</li>
      </ol>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Signature Validation</h2>
      <p className="mt-2 text-sm text-gray-600">
        OpenConduit validates the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">X-Hub-Signature-256</code> header on every incoming POST request using HMAC-SHA256 with timing-safe comparison. This prevents forged webhook requests.
      </p>
      <div className="mt-3">
        <CodeBlock
          language="typescript"
          title="Signature validation (simplified)"
          code={`import crypto from "crypto";

function validateSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from("sha256=" + expected)
  );
}`}
        />
      </div>
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-800">Important</p>
        <p className="mt-1 text-sm text-amber-700">
          The webhook secret used for signature validation is set in OpenConduit Settings. Make sure it matches the App Secret (Meta) or webhook signing secret configured in your provider's dashboard.
        </p>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Exposing Your Instance</h2>
      <p className="mt-2 text-sm text-gray-600">
        Your OpenConduit instance must be reachable from the public internet over HTTPS for webhooks to work.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Production (Recommended)</h3>
      <p className="mt-2 text-sm text-gray-600">
        The default Docker Compose setup includes Caddy, which handles HTTPS automatically via Let's Encrypt. Just make sure:
      </p>
      <ul className="mt-2 space-y-1.5 text-sm text-gray-600">
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Your domain's DNS A record points to your server's IP
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          Ports 80 and 443 are open in your firewall
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-500" />
          <span className="min-w-0"><code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">PUBLIC_URL</code> in your <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">.env</code> matches the domain</span>
        </li>
      </ul>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Local Development</h3>
      <p className="mt-2 text-sm text-gray-600">
        For local testing, use a tunneling service to expose your local API server:
      </p>
      <div className="mt-3">
        <CodeBlock
          language="bash"
          code={`# Using ngrok
ngrok http 3000

# Using cloudflared
cloudflared tunnel --url http://localhost:3000`}
        />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        Copy the HTTPS URL from the tunnel output and use it as your webhook URL in the provider dashboard. Remember to update it each time the tunnel restarts (unless you have a fixed subdomain).
      </p>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Payload Examples</h2>
      <h3 className="mt-6 text-base font-semibold text-gray-900">Meta Cloud API</h3>
      <div className="mt-3">
        <CodeBlock
          language="json"
          title="Inbound text message"
          code={`{
  "object": "whatsapp_business_account",
  "entry": [{
    "id": "WHATSAPP_BUSINESS_ACCOUNT_ID",
    "changes": [{
      "value": {
        "messaging_product": "whatsapp",
        "metadata": {
          "display_phone_number": "15551234567",
          "phone_number_id": "PHONE_NUMBER_ID"
        },
        "contacts": [{
          "profile": { "name": "Customer Name" },
          "wa_id": "15559876543"
        }],
        "messages": [{
          "from": "15559876543",
          "id": "wamid.ABCdef123",
          "timestamp": "1677000000",
          "text": { "body": "Hello, I need help" },
          "type": "text"
        }]
      },
      "field": "messages"
    }]
  }]
}`}
        />
      </div>

      <h3 className="mt-6 text-base font-semibold text-gray-900">Delivery Status Update</h3>
      <div className="mt-3">
        <CodeBlock
          language="json"
          title="Message read receipt"
          code={`{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "statuses": [{
          "id": "wamid.ABCdef123",
          "status": "read",
          "timestamp": "1677000060",
          "recipient_id": "15559876543"
        }]
      },
      "field": "messages"
    }]
  }]
}`}
        />
      </div>

      <h2 className="mt-10 text-xl font-semibold text-gray-900">Troubleshooting</h2>
      <div className="mt-3 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Webhook verification fails</p>
          <p className="mt-1 text-sm text-gray-600">
            Ensure your verify token in OpenConduit Settings matches what you entered in your provider's dashboard. Check that your instance is reachable over HTTPS.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Signature validation errors (403)</p>
          <p className="mt-1 text-sm text-gray-600">
            The webhook secret in OpenConduit must match your provider's signing secret. For Meta, this is the App Secret from your Facebook App dashboard.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Messages arrive but contacts are not created</p>
          <p className="mt-1 text-sm text-gray-600">
            Check the API logs with <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">docker compose logs api</code>. This usually means the payload format is unexpected. Ensure you selected the correct provider in Settings.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Duplicate messages</p>
          <p className="mt-1 text-sm text-gray-600">
            OpenConduit deduplicates messages by their provider message ID. If you see duplicates, check that your provider isn't sending to multiple webhook URLs.
          </p>
        </div>
      </div>
    </div>
  );
}
