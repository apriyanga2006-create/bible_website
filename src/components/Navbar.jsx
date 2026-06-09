import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, BookOpen, Bookmark } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <BookOpen size={24} />
        <span>The Holy Bible</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <Link to="/bible" className={location.pathname === '/bible' ? 'active' : ''}>Bible Reader</Link>
        <Link to="/bookmarks" className={location.pathname === '/bookmarks' ? 'active' : ''}>
          <Bookmark size={18} style={{ display: 'inline-block', verticalAlign: 'text-bottom', marginRight: '4px' }} />
          Bookmarks
        </Link>
      </div>
      <button id="themeToggle" onClick={toggleTheme} title="Toggle Theme">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
