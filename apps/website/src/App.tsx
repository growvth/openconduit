import { useState } from "react";
import {
  MessageSquare,
  Users,
  Bell,
  Shield,
  Server,
  GitBranch,
  Terminal,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Tag,
  BarChart3,
  Zap,
  Globe,
  Lock,
  Database,
  Copy,
  ExternalLink,
} from "lucide-react";
import clsx from "clsx";

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold">OpenConduit</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
          <a href="#self-hosting" className="text-sm font-medium text-gray-600 hover:text-gray-900">Self-Hosting</a>
          <a href="#docs" className="text-sm font-medium text-gray-600 hover:text-gray-900">Docs</a>
          <a
            href="https://github.com/maskedsyntax/openconduit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#features" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">Features</a>
            <a href="#self-hosting" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">Self-Hosting</a>
            <a href="#docs" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">Docs</a>
            <a
              href="https://github.com/maskedsyntax/openconduit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const [copied, setCopied] = useState(false);

  const copyCommand = () => {
    navigator.clipboard.writeText("git clone https://github.com/maskedsyntax/openconduit.git && cd openconduit && docker compose up");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-100/30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
          <span className="flex h-2 w-2 rounded-full bg-brand-500" />
          Open Source &middot; Self-Hostable &middot; Free Forever
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Your WhatsApp CRM,{" "}
          <span className="gradient-text">on your server</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 leading-relaxed">
          OpenConduit is the open-source WhatsApp CRM built for solo operators
          and small teams. Manage contacts, conversations, and lead pipelines
          — all self-hosted, all yours.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#self-hosting"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600 transition-all hover:shadow-xl hover:shadow-brand-500/30"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/maskedsyntax/openconduit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
          >
            <GitBranch className="h-5 w-5" />
            View on GitHub
          </a>
        </div>

        {/* Quick start command */}
        <div className="mx-auto mt-12 max-w-xl">
          <button
            onClick={copyCommand}
            className="group flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-gray-900 px-5 py-3.5 text-left shadow-lg transition-all hover:border-gray-300"
          >
            <Terminal className="h-5 w-5 flex-shrink-0 text-brand-400" />
            <code className="flex-1 truncate font-mono text-sm text-gray-300">
              git clone ... && docker compose up
            </code>
            {copied ? (
              <Check className="h-4 w-4 text-brand-400" />
            ) : (
              <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: "Conversation Management",
    description: "Full WhatsApp chat interface with message history, delivery status tracking, and 24-hour session window awareness.",
  },
  {
    icon: Users,
    title: "Contact CRM",
    description: "Create, organize, and search contacts. Attach tags, notes, and assign pipeline stages to track your leads.",
  },
  {
    icon: Tag,
    title: "Smart Tagging",
    description: "Auto-tag contacts based on message keywords. Configurable rules engine that runs on every inbound message.",
  },
  {
    icon: BarChart3,
    title: "Lead Pipeline",
    description: "Visual pipeline stages from New Lead to Converted. Track every contact's journey through your sales process.",
  },
  {
    icon: Bell,
    title: "Follow-up Reminders",
    description: "Never miss a follow-up. Set reminders for any contact with due dates, notes, and overdue alerts.",
  },
  {
    icon: Zap,
    title: "Quick Reply Templates",
    description: "Store reusable message snippets. Access them with a shortcut while composing messages.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Admin and Agent roles with fine-grained permissions. Agents see only their assigned contacts and conversations.",
  },
  {
    icon: Globe,
    title: "Multi-Provider Support",
    description: "Works with Meta Cloud API, 360dialog, and Twilio. Switch providers via config, not code.",
  },
  {
    icon: Lock,
    title: "Compliance Built-In",
    description: "Opt-in consent tracking, template-only broadcasts, and data export. GDPR-ready contact deletion with audit trails.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run your
            <br />
            <span className="gradient-text">WhatsApp business</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            A complete CRM built specifically for WhatsApp-first businesses.
            No bloat, no compromises.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelfHosting() {
  return (
    <section id="self-hosting" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Deploy in <span className="gradient-text">minutes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            One command to spin up. Your data stays on your server. Always.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Steps */}
          <div className="space-y-8">
            {[
              {
                step: "1",
                title: "Clone & configure",
                description: "Clone the repository and copy .env.example to .env. Set your database password, JWT secret, and domain.",
                code: "git clone https://github.com/maskedsyntax/openconduit.git\ncd openconduit\ncp .env.example .env",
              },
              {
                step: "2",
                title: "Start the stack",
                description: "Docker Compose brings up the API, database, and reverse proxy with automatic TLS.",
                code: "docker compose up -d",
              },
              {
                step: "3",
                title: "Configure WhatsApp",
                description: "Open the Settings page, enter your WhatsApp provider credentials, and copy the webhook URL to your provider dashboard.",
                code: "# Visit https://yourdomain.com\n# Login as admin@openconduit.dev\n# Go to Settings > WhatsApp Provider",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-900 p-3 text-sm">
                    <code className="font-mono text-gray-300">{item.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements card */}
          <div>
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Requirements
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Server, text: "A Linux VPS (Ubuntu 22.04+ recommended) or any Docker-capable host" },
                  { icon: Globe, text: "A registered domain name with DNS pointed to your server" },
                  { icon: MessageSquare, text: "A WhatsApp Business API provider account (360dialog, Meta, or Twilio)" },
                  { icon: Database, text: "Docker and Docker Compose installed on the server" },
                ].map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                      <req.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-gray-600 pt-1">{req.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-brand-50 p-4">
                <p className="text-sm font-medium text-brand-800">
                  No telemetry. No tracking. No data sent to our servers.
                </p>
                <p className="mt-1 text-sm text-brand-600">
                  OpenConduit is fully self-contained. Your data never leaves your infrastructure.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Environment Variables
              </h3>
              <div className="overflow-x-auto rounded-lg bg-gray-900 p-4">
                <pre className="font-mono text-xs text-gray-300 leading-relaxed">{`DATABASE_URL=postgresql://user:pass@db:5432/openconduit
JWT_SECRET=<random-64-char-string>
WHATSAPP_PROVIDER=360dialog
WHATSAPP_API_KEY=<your-api-key>
WHATSAPP_PHONE_NUMBER_ID=<your-phone-id>
WHATSAPP_WEBHOOK_SECRET=<your-secret>
PUBLIC_URL=https://openconduit.yourdomain.com`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Docs() {
  return (
    <section id="docs" className="py-24 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Documentation
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Everything you need to get up and running.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Quick Start Guide",
              description: "Get OpenConduit running in under 5 minutes with Docker Compose.",
              link: "#self-hosting",
            },
            {
              title: "API Reference",
              description: "Full REST API documentation with authentication, contacts, messages, and more.",
              link: "https://github.com/maskedsyntax/openconduit",
            },
            {
              title: "WhatsApp Provider Setup",
              description: "Step-by-step guides for configuring Meta Cloud API, 360dialog, and Twilio.",
              link: "https://github.com/maskedsyntax/openconduit",
            },
            {
              title: "Webhook Configuration",
              description: "How to expose your instance, register webhooks, and handle verification.",
              link: "https://github.com/maskedsyntax/openconduit",
            },
            {
              title: "Security Best Practices",
              description: "JWT configuration, webhook HMAC validation, rate limiting, and password policies.",
              link: "https://github.com/maskedsyntax/openconduit",
            },
            {
              title: "Contributing",
              description: "How to contribute to OpenConduit. Development setup, coding standards, and PR process.",
              link: "https://github.com/maskedsyntax/openconduit",
            },
          ].map((doc) => (
            <a
              key={doc.title}
              href={doc.link}
              target={doc.link.startsWith("http") ? "_blank" : undefined}
              rel={doc.link.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-brand-200"
            >
              <h3 className="mb-2 flex items-center gap-2 text-base font-semibold text-gray-900 group-hover:text-brand-600">
                {doc.title}
                <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="text-sm text-gray-500">{doc.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyOpenConduit() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for <span className="gradient-text">real businesses</span>
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              OpenConduit is designed for freelancers, agencies, and local
              businesses in emerging markets who already use WhatsApp as their
              primary business channel. No complex setup, no per-seat pricing,
              no vendor lock-in.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Your data stays on your server - full data sovereignty",
                "No per-seat or per-message fees from OpenConduit",
                "Export all data as JSON or CSV at any time",
                "Works with your existing WhatsApp Business API provider",
                "Runs on a $5/month VPS - no expensive infrastructure",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <Check className="h-3 w-3 text-brand-600" />
                  </div>
                  <p className="text-sm text-gray-600">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-8">
            <div className="space-y-4">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">R</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rahul Sharma</p>
                    <p className="text-xs text-gray-500">+91 98765 43210</p>
                  </div>
                  <span className="ml-auto rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">Interested</span>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2">
                    <p className="text-sm text-gray-700">Hi, I saw your product demo. What's the pricing?</p>
                    <p className="mt-1 text-[10px] text-gray-400">10:23 AM</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="rounded-2xl rounded-tr-sm bg-brand-500 px-4 py-2">
                    <p className="text-sm text-white">Thanks for reaching out! Let me share our pricing guide.</p>
                    <p className="mt-1 text-[10px] text-brand-200">10:25 AM &middot; Read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold">OpenConduit</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/maskedsyntax/openconduit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
            <a href="#features" className="text-sm text-gray-500 hover:text-gray-900">
              Features
            </a>
            <a href="#docs" className="text-sm text-gray-500 hover:text-gray-900">
              Docs
            </a>
          </div>

          <p className="text-xs text-gray-400">
            MIT License &middot; Made for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <WhyOpenConduit />
      <SelfHosting />
      <Docs />
      <Footer />
    </>
  );
}
