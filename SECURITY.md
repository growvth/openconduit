# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in OpenConduit, **please do not open a public GitHub issue.**

Instead, report it privately using [GitHub's private vulnerability reporting](https://github.com/growvth/openconduit/security/advisories/new).

When filing a report, include as much detail as possible:

- A description of the vulnerability
- Steps to reproduce
- The potential impact
- Any suggested fix (optional, but appreciated)

## What to Expect

- **Acknowledgment** within 48 hours of your report via the GitHub advisory thread.
- **Status update** within 7 days with an initial assessment.
- **Resolution timeline** shared once we've triaged the issue. We aim to patch critical issues within 14 days.
- **Credit** in the release notes (unless you prefer to remain anonymous).

## Scope

The following are in scope for security reports:

- Authentication and authorization bypasses
- Injection vulnerabilities (SQL, command, XSS, etc.)
- Webhook signature validation bypasses
- Sensitive data exposure
- Privilege escalation between ADMIN and AGENT roles
- Insecure defaults that could lead to compromise

The following are out of scope:

- Vulnerabilities in third-party WhatsApp providers (Meta, 360dialog, Twilio)
- Issues that require physical access to the server
- Denial of service attacks
- Social engineering
- Issues in dependencies that already have upstream fixes (please check first)

## Supported Versions

| Version | Supported |
|---|---|
| Latest release on `main` | Yes |
| Older releases | Best effort |

## Security Design

OpenConduit is designed to be self-hosted, which means the operator is responsible for infrastructure-level security (disk encryption, network isolation, database backups, OS patching). The application layer handles:

- **Password hashing** with bcrypt (cost factor 12)
- **JWT authentication** with configurable expiry
- **Webhook HMAC validation** with timing-safe comparison
- **Rate limiting** on all API endpoints
- **Input validation** on every route via Zod schemas
- **Role-based access control** enforced at the route level
- **No telemetry or external data transmission**

Thank you for helping keep OpenConduit and its users safe.
