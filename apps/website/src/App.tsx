import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
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
import { CodeBlock } from "./components/CodeBlock";
import { DocsLayout } from "./components/DocsLayout";
import { QuickStartPage } from "./pages/docs/QuickStart";
import { ApiReferencePage } from "./pages/docs/ApiReference";
import { WhatsAppSetupPage } from "./pages/docs/WhatsAppSetup";
import { WebhooksPage } from "./pages/docs/Webhooks";
import { SecurityPage } from "./pages/docs/Security";
import { ContributingPage } from "./pages/docs/Contributing";

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="OpenConduit" className="h-7" />
          <span className="text-lg font-bold">OpenConduit</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
          <a href="/#self-hosting" className="text-sm font-medium text-gray-600 hover:text-gray-900">Self-Hosting</a>
          <Link to="/docs/quick-start" className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900">
            Docs
            <ExternalLink className="h-3 w-3" />
          </Link>
          <a
            href="https://github.com/growvth/openconduit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            <GitBranch className="h-4 w-4" />
            GitHub
          </a>
        </div>

        <button onClick={() => setOpen(!open)} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            <a href="/#features" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Features</a>
            <a href="/#self-hosting" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Self-Hosting</a>
            <Link to="/docs/quick-start" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Docs
              <ExternalLink className="h-3 w-3" />
            </Link>
            <a
              href="https://github.com/growvth/openconduit"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white"
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
    navigator.clipboard.writeText("git clone https://github.com/growvth/openconduit.git && cd openconduit && docker compose up");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-32 sm:pb-20">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-brand-100/30 blur-3xl sm:h-[600px] sm:w-[900px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <img src="/logo.svg" alt="OpenConduit" className="mx-auto mb-5 h-16 sm:mb-6 sm:h-20" />

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 sm:mb-6 sm:px-4 sm:py-1.5 sm:text-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500 sm:h-2 sm:w-2" />
          Open Source &middot; Self-Hostable &middot; Free Forever
        </div>

        <h1 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Your WhatsApp CRM,
          <br />
          <span className="gradient-text">on your server</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 leading-relaxed sm:mt-6 sm:text-lg">
          OpenConduit is the open-source WhatsApp CRM built for solo operators
          and small teams. Manage contacts, conversations, and lead pipelines,
          all self-hosted, all yours.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <a
            href="#self-hosting"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 sm:w-auto"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </a>
          <a
            href="https://github.com/growvth/openconduit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 sm:w-auto"
          >
            <GitBranch className="h-5 w-5" />
            View on GitHub
          </a>
        </div>

        {/* Quick start command */}
        <div className="mx-auto mt-8 max-w-xl sm:mt-12">
          <button
            onClick={copyCommand}
            className="group flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-900 px-3 py-3 text-left shadow-lg transition-all hover:border-gray-300 sm:gap-3 sm:px-5 sm:py-3.5"
          >
            <Terminal className="h-4 w-4 flex-shrink-0 text-brand-400 sm:h-5 sm:w-5" />
            <code className="flex-1 truncate font-mono text-xs text-gray-300 sm:text-sm">
              git clone ... && docker compose up
            </code>
            {copied ? (
              <Check className="h-4 w-4 flex-shrink-0 text-brand-400" />
            ) : (
              <Copy className="h-4 w-4 flex-shrink-0 text-gray-500 group-hover:text-gray-300" />
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
    <section id="features" className="py-16 bg-gray-50 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Everything you need to run your
            <br />
            <span className="gradient-text">WhatsApp business</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:mt-4 sm:text-base">
            A complete CRM built specifically for WhatsApp-first businesses.
            No bloat, no compromises.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200 sm:p-6"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white sm:mb-4 sm:h-11 sm:w-11">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-gray-900 sm:mb-2 sm:text-base">
                {feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
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
  const steps = [
    {
      step: "1",
      title: "Clone & configure",
      description: "Clone the repository and copy .env.example to .env. Set your database password, JWT secret, and domain.",
      code: "git clone https://github.com/growvth/openconduit.git\ncd openconduit\ncp .env.example .env",
      language: "bash" as const,
    },
    {
      step: "2",
      title: "Start the stack",
      description: "Docker Compose brings up the API, database, and reverse proxy with automatic TLS.",
      code: "docker compose up -d",
      language: "bash" as const,
    },
    {
      step: "3",
      title: "Configure WhatsApp",
      description: "Open the Settings page, enter your WhatsApp provider credentials, and copy the webhook URL to your provider dashboard.",
      code: "# Visit https://yourdomain.com\n# Login as admin@openconduit.dev\n# Go to Settings > WhatsApp Provider",
      language: "bash" as const,
    },
  ];

  return (
    <section id="self-hosting" className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Deploy in <span className="gradient-text">minutes</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:mt-4 sm:text-base">
            One command to spin up. Your data stays on your server. Always.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:mt-16 lg:grid-cols-2 lg:gap-12">
          {/* Steps */}
          <div className="space-y-6 sm:space-y-8">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-3 sm:gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white sm:h-9 sm:w-9 sm:text-sm">
                  {item.step}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                    {item.description}
                  </p>
                  <div className="mt-3">
                    <CodeBlock language={item.language} code={item.code} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Requirements card */}
          <div className="space-y-4 sm:space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <h3 className="mb-4 text-base font-semibold text-gray-900 sm:mb-6 sm:text-lg">
                Requirements
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { icon: Server, text: "A Linux VPS (Ubuntu 22.04+ recommended) or any Docker-capable host" },
                  { icon: Globe, text: "A registered domain name with DNS pointed to your server" },
                  { icon: MessageSquare, text: "A WhatsApp Business API provider account (360dialog, Meta, or Twilio)" },
                  { icon: Database, text: "Docker and Docker Compose installed on the server" },
                ].map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 sm:h-8 sm:w-8">
                      <req.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <p className="text-xs text-gray-600 pt-1 sm:text-sm">{req.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-brand-50 p-3 sm:mt-8 sm:p-4">
                <p className="text-xs font-medium text-brand-800 sm:text-sm">
                  No telemetry. No tracking. No data sent to our servers.
                </p>
                <p className="mt-1 text-xs text-brand-600 sm:text-sm">
                  OpenConduit is fully self-contained. Your data never leaves your infrastructure.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
              <h3 className="mb-3 text-base font-semibold text-gray-900 sm:mb-4 sm:text-lg">
                Environment Variables
              </h3>
              <CodeBlock
                language="env"
                code={`DATABASE_URL=postgresql://user:pass@db:5432/openconduit
JWT_SECRET=<random-64-char-string>
WHATSAPP_PROVIDER=360dialog
WHATSAPP_API_KEY=<your-api-key>
WHATSAPP_PHONE_NUMBER_ID=<your-phone-id>
WHATSAPP_WEBHOOK_SECRET=<your-secret>
PUBLIC_URL=https://openconduit.yourdomain.com`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const docLinks = [
  {
    title: "Quick Start Guide",
    description: "Get OpenConduit running in under 5 minutes with Docker Compose.",
    path: "/docs/quick-start",
  },
  {
    title: "API Reference",
    description: "Full REST API documentation with authentication, contacts, messages, and more.",
    path: "/docs/api-reference",
  },
  {
    title: "WhatsApp Provider Setup",
    description: "Step-by-step guides for configuring Meta Cloud API, 360dialog, and Twilio.",
    path: "/docs/whatsapp-setup",
  },
  {
    title: "Webhook Configuration",
    description: "How to expose your instance, register webhooks, and handle verification.",
    path: "/docs/webhooks",
  },
  {
    title: "Security Best Practices",
    description: "JWT configuration, webhook HMAC validation, rate limiting, and password policies.",
    path: "/docs/security",
  },
  {
    title: "Contributing",
    description: "How to contribute to OpenConduit. Development setup, coding standards, and PR process.",
    path: "/docs/contributing",
  },
];

function Docs() {
  return (
    <section id="docs" className="py-16 bg-gray-50 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Documentation
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 sm:mt-4 sm:text-base">
            Everything you need to get up and running.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {docLinks.map((doc) => (
            <Link
              key={doc.title}
              to={doc.path}
              className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-brand-200 sm:p-6"
            >
              <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-gray-900 group-hover:text-brand-600 sm:mb-2 sm:text-base">
                {doc.title}
                <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </h3>
              <p className="text-xs text-gray-500 sm:text-sm">{doc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyOpenConduit() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              Built for <span className="gradient-text">real businesses</span>
            </h2>
            <p className="mt-3 text-sm text-gray-600 leading-relaxed sm:mt-4 sm:text-base">
              OpenConduit is designed for freelancers, agencies, and local
              businesses in emerging markets who already use WhatsApp as their
              primary business channel. No complex setup, no per-seat pricing,
              no vendor lock-in.
            </p>

            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {[
                "Your data stays on your server - full data sovereignty",
                "No per-seat or per-message fees from OpenConduit",
                "Export all data as JSON or CSV at any time",
                "Works with your existing WhatsApp Business API provider",
                "Runs on a $5/month VPS - no expensive infrastructure",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 sm:gap-3">
                  <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-100">
                    <Check className="h-3 w-3 text-brand-600" />
                  </div>
                  <p className="text-xs text-gray-600 sm:text-sm">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-4 sm:p-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 sm:h-10 sm:w-10 sm:text-sm">R</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 sm:text-sm">Rahul Sharma</p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">+91 98765 43210</p>
                  </div>
                  <span className="flex-shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-medium text-brand-700 sm:text-xs">Interested</span>
                </div>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
                <div className="flex gap-2 sm:gap-3">
                  <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 sm:px-4">
                    <p className="text-xs text-gray-700 sm:text-sm">Hi, I saw your product demo. What's the pricing?</p>
                    <p className="mt-1 text-[10px] text-gray-400">10:23 AM</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-brand-500 px-3 py-2 sm:px-4">
                    <p className="text-xs text-white sm:text-sm">Thanks for reaching out! Let me share our pricing guide.</p>
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
    <footer className="border-t border-gray-200 bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="OpenConduit" className="h-6" />
            <span className="text-sm font-bold">OpenConduit</span>
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <a
              href="https://github.com/growvth/openconduit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
            >
              <GitBranch className="h-4 w-4" />
              GitHub
            </a>
            <a href="/#features" className="text-sm text-gray-500 hover:text-gray-900">
              Features
            </a>
            <Link to="/docs/quick-start" className="text-sm text-gray-500 hover:text-gray-900">
              Docs
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            MIT License &middot; Made for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/docs/quick-start" element={<DocsLayout><QuickStartPage /></DocsLayout>} />
      <Route path="/docs/api-reference" element={<DocsLayout><ApiReferencePage /></DocsLayout>} />
      <Route path="/docs/whatsapp-setup" element={<DocsLayout><WhatsAppSetupPage /></DocsLayout>} />
      <Route path="/docs/webhooks" element={<DocsLayout><WebhooksPage /></DocsLayout>} />
      <Route path="/docs/security" element={<DocsLayout><SecurityPage /></DocsLayout>} />
      <Route path="/docs/contributing" element={<DocsLayout><ContributingPage /></DocsLayout>} />
    </Routes>
  );
}
