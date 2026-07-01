import { Shield, Lock, Trash2, UserCheck } from "lucide-react";
import { MockEditorialCard } from "@/components/marketing/mocks/mock-editorial-card";
import { MARKETING_COPY } from "@/lib/marketing/copy";

const items = [
  { icon: UserCheck, label: "Your data — you own it" },
  { icon: Lock, label: "Encrypted and secured at rest" },
  { icon: Trash2, label: "Delete everything anytime in Settings" },
];

export function MockPrivacyBadge() {
  return (
    <MockEditorialCard title="Privacy" index="04 / SECURITY" footer={MARKETING_COPY.privacy.tagline}>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-accent" />
        <span className="font-semibold text-foreground">Your data, your control</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 text-accent" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </MockEditorialCard>
  );
}
