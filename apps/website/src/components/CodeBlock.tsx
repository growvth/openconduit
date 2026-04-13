import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: "bash" | "env" | "json" | "typescript" | "sql" | "text";
  title?: string;
}

function highlightBash(code: string): React.ReactNode[] {
  return code.split("\n").map((line, i) => {
    const trimmed = line.trimStart();

    // Comments
    if (trimmed.startsWith("#")) {
      return <span key={i} className="text-gray-400 italic">{line}{"\n"}</span>;
    }

    // Highlight commands and flags
    const parts: React.ReactNode[] = [];
    let remaining = line;
    let partKey = 0;

    // Match leading $ prompt
    if (trimmed.startsWith("$ ")) {
      const indent = line.length - trimmed.length;
      parts.push(<span key={partKey++} className="text-gray-400">{" ".repeat(indent)}$ </span>);
      remaining = trimmed.slice(2);
    }

    // Tokenize the rest
    const tokens = remaining.match(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|&&|\|\||[|><;]|--?\w[\w-]*|\S+|\s+)/g) || [remaining];

    for (const token of tokens) {
      if (/^&&$|^\|\|$|^[|><;]$/.test(token)) {
        parts.push(<span key={partKey++} className="text-amber-300">{token}</span>);
      } else if (/^--?\w/.test(token)) {
        parts.push(<span key={partKey++} className="text-sky-300">{token}</span>);
      } else if (/^["']/.test(token)) {
        parts.push(<span key={partKey++} className="text-emerald-300">{token}</span>);
      } else if (/^\d+$/.test(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else if (partKey === 0 || (parts.length > 0 && /^(sudo|npm|npx|git|docker|cd|cp|mv|mkdir|curl|wget|cat|echo|export|source)$/.test(token))) {
        parts.push(<span key={partKey++} className="text-yellow-300">{token}</span>);
      } else {
        parts.push(<span key={partKey++} className="text-gray-100">{token}</span>);
      }
    }

    parts.push(<span key={partKey}>{"\n"}</span>);
    return <span key={i}>{parts}</span>;
  });
}

function highlightEnv(code: string): React.ReactNode[] {
  return code.split("\n").map((line, i) => {
    if (line.trimStart().startsWith("#")) {
      return <span key={i} className="text-gray-400 italic">{line}{"\n"}</span>;
    }

    const eqIndex = line.indexOf("=");
    if (eqIndex > 0) {
      const key = line.slice(0, eqIndex);
      const value = line.slice(eqIndex + 1);
      return (
        <span key={i}>
          <span className="text-sky-300">{key}</span>
          <span className="text-gray-400">=</span>
          <span className="text-emerald-300">{value}</span>
          {"\n"}
        </span>
      );
    }

    return <span key={i} className="text-gray-100">{line}{"\n"}</span>;
  });
}

function highlightJson(code: string): React.ReactNode[] {
  return code.split("\n").map((line, i) => {
    const parts: React.ReactNode[] = [];
    let partKey = 0;

    const tokens = line.match(/(["'][^"']*["']|[{}[\],:]|\d+\.?\d*|true|false|null|\s+)/g) || [line];

    for (const token of tokens) {
      if (/^["']/.test(token) && line.includes(":") && line.indexOf(token) < line.indexOf(":")) {
        parts.push(<span key={partKey++} className="text-sky-300">{token}</span>);
      } else if (/^["']/.test(token)) {
        parts.push(<span key={partKey++} className="text-emerald-300">{token}</span>);
      } else if (/^(true|false|null)$/.test(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else if (/^\d/.test(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else if (/^[{}[\],:]$/.test(token)) {
        parts.push(<span key={partKey++} className="text-gray-300">{token}</span>);
      } else {
        parts.push(<span key={partKey++} className="text-gray-100">{token}</span>);
      }
    }

    parts.push(<span key={partKey}>{"\n"}</span>);
    return <span key={i}>{parts}</span>;
  });
}

function highlightTypescript(code: string): React.ReactNode[] {
  const keywords = new Set(["import", "export", "from", "const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "interface", "type", "enum", "async", "await", "new", "this", "extends", "implements", "default", "switch", "case", "break", "continue", "throw", "try", "catch", "finally", "typeof", "instanceof", "in", "of", "void"]);
  const builtinTypes = new Set(["string", "number", "boolean", "object", "any", "never", "unknown", "void", "Record", "Promise", "Array", "Map", "Set", "Buffer", "Partial", "Required", "Omit", "Pick"]);
  const constants = new Set(["null", "undefined", "true", "false"]);

  return code.split("\n").map((line, i) => {
    if (line.trimStart().startsWith("//")) {
      return <span key={i} className="text-gray-400 italic">{line}{"\n"}</span>;
    }

    const parts: React.ReactNode[] = [];
    let partKey = 0;

    const tokens = line.match(/(\/\/.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|=>|[{}()[\];,.:?!<>=+\-*/&|^~%@#]|\b\d+\.?\d*\b|\b\w+\b|\s+)/g) || [line];

    for (let t = 0; t < tokens.length; t++) {
      const token = tokens[t];
      if (/^\/\//.test(token)) {
        parts.push(<span key={partKey++} className="text-gray-400 italic">{token}</span>);
      } else if (/^["'`]/.test(token)) {
        parts.push(<span key={partKey++} className="text-emerald-300">{token}</span>);
      } else if (constants.has(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else if (keywords.has(token)) {
        parts.push(<span key={partKey++} className="text-pink-400">{token}</span>);
      } else if (builtinTypes.has(token)) {
        parts.push(<span key={partKey++} className="text-cyan-300">{token}</span>);
      } else if (/^[A-Z]/.test(token)) {
        // PascalCase = type/interface/class name
        parts.push(<span key={partKey++} className="text-yellow-300">{token}</span>);
      } else if (/^\d/.test(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else if (/^=>$/.test(token)) {
        parts.push(<span key={partKey++} className="text-pink-400">{token}</span>);
      } else if (/^[{}()[\];,.<>=+\-*/&|^~%@#:?!]$/.test(token)) {
        parts.push(<span key={partKey++} className="text-gray-400">{token}</span>);
      } else if (/^\w+$/.test(token)) {
        // Check if next non-whitespace token is ( -> function call
        let isFn = false;
        for (let j = t + 1; j < tokens.length; j++) {
          if (/^\s+$/.test(tokens[j])) continue;
          if (tokens[j] === "(") isFn = true;
          break;
        }
        if (isFn) {
          parts.push(<span key={partKey++} className="text-blue-300">{token}</span>);
        } else {
          parts.push(<span key={partKey++} className="text-gray-100">{token}</span>);
        }
      } else {
        parts.push(<span key={partKey++} className="text-gray-100">{token}</span>);
      }
    }

    parts.push(<span key={partKey}>{"\n"}</span>);
    return <span key={i}>{parts}</span>;
  });
}

function highlightSql(code: string): React.ReactNode[] {
  const keywords = new Set(["SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET", "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "ON", "JOIN", "LEFT", "RIGHT", "INNER", "OUTER", "AND", "OR", "NOT", "NULL", "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "DEFAULT", "CASCADE", "AS", "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "IN", "EXISTS", "BETWEEN", "LIKE", "IS", "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "CONSTRAINT", "CHECK", "BEGIN", "COMMIT", "ROLLBACK", "GRANT", "REVOKE", "INT", "INTEGER", "VARCHAR", "TEXT", "BOOLEAN", "TIMESTAMP", "UUID", "ENUM", "SERIAL"]);

  return code.split("\n").map((line, i) => {
    if (line.trimStart().startsWith("--")) {
      return <span key={i} className="text-gray-400 italic">{line}{"\n"}</span>;
    }

    const parts: React.ReactNode[] = [];
    let partKey = 0;

    const tokens = line.match(/('(?:[^'\\]|\\.)*'|\b\d+\.?\d*\b|\b\w+\b|[();,.*=<>!+\-/]|\s+)/g) || [line];

    for (const token of tokens) {
      if (/^'/.test(token)) {
        parts.push(<span key={partKey++} className="text-emerald-300">{token}</span>);
      } else if (keywords.has(token.toUpperCase())) {
        parts.push(<span key={partKey++} className="text-violet-300">{token}</span>);
      } else if (/^\d/.test(token)) {
        parts.push(<span key={partKey++} className="text-orange-300">{token}</span>);
      } else {
        parts.push(<span key={partKey++} className="text-gray-100">{token}</span>);
      }
    }

    parts.push(<span key={partKey}>{"\n"}</span>);
    return <span key={i}>{parts}</span>;
  });
}

function highlight(code: string, language: string): React.ReactNode[] {
  switch (language) {
    case "bash":
      return highlightBash(code);
    case "env":
      return highlightEnv(code);
    case "json":
      return highlightJson(code);
    case "typescript":
      return highlightTypescript(code);
    case "sql":
      return highlightSql(code);
    default:
      return code.split("\n").map((line, i) => {
        const trimmed = line.trimStart();
        if (trimmed.startsWith("#")) {
          return <span key={i} className="text-gray-400 italic">{line}{"\n"}</span>;
        }
        return <span key={i} className="text-gray-100">{line}{"\n"}</span>;
      });
  }
}

export function CodeBlock({ code, language = "bash", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const trimmedCode = code.replace(/^\n+|\n+$/g, "");

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-800 bg-gray-950">
      {title && (
        <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
          <span className="text-xs font-medium text-gray-400">{title}</span>
          <span className="text-[10px] uppercase tracking-wider text-gray-600">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
          <code className="font-mono text-gray-100">
            {highlight(trimmedCode, language)}
          </code>
        </pre>
        <button
          onClick={copyCode}
          className="absolute right-2 top-2 rounded-md bg-gray-800 p-1.5 text-gray-400 opacity-0 transition-opacity hover:text-gray-200 group-hover:opacity-100"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
