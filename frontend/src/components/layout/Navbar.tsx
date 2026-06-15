import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          <span className="text-2xl font-bold tracking-tight">WiseCompanion</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-lg font-medium hover:text-rose-500 transition-colors">Home</Link>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-full font-bold text-lg hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
