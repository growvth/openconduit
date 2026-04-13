import { CodeBlock } from "../../components/CodeBlock";

export function WhatsAppSetupPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">WhatsApp Provider Setup</h1>
      <p className="mt-3 text-gray-600 leading-relaxed">
        OpenConduit supports three WhatsApp Business API providers. Choose the one that fits your region and pricing needs, then follow the guide below.
      </p>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-800">Before you begin</p>
        <p className="mt-1 text-sm text-blue-700">
          Make sure OpenConduit is deployed and accessible at your public URL. You will need the webhook URL from your Settings page during provider setup.
        </p>
      </div>

      {/* Meta Cloud API */}
      <h2 className="mt-10 text-xl font-semibold text-gray-900">Meta Cloud API</h2>
      <p className="mt-2 text-sm text-gray-600">
        The official WhatsApp Business Platform from Meta. Best for direct access with no middleman fees.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">1. Create a Meta App</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Go to <strong>developers.facebook.com</strong> and create a new app.</li>
        <li><strong>2.</strong> Choose <strong>Business</strong> as the app type.</li>
        <li><strong>3.</strong> Add the <strong>WhatsApp</strong> product to your app.</li>
        <li><strong>4.</strong> In the WhatsApp section, note your <strong>Phone Number ID</strong> and <strong>WhatsApp Business Account ID</strong>.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">2. Generate an Access Token</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Navigate to <strong>App Settings &gt; Basic</strong> and note your App Secret.</li>
        <li><strong>2.</strong> Under <strong>WhatsApp &gt; API Setup</strong>, generate a permanent access token.</li>
        <li><strong>3.</strong> For production, create a System User in Business Manager and generate a token with <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">whatsapp_business_messaging</code> and <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">whatsapp_business_management</code> permissions.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">3. Configure the Webhook</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In your Meta App dashboard, go to <strong>WhatsApp &gt; Configuration</strong>.</li>
        <li><strong>2.</strong> Click <strong>Edit</strong> next to the Webhook section.</li>
        <li><strong>3.</strong> Set the Callback URL to your OpenConduit webhook endpoint:</li>
      </ol>
      <div className="mt-3">
        <CodeBlock language="text" code="https://crm.yourdomain.com/webhooks/whatsapp" />
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-600" start={4}>
        <li><strong>4.</strong> Set the Verify Token to the same value you configured in OpenConduit Settings.</li>
        <li><strong>5.</strong> Subscribe to the <strong>messages</strong> webhook field.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">4. Add Credentials to OpenConduit</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In OpenConduit, go to <strong>Settings</strong>.</li>
        <li><strong>2.</strong> Select <strong>Meta Cloud API</strong> as your provider.</li>
        <li><strong>3.</strong> Enter your Access Token, Phone Number ID, and Webhook Secret (App Secret).</li>
        <li><strong>4.</strong> Click <strong>Test Connection</strong> to verify.</li>
      </ol>

      {/* 360dialog */}
      <h2 className="mt-12 text-xl font-semibold text-gray-900">360dialog</h2>
      <p className="mt-2 text-sm text-gray-600">
        A WhatsApp Business Solution Provider (BSP) that simplifies onboarding and provides a cleaner API layer. Popular in LATAM and EMEA.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">1. Create a 360dialog Account</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Sign up at <strong>360dialog.com</strong> and complete business verification.</li>
        <li><strong>2.</strong> Register your WhatsApp phone number through their dashboard.</li>
        <li><strong>3.</strong> Once approved, navigate to your <strong>API Keys</strong> section.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">2. Get Your API Key</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In the 360dialog Hub, go to <strong>API Keys</strong>.</li>
        <li><strong>2.</strong> Generate a new API key for your phone number.</li>
        <li><strong>3.</strong> Copy the API key. You will need it in OpenConduit.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">3. Set Up the Webhook</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In the 360dialog dashboard, go to your number's settings.</li>
        <li><strong>2.</strong> Set the webhook URL to:</li>
      </ol>
      <div className="mt-3">
        <CodeBlock language="text" code="https://crm.yourdomain.com/webhooks/whatsapp" />
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-600" start={3}>
        <li><strong>3.</strong> 360dialog will start forwarding inbound messages to OpenConduit.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">4. Add Credentials to OpenConduit</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In OpenConduit, go to <strong>Settings</strong>.</li>
        <li><strong>2.</strong> Select <strong>360dialog</strong> as your provider.</li>
        <li><strong>3.</strong> Enter your API key.</li>
        <li><strong>4.</strong> Click <strong>Test Connection</strong> to verify.</li>
      </ol>

      {/* Twilio */}
      <h2 className="mt-12 text-xl font-semibold text-gray-900">Twilio</h2>
      <p className="mt-2 text-sm text-gray-600">
        A well-known communications platform. Twilio's WhatsApp API uses their Messaging Service, which may already be familiar if you use Twilio for SMS.
      </p>

      <h3 className="mt-6 text-base font-semibold text-gray-900">1. Set Up Twilio WhatsApp</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> Sign in to your Twilio account at <strong>twilio.com</strong>.</li>
        <li><strong>2.</strong> Go to <strong>Messaging &gt; Try it out &gt; Send a WhatsApp message</strong> to activate the sandbox (for testing) or request a production number.</li>
        <li><strong>3.</strong> Note your <strong>Account SID</strong> and <strong>Auth Token</strong> from the Twilio Console dashboard.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">2. Configure the Webhook</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In the Twilio Console, go to your WhatsApp Sandbox Settings (or your Messaging Service configuration for production).</li>
        <li><strong>2.</strong> Set <strong>When a message comes in</strong> to:</li>
      </ol>
      <div className="mt-3">
        <CodeBlock language="text" code="https://crm.yourdomain.com/webhooks/whatsapp" />
      </div>
      <ol className="mt-3 space-y-2 text-sm text-gray-600" start={3}>
        <li><strong>3.</strong> Set the HTTP method to <strong>POST</strong>.</li>
      </ol>

      <h3 className="mt-6 text-base font-semibold text-gray-900">3. Add Credentials to OpenConduit</h3>
      <ol className="mt-2 space-y-2 text-sm text-gray-600">
        <li><strong>1.</strong> In OpenConduit, go to <strong>Settings</strong>.</li>
        <li><strong>2.</strong> Select <strong>Twilio</strong> as your provider.</li>
        <li><strong>3.</strong> Enter your Account SID, Auth Token, and WhatsApp phone number.</li>
        <li><strong>4.</strong> Click <strong>Test Connection</strong> to verify.</li>
      </ol>

      {/* Provider comparison */}
      <h2 className="mt-12 text-xl font-semibold text-gray-900">Provider Comparison</h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Feature</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Meta Cloud API</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">360dialog</th>
              <th className="px-4 py-2.5 text-left font-medium text-gray-500">Twilio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Pricing</td>
              <td className="px-4 py-2.5 text-gray-600">Per-conversation (Meta rates)</td>
              <td className="px-4 py-2.5 text-gray-600">Monthly + per-conversation</td>
              <td className="px-4 py-2.5 text-gray-600">Per-message</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Setup complexity</td>
              <td className="px-4 py-2.5 text-gray-600">Medium (Meta developer account)</td>
              <td className="px-4 py-2.5 text-gray-600">Low</td>
              <td className="px-4 py-2.5 text-gray-600">Low</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Onboarding time</td>
              <td className="px-4 py-2.5 text-gray-600">1-2 days</td>
              <td className="px-4 py-2.5 text-gray-600">2-5 days</td>
              <td className="px-4 py-2.5 text-gray-600">Same day (sandbox)</td>
            </tr>
            <tr>
              <td className="px-4 py-2.5 font-medium text-gray-900">Best for</td>
              <td className="px-4 py-2.5 text-gray-600">Direct access, high volume</td>
              <td className="px-4 py-2.5 text-gray-600">Simple setup, LATAM/EMEA</td>
              <td className="px-4 py-2.5 text-gray-600">Existing Twilio users</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Common issues */}
      <h2 className="mt-12 text-xl font-semibold text-gray-900">Common Issues</h2>
      <div className="mt-3 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-900">Webhook verification failing?</p>
          <p className="mt-1 text-sm text-gray-600">
            Make sure your OpenConduit instance is reachable from the internet on HTTPS. The verify token in your provider's dashboard must match the one in OpenConduit Settings.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Messages not arriving?</p>
          <p className="mt-1 text-sm text-gray-600">
            Check that you subscribed to the correct webhook fields (for Meta: <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">messages</code>). Verify your webhook URL includes the <code className="rounded bg-gray-100 px-1 py-0.5 text-xs font-mono">/webhooks/whatsapp</code> path.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Test Connection fails?</p>
          <p className="mt-1 text-sm text-gray-600">
            Double-check your API credentials. For Meta, ensure your access token has the required permissions. For 360dialog, verify the API key is active. For Twilio, confirm your Account SID and Auth Token are correct.
          </p>
        </div>
      </div>
    </div>
  );
}
