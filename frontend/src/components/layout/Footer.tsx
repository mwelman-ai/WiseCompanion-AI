const Footer = () => {
  return (
    <footer className="mt-auto rounded-t-[var(--radius-xl)] border-t border-[var(--color-border)] bg-[var(--bg-card)] py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 md:flex-row">
        <p className="text-[1.08rem] font-medium text-[var(--color-text)]">
          © 2026 WiseCompanion AI. Built with love for seniors.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 text-[1.02rem] font-semibold">
          <a
            href="#"
            className="senior-touch-target inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl px-4 text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--bg-app)] hover:text-[var(--color-primary)]"
          >
            Privacy
          </a>
          <a
            href="#"
            className="senior-touch-target inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl px-4 text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--bg-app)] hover:text-[var(--color-primary)]"
          >
            Terms
          </a>
          <a
            href="#"
            className="senior-touch-target inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl px-4 text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[var(--bg-app)] hover:text-[var(--color-primary)]"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
