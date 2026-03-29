import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { CodeBlock } from "@/components/blog/code-block";
import {
  createHeadingSlugger,
  getCodeHighlighter,
  resolveCodeLanguage,
} from "@/lib/markdown";
import {
  isExternalHttpLink,
  isSafeLinkHref,
  resolveSafeImageSource,
} from "@/lib/security";
import { cn } from "@/lib/utils";

interface ParagraphWithImagesProps {
  children?: ReactNode;
}

function Paragraph({ children }: ParagraphWithImagesProps) {
  const childArray = Array.isArray(children) ? children : [children];
  const hasOnlyImage = childArray.every((child) => {
    if (!child) {
      return true;
    }

    if (isValidElement(child)) {
      return child.type === "img";
    }

    return false;
  });

  if (hasOnlyImage) {
    return <>{children}</>;
  }

  return <p>{children}</p>;
}

interface PostContentProps {
  markdown: string;
}

const isDevelopment = process.env.NODE_ENV === "development";

export async function PostContent({ markdown }: PostContentProps) {
  const highlighter = await getCodeHighlighter();
  const nextHeadingSlug = createHeadingSlugger();

  function getNodeText(nodeChildren: ReactNode): string {
    return Children.toArray(nodeChildren)
      .map((child) => {
        if (typeof child === "string" || typeof child === "number") {
          return String(child);
        }

        if (isValidElement<{ children?: ReactNode }>(child)) {
          return getNodeText(child.props.children);
        }

        return "";
      })
      .join("");
  }

  const components: Components = {
    h2({ children, ...props }) {
      const text = getNodeText(children);
      const slug = nextHeadingSlug(text || "section");

      return (
        <h2 className="group scroll-mt-28" id={slug} {...props}>
          <Link className="no-underline" href={`#${slug}`}>
            {children}
          </Link>
        </h2>
      );
    },
    h3({ children, ...props }) {
      const text = getNodeText(children);
      const slug = nextHeadingSlug(text || "section");

      return (
        <h3 className="group scroll-mt-28" id={slug} {...props}>
          <Link className="no-underline" href={`#${slug}`}>
            {children}
          </Link>
        </h3>
      );
    },
    p({ children }) {
      return <Paragraph>{children}</Paragraph>;
    },
    a({ href, children }) {
      if (!href) {
        return <span>{children}</span>;
      }

      if (!isSafeLinkHref(href)) {
        return <span>{children}</span>;
      }

      const isExternalLink = isExternalHttpLink(href);

      return (
        <a
          className="text-[var(--color-accent)] underline decoration-[color-mix(in_srgb,var(--color-accent)_45%,transparent)] underline-offset-4 transition hover:text-[var(--color-accent-strong)]"
          href={href}
          rel={isExternalLink ? "noopener noreferrer" : undefined}
          target={isExternalLink ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    img({ src, alt }) {
      if (!src || typeof src !== "string") {
        return null;
      }

      const safeSrc = resolveSafeImageSource(src, {
        allowInsecureLocalhost: isDevelopment,
      });

      if (!safeSrc) {
        return null;
      }

      return (
        <span className="my-8 block overflow-hidden rounded-[1.5rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
          <Image
            alt={alt ?? "Blog illustration"}
            className="h-auto w-full object-cover"
            height={720}
            src={safeSrc}
            width={1280}
          />
        </span>
      );
    },
    code({ className, children, node, ...props }) {
      const language = resolveCodeLanguage(className);
      const raw = String(children).replace(/\n$/, "");
      const isInline =
        node?.position?.start.line === node?.position?.end.line && !className;

      if (isInline) {
        return (
          <code
            className="rounded bg-[color-mix(in_srgb,var(--color-surface)_65%,white_35%)] px-1.5 py-0.5 font-[family-name:var(--font-mono)] text-[0.92em] text-[var(--color-foreground)]"
            {...props}
          >
            {children}
          </code>
        );
      }

      const html = highlighter.codeToHtml(raw, {
        lang: language,
        theme: "vitesse-dark",
      });

      return <CodeBlock html={html} language={language} raw={raw} />;
    },
    pre({ children }) {
      return <>{children}</>;
    },
    ul({ className, children, ...props }) {
      return (
        <ul className={cn("space-y-2", className)} {...props}>
          {children}
        </ul>
      );
    },
  };

  return (
    <div className="prose prose-invert max-w-none prose-headings:font-[family-name:var(--font-display)] prose-headings:text-[var(--color-foreground)] prose-h2:text-[2rem] prose-h2:leading-[1.02] prose-h3:text-[1.45rem] prose-h3:leading-[1.1] prose-p:text-[var(--color-foreground-soft)] prose-p:leading-8 prose-a:no-underline prose-strong:text-[var(--color-foreground)] prose-li:text-[var(--color-foreground-soft)] prose-li:leading-8 prose-blockquote:rounded-r-[1.5rem] prose-blockquote:border-l-[var(--color-accent)] prose-blockquote:bg-[color-mix(in_srgb,var(--color-surface)_80%,white_20%)] prose-blockquote:px-6 prose-blockquote:py-3 prose-blockquote:text-[var(--color-foreground)] prose-hr:border-[var(--color-border)] dark:prose-invert">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
