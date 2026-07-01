import Link from "next/link";
import { LEGAL_ENTITY } from "@/lib/legal/entity";
import { LEGAL_NAV } from "@/lib/legal/types";
import type { LegalDocumentMeta } from "@/lib/legal/types";
import { BRAND, brandClasses } from "@/lib/brand";
import { cn } from "@/lib/utils";

interface LegalDocumentProps {
  document: LegalDocumentMeta;
}

export function LegalDocument({ document }: LegalDocumentProps) {
  const updated = new Date(LEGAL_ENTITY.lastUpdated).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <p className={brandClasses.label}>Legal · {document.label}</p>
      <h1 className={`mt-4 ${brandClasses.heading}`}>{document.title}</h1>
      <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Last updated {updated} · {BRAND.name} · {LEGAL_ENTITY.governingLaw}
      </p>

      <nav
        aria-label="Table of contents"
        className="mt-10 rounded-xl border border-border bg-muted/30 p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Contents
        </p>
        <ol className="mt-3 space-y-2">
          {document.sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm text-foreground transition-colors hover:text-accent"
              >
                <span className="mr-2 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {document.sections.map((section, index) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="font-heading text-2xl font-light tracking-tight text-foreground">
              <span className="mr-2 font-mono text-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-8">
        <p className="text-sm text-muted-foreground">
          <strong className="font-medium text-foreground">
            {LEGAL_ENTITY.legalName}
          </strong>
          <br />

          <a
            href={`mailto:${LEGAL_ENTITY.email}`}
            className="text-accent hover:underline"
          >
            {LEGAL_ENTITY.email}
          </a>
        </p>
        <p className="mt-6 text-xs text-muted-foreground">
          This document does not constitute legal advice. We recommend seeking
          independent legal counsel to ensure compliance with laws applicable to
          your situation.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2">
          {LEGAL_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-xs font-semibold uppercase tracking-widest transition-colors hover:text-accent",
                link.href === `/${document.slug}`
                  ? "text-accent"
                  : "text-muted-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
