import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  labelledBy?: string;
}

export function Section({ id, children, className = "", labelledBy }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy ?? `${id}-title`}
      className={`relative min-h-[100svh] ${className}`}
      style={{
        paddingTop: "var(--section-pt)",
        paddingBottom: "var(--section-pb)",
        paddingLeft: "var(--page-px)",
        paddingRight: "var(--page-px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full">{children}</div>
    </section>
  );
}
