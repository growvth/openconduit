import { useState, useEffect, type FormEvent } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Settings, Wifi, WifiOff, Copy, Check } from "lucide-react";

interface AppSettings {
  whatsappProvider: string | null;
  whatsappApiKey: string | null;
  whatsappPhoneNumberId: string | null;
  whatsappWebhookSecret: string | null;
  autoOptInOnFirstMessage: boolean;
  webhookUrl: string;
}

export function SettingsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [autoOptIn, setAutoOptIn] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    async function load() {
      try {
        const data = await api.get<AppSettings>("/settings");
        setSettings(data);
        setProvider(data.whatsappProvider ?? "");
        setPhoneNumberId(data.whatsappPhoneNumberId ?? "");
        setAutoOptIn(data.autoOptInOnFirstMessage);
      } catch {
        // failed
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAdmin]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = { autoOptInOnFirstMessage: autoOptIn };
      if (provider) body.whatsappProvider = provider;
      if (apiKey) body.whatsappApiKey = apiKey;
      if (phoneNumberId) body.whatsappPhoneNumberId = phoneNumberId;
      if (webhookSecret) body.whatsappWebhookSecret = webhookSecret;

      const data = await api.put<AppSettings>("/settings", body);
      setSettings(data);
      setApiKey("");
      setWebhookSecret("");
    } catch {
      // failed
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ connected: boolean }>("/settings/test-connection");
      setTestResult(result.connected);
    } catch {
      setTestResult(false);
    } finally {
      setTesting(false);
    }
  };

  const copyWebhookUrl = () => {
    if (settings?.webhookUrl) {
      navigator.clipboard.writeText(settings.webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Admin access required</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your WhatsApp provider and app settings
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        {/* Webhook URL */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
            <Settings className="h-5 w-5" />
            Webhook URL
          </h2>
          <p className="mb-3 text-sm text-gray-500">
            Copy this URL and paste it into your WhatsApp provider dashboard as
            the webhook callback URL.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700">
              {settings?.webhookUrl}
            </code>
            <button
              onClick={copyWebhookUrl}
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Provider settings */}
        <form
          onSubmit={handleSave}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="mb-4 font-semibold text-gray-900">
            WhatsApp Provider
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provider
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">Select provider...</option>
                <option value="meta">Meta Cloud API</option>
                <option value="360dialog">360dialog</option>
                <option value="twilio">Twilio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={settings?.whatsappApiKey ? "••••••••" : "Enter API key"}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number ID
              </label>
              <input
                type="text"
                value={phoneNumberId}
                onChange={(e) => setPhoneNumberId(e.target.value)}
                placeholder="Enter phone number ID"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Webhook Secret
              </label>
              <input
                type="password"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
                placeholder={settings?.whatsappWebhookSecret ? "••••••••" : "Enter webhook secret"}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                id="autoOptIn"
                type="checkbox"
                checked={autoOptIn}
                onChange={(e) => setAutoOptIn(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <label htmlFor="autoOptIn" className="text-sm text-gray-700">
                Auto opt-in contacts when they send the first message
              </label>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {testing ? (
                "Testing..."
              ) : testResult === true ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  Connected
                </>
              ) : testResult === false ? (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  Failed
                </>
              ) : (
                "Test Connection"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
