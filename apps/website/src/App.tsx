import { 
  GitBranch, 
  MessageSquare, 
  Users, 
  Terminal, 
  Shield, 
  Zap, 
  ArrowRight, 
  Github, 
  CheckCircle2, 
  Smartphone, 
  Globe, 
  Layout, 
  Database, 
  Copy, 
  ExternalLink,
  Send,
  LayoutDashboard,
  Settings,
  Clock,
  LogOut,
  ArrowLeft,
  User,
  Bell,
  BarChart3,
  TrendingUp,
  PieChart
} from "lucide-react";
import clsx from "clsx";
import { CodeBlock } from "./components/CodeBlock";
import { Routes, Route, Link } from "react-router-dom";
import { DocsLayout } from "./components/DocsLayout";
import QuickStartPage from "./pages/docs/QuickStart";
import ApiReferencePage from "./pages/docs/ApiReference";
import WhatsAppSetupPage from "./pages/docs/WhatsAppSetup";
import WebhooksPage from "./pages/docs/Webhooks";
import SecurityPage from "./pages/docs/Security";
import ContributingPage from "./pages/docs/Contributing";

// ... (keep existing Nav, Hero, Features, WhyOpenConduit, SelfHosting, Docs, Footer components as they are)

function Nav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="OpenConduit" className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight text-gray-900">OpenConduit</span>
        </div>
        
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
          <Link to="/docs/quick-start" className="text-sm font-medium text-gray-600 hover:text-gray-900">Documentation</Link>
          <a href="https://github.com/growvth/openconduit" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-gray-900">GitHub</a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/growvth/openconduit"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-gray-800"
          >
            Deploy Now
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const [copied, setCopied] = (window as any).useState?.(false) ?? [false, () => {}];
  
  const copyCommand = () => {
    navigator.clipboard.writeText("git clone https://github.com/growvth/openconduit.git\ncd openconduit\n./scripts/dev.sh");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-32 sm:pb-24 sm:pt-48">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-600 ring-1 ring-inset ring-brand-600/10 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500"></span>
            </span>
            v0.1.0-alpha is now live
          </div>
          
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
            The WhatsApp CRM for <br />
            <span className="gradient-text">Solo Operators</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Own your customer data. Self-host your WhatsApp CRM in minutes. 
            Built for freelancers, solo-founders, and small teams.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://github.com/growvth/openconduit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-brand-500/20 transition-all hover:bg-brand-600 sm:w-auto"
            >
              Get Started for Free
              <ArrowRight className="h-5 w-5" />
            </a>
            <Link
              to="/docs/quick-start"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-bold text-gray-900 transition-all hover:bg-gray-50 sm:w-auto"
            >
              <Terminal className="h-5 w-5 text-gray-500" />
              Read Documentation
            </Link>
          </div>

          {/* Mini Terminal UI */}
          <div className="mx-auto mt-16 max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <button 
                onClick={copyCommand}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-6 text-left font-mono text-sm leading-relaxed sm:text-base">
              <div className="flex gap-3">
                <span className="text-brand-400">$</span>
                <span className="text-white">git clone <span className="text-emerald-400">https://github.com/growvth/openconduit.git</span></span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-brand-400">$</span>
                <span className="text-white">cd openconduit</span>
              </div>
              <div className="flex gap-3 mt-1">
                <span className="text-brand-400">$</span>
                <span className="text-white">./scripts/dev.sh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      title: "Self-Hostable",
      description: "Run OpenConduit on your own VPS or local machine with Docker Compose.",
      icon: Shield,
      color: "text-blue-600 bg-blue-50"
    },
    {
      title: "Real-time Chat",
      description: "Instant messaging with customers via WhatsApp Business API gateway.",
      icon: MessageSquare,
      color: "text-green-600 bg-green-50"
    },
    {
      title: "Lead Pipeline",
      description: "Track your sales process with a clean, visual lead management system.",
      icon: Zap,
      color: "text-amber-600 bg-amber-50"
    },
    {
      title: "Data Ownership",
      description: "Your contacts, messages, and notes stay on your server. No vendor lock-in.",
      icon: Database,
      color: "text-purple-600 bg-purple-50"
    },
    {
      title: "Reminders",
      description: "Never forget a follow-up with integrated contact-linked reminders.",
      icon: Bell,
      color: "text-rose-600 bg-rose-50"
    },
    {
      title: "Open Source",
      description: "Transparent, community-driven, and free to use under the MIT license.",
      icon: Github,
      color: "text-gray-600 bg-gray-50"
    }
  ];

  return (
    <section id="features" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-base font-semibold text-brand-600">Powerful Core</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything you need to grow</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className={clsx("mb-5 flex h-12 w-12 items-center justify-center rounded-xl", feature.color)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyOpenConduit() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built for the way you <br />
              <span className="gradient-text">actually work</span>
            </h2>
            <p className="mt-6 text-lg text-gray-600">
              OpenConduit isn't another bloated enterprise CRM. It's a focused tool designed to make WhatsApp communication efficient for solo businesses.
            </p>
            
            <ul className="mt-10 space-y-4">
              {[
                "Clean, distraction-free interface",
                "Fast, keyboard-friendly workflows",
                "Built-in WhatsApp API gateway abstraction",
                "Export your data to CSV/JSON anytime"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="rounded-full bg-emerald-100 p-1 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-50 to-emerald-50 p-4 sm:p-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="rounded-xl bg-white p-3 shadow-sm sm:p-4">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600 sm:h-10 sm:w-10 sm:text-sm">M</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-900 sm:text-sm">Marco Silva</p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">+55 11 9876-5432</p>
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

function SelfHosting() {
  return (
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <span className="ml-2 text-xs font-mono text-white/40">docker-compose.yml</span>
              </div>
              <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed text-emerald-400">
{`services:
  app:
    image: openconduit/app:latest
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=\${DATABASE_URL}
      - JWT_SECRET=\${JWT_SECRET}
  db:
    image: postgres:16-alpine
    volumes:
      - ./data:/var/lib/postgresql/data`}
              </pre>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Honest Self-Hosting
            </h2>
            <p className="mt-6 text-lg text-gray-400">
              No complex setup. No "enterprise" requirements. If you can run Docker, you can run OpenConduit. 
            </p>
            <div className="mt-10 space-y-6">
              {[
                { title: "One Command Deployment", desc: "Up and running with docker-compose up -d." },
                { title: "Standard Tech Stack", desc: "Node.js, React, and PostgreSQL. Easy to maintain." },
                { title: "Free TLS with Caddy", desc: "Automatic HTTPS certificates for your webhook URL." }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-brand-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Docs() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-3xl bg-brand-600 px-6 py-16 sm:px-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to take control <br />of your customer data?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-brand-100">
              OpenConduit is free, open-source, and ready to deploy. Read our quick-start guide to begin.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/docs/quick-start"
                className="flex w-full items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-bold text-brand-600 transition-all hover:bg-brand-50 sm:w-auto"
              >
                Get Started
              </Link>
              <a
                href="https://github.com/growvth/openconduit"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-400 bg-brand-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-brand-700 sm:w-auto"
              >
                <Github className="h-5 w-5" />
                Star on GitHub
              </a>
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

function CrmPreview() {
  /* Matches the real app's Layout.tsx sidebar */
  const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false },
    { icon: MessageSquare, label: "Conversations", active: false },
    { icon: Users, label: "Contacts", active: false },
    { icon: Bell, label: "Reminders", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  /* Stats for the Dashboard preview */
  const stats = [
    { label: "Open Chats", value: "12", icon: MessageSquare, color: "text-blue-600 bg-blue-50" },
    { label: "Contacts", value: "482", icon: Users, color: "text-green-600 bg-green-50" },
    { label: "Reminders", value: "8", icon: Bell, color: "text-amber-600 bg-amber-50" },
  ];

  const messageVolumeData = [
    { name: "Mon", in: 40, out: 24 },
    { name: "Tue", in: 30, out: 13 },
    { name: "Wed", in: 20, out: 98 },
    { name: "Thu", in: 27, out: 39 },
    { name: "Fri", in: 18, out: 48 },
    { name: "Sat", in: 23, out: 38 },
    { name: "Sun", in: 34, out: 43 },
  ];

  return (
    <section className="py-24 sm:py-32 overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            A CRM that feels like <span className="gradient-text">home</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 sm:text-lg">
            Clean, fast, and built for how you actually work with WhatsApp.
          </p>
        </div>

        {/* Dynamic UI Layout — Overlapping Mockups */}
        <div className="relative mx-auto max-w-5xl h-[600px] sm:h-[750px]">
          
          {/* Mockup 1: Dashboard (Bottom Left, Angled) */}
          <div className="absolute left-0 top-20 w-[85%] lg:w-[70%] z-10 transition-transform duration-500 hover:scale-[1.02] hover:z-30">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="ml-2 text-[10px] font-medium text-gray-400">Dashboard</span>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50/30">
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {stats.map(s => (
                    <div key={s.label} className="rounded-xl border border-gray-100 bg-white p-3">
                      <p className="text-[10px] font-medium text-gray-500 truncate">{s.label}</p>
                      <p className="text-sm font-bold text-gray-900">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[11px] font-bold text-gray-900">Message Volume</h4>
                    <TrendingUp className="h-3 w-3 text-brand-500" />
                  </div>
                  <div className="flex items-end justify-between gap-1 h-24">
                    {messageVolumeData.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col-reverse gap-0.5 h-full">
                          <div className="bg-brand-500 rounded-sm w-full" style={{ height: `${d.out}%` }} />
                          <div className="bg-brand-200 rounded-sm w-full" style={{ height: `${d.in}%` }} />
                        </div>
                        <span className="text-[8px] text-gray-400 uppercase font-medium">{d.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup 2: Conversations (Top Right, Main Focus) */}
          <div className="absolute right-0 top-0 w-[90%] lg:w-[75%] z-20 transition-transform duration-500 hover:scale-[1.02] hover:z-30">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-brand-500/10">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <div className="ml-4 flex h-6 items-center gap-2 rounded-md bg-gray-100 px-3">
                  <Smartphone className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-500">Sarah Chen (+1 555-0123)</span>
                </div>
              </div>
              <div className="flex" style={{ height: "380px" }}>
                {/* Mini Sidebar */}
                <div className="hidden sm:flex w-16 flex-col border-r border-gray-100 bg-gray-50/50 py-4 items-center gap-4">
                  <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-xs">O</div>
                  {sidebarItems.map((item, i) => (
                    <div key={i} className={clsx("p-2 rounded-lg", i === 1 ? "text-brand-600 bg-brand-50" : "text-gray-400")}>
                      <item.icon className="h-4 w-4" />
                    </div>
                  ))}
                </div>
                {/* Chat Area */}
                <div className="flex-1 flex flex-col bg-white">
                  <div className="p-4 flex-1 space-y-4 overflow-hidden">
                    <div className="flex justify-start">
                      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-[11px] text-gray-700 leading-relaxed shadow-sm">
                        Hi! I saw your products online. Do you ship internationally?
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-tr-sm bg-brand-500 px-3 py-2 text-[11px] text-white leading-relaxed shadow-md">
                        Yes, we ship worldwide! Free delivery on orders above $99. 🌍
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[75%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-[11px] text-gray-700 leading-relaxed shadow-sm">
                        That's great! Can you send me the catalog?
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 flex gap-2">
                    <div className="flex-1 rounded-full bg-gray-50 border border-gray-200 px-4 py-1.5 text-[10px] text-gray-400">Type a message...</div>
                    <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-sm">
                      <Send className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mockup 3: Pipeline/Contacts (Bottom Right, Offset) */}
          <div className="absolute right-4 bottom-10 w-[70%] lg:w-[50%] z-10 transition-transform duration-500 hover:scale-[1.02] hover:z-30 hidden sm:block">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-bold text-gray-900">Active Contacts</h4>
                  <Users className="h-3.5 w-3.5 text-brand-500" />
                </div>
              </div>
              <div className="p-3 space-y-2">
                {[
                  { name: "Marco Silva", stage: "Interested", color: "bg-blue-100 text-blue-700" },
                  { name: "James Wilson", stage: "New Lead", color: "bg-indigo-100 text-indigo-700" },
                  { name: "Sarah Chen", stage: "Converted", color: "bg-emerald-100 text-emerald-700" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg border border-gray-50 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700">{c.name[0]}</div>
                      <span className="text-[10px] font-semibold text-gray-900">{c.name}</span>
                    </div>
                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-bold", c.color)}>{c.stage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <CrmPreview />
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
