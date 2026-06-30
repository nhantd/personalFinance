import { Shield, Lock, Trash2, UserCheck } from "lucide-react";
import { brandClasses } from "@/lib/brand";

const items = [
  { icon: UserCheck, label: "Your data — you own it" },
  { icon: Lock, label: "Encrypted and secured at rest" },
  { icon: Trash2, label: "Delete everything anytime in Settings" },
];

export function MockPrivacyBadge() {
  return (
    <div className={`${brandClasses.card} space-y-3 p-4`}>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-accent" />
        <span className="font-semibold text-foreground">Your data, your control</span>
      </div>
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
          <item.icon className="h-4 w-4 text-success" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
