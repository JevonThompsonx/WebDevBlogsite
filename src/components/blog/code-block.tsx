"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  language: string;
  html: string;
  raw: string;
}

export function CodeBlock({ language, html, raw }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard(): Promise<void> {
    await navigator.clipboard.writeText(raw);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="group my-8 overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[#10131c] shadow-[0_28px_60px_rgba(3,7,18,0.32)]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-xs uppercase tracking-[0.24em] text-white/70">
        <span>{language}</span>
        <Button
          className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-xs text-white hover:bg-white/10"
          size="sm"
          type="button"
          variant="ghost"
          onClick={() => {
            void copyToClipboard();
          }}
        >
          {copied ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <div className="overflow-x-auto px-4 py-5 text-sm leading-7 text-white [&_code]:font-[family-name:var(--font-mono)] [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-0">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
