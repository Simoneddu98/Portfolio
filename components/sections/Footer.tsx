export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: "var(--color-bg-warm-end)",
        borderColor: "var(--color-border)",
        padding: "2rem var(--page-px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto w-full">
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--color-ink-muted)",
          }}
        >
          &copy; 2026 Simone Sanna
        </span>
      </div>
    </footer>
  );
}
