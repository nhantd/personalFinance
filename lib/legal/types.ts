export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface LegalDocumentMeta {
  slug: string;
  label: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export const LEGAL_NAV = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Security", href: "/security" },
] as const;
