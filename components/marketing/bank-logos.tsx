import Image from "next/image";

const BANKS = [
  { id: "chase", name: "Chase", logo: "/logos/banks/chase.svg" },
  { id: "amex", name: "Amex", logo: "/logos/banks/amex.svg" },
  { id: "barclays", name: "Barclays", logo: "/logos/banks/barclays.svg" },
  { id: "monzo", name: "Monzo", logo: "/logos/banks/monzo.svg" },
  { id: "revolut", name: "Revolut", logo: "/logos/banks/revolut.svg" },
  { id: "hsbc", name: "HSBC", logo: "/logos/banks/hsbc.svg" },
] as const;

export function BankLogosStrip() {
  return (
    <div className="border-t border-border bg-card py-5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Reads statements from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {BANKS.map(({ id, name, logo }) => (
            <Image
              key={id}
              src={logo}
              alt={name}
              height={24}
              width={72}
              className="h-6 w-auto opacity-60 grayscale"
            />
          ))}
          <span className="text-sm font-medium text-muted-foreground">+ more</span>
        </div>
      </div>
    </div>
  );
}
