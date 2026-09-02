import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      className={compact ? "brand-mark brand-mark--compact" : "brand-mark"}
      href="/"
      aria-label="Aurelija Žitkė – Somatinė hipnoterapija"
    >
      <span className="brand-mark__name">Aurelija Žitkė</span>
      <span className="brand-mark__line" aria-hidden="true" />
      <span className="brand-mark__method">Somatinė hipnoterapija®</span>
    </Link>
  );
}
