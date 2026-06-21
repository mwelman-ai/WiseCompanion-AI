const Footer = () => {
  return (
    <footer className="border-t py-12 bg-slate-50 dark:bg-slate-900/50 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-lg text-slate-500 dark:text-slate-400">
          © 2026 WiseCompanion AI. Built with love for seniors.
        </p>
        <div className="flex gap-8 text-lg font-medium">
          <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
          <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
          <a href="#" className="hover:text-rose-500 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
