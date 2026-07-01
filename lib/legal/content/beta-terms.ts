import type { LegalDocumentMeta } from "@/lib/legal/types";

export const BETA_TERMS_DOCUMENT: LegalDocumentMeta = {
  slug: "beta-terms",
  label: "BETA TERMS",
  title: "Beta programme terms.",
  description: "Additional terms for Monae beta access.",
  sections: [
    {
      id: "programme",
      title: "Beta programme",
      paragraphs: [
        "Monae is currently in active beta. During this period, you may access the Services free of charge while we test, refine, and expand functionality.",
        "These Beta Terms supplement our Terms of Service and Privacy Policy. If there is a conflict, these Beta Terms prevail for beta-specific matters.",
      ],
    },
    {
      id: "unstable",
      title: "Unstable features",
      paragraphs: [
        "Beta features may be incomplete, experimental, or change frequently. We may add, modify, suspend, or remove features at any time without notice.",
        "You should not rely on beta features for critical financial decisions or assume that data, settings, or workflows will remain unchanged.",
      ],
    },
    {
      id: "no-warranties",
      title: "No warranties during beta",
      paragraphs: [
        "To the maximum extent permitted by law, beta access is provided without warranties of any kind regarding availability, performance, accuracy, or data permanence.",
        "We do not guarantee uptime, support response times, or that beta data will be preserved indefinitely. You are responsible for maintaining your own backups of important information where appropriate.",
      ],
    },
    {
      id: "feedback",
      title: "Feedback",
      paragraphs: [
        "We welcome feedback, bug reports, and suggestions during beta. By submitting feedback, you grant us a perpetual, irrevocable, worldwide, royalty-free licence to use, modify, and incorporate that feedback into the Services without compensation or attribution.",
      ],
    },
    {
      id: "transition",
      title: "Transition out of beta",
      paragraphs: [
        "We may end the beta period at any time. If we introduce paid plans, we will provide reasonable advance notice and an opportunity to review updated pricing before any charges apply.",
        "We may convert beta accounts to general availability accounts or require re-registration, subject to applicable law and our Privacy Policy.",
      ],
    },
    {
      id: "relationship",
      title: "Relationship to main Terms",
      paragraphs: [
        "Except as modified by these Beta Terms, the Terms of Service, Privacy Policy, and Security page continue to apply. Participation in beta does not create any employment, partnership, or agency relationship.",
        "Questions about beta access: hello@monae.app.",
      ],
    },
  ],
};
