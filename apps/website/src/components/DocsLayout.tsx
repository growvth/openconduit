import { Link, useLocation } from "react-router-dom";
import { GitBranch, ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";
import clsx from "clsx";

const docNav = [
  { title: "Quick Start", path: "/docs/quick-start" },
  { title: "API Reference", path: "/docs/api-reference" },
  { title: "WhatsApp Provider Setup", path: "/docs/whatsapp-setup" },
  { title: "Webhook Configuration", path: "/docs/webhooks" },
  { title: "Security Best Practices", path: "/docs/security" },
  { title: "Contributing", path: "/docs/contributing" },
];

export function DocsLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const currentIndex = docNav.findIndex((d) => d.path === location.pathname);
  const prev = currentIndex > 0 ? docNav[currentIndex - 1] : null;
  const next = currentIndex < docNav.length - 1 ? docNav[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.svg" alt="OpenConduit" className="h-6" />
              <span className="text-base font-bold">OpenConduit</span>
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm font-medium text-gray-500">Docs</span>
          </div>
          <a
            href="https://github.com/growvth/openconduit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            <GitBranch className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex gap-8 py-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="hidden w-56 flex-shrink-0 lg:block">
            <div className="sticky top-20">
              <Link
                to="/"
                className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to home
              </Link>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Documentation
              </h3>
              <nav className="space-y-0.5">
                {docNav.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-brand-50 text-brand-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Mobile doc nav */}
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-2 lg:hidden">
            <div className="flex gap-1 overflow-x-auto">
              {docNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex-shrink-0 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap",
                    location.pathname === item.path
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-500 hover:bg-gray-50",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Content */}
          <main className="min-w-0 flex-1 pb-20 lg:pb-8">
            <article className="prose-docs">{children}</article>

            {/* Prev/Next navigation */}
            {(prev || next) && (
              <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6">
                {prev ? (
                  <Link
                    to={prev.path}
                    className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                    {prev.title}
                  </Link>
                ) : <div />}
                {next && (
                  <Link
                    to={next.path}
                    className="group flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
                  >
                    {next.title}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
