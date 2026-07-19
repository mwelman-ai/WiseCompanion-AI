import { Link } from 'react-router-dom';
import { Heart, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  onToggleDarkMode: () => void;
}

const Navbar = ({ onToggleDarkMode }: NavbarProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('wisecompanion-dark-mode');
    setIsDark(saved === 'true');
  }, []);

  const handleToggle = () => {
    setIsDark(!isDark);
    onToggleDarkMode();
  };

  return (
    <nav className="mb-6 flex items-center justify-between rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--bg-card)] px-4 py-3 shadow-sm md:px-6">
      <Link
        to="/"
        className="senior-touch-target group inline-flex min-h-12 items-center gap-3 rounded-xl px-2 text-[var(--color-text)] no-underline transition-all duration-300"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
          <Heart size={24} color="white" fill="white" />
        </div>
        <span className="text-2xl font-extrabold tracking-tight">WiseCompanion</span>
      </Link>

      <div className="flex items-center gap-3 md:gap-4">
        <Link
          to="/"
          className="senior-touch-target inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl px-4 text-[1.08rem] font-semibold text-[var(--color-text)] no-underline transition-colors duration-300 hover:text-[var(--color-primary)]"
        >
          Home
        </Link>

        <button
          onClick={handleToggle}
          className="senior-touch-target inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--bg-app)] text-[var(--color-text)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-lg"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
