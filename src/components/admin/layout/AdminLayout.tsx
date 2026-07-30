import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/admin/useAuth';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  FolderGit2,
  Award as CertificateIcon,
  Wrench,
  Mail,
  Settings,
  FolderOpen,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Hero Identity', href: '/admin/hero', icon: User },
  { name: 'About Story', href: '/admin/about', icon: FileText },
  { name: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { name: 'Certificates', href: '/admin/certificates', icon: CertificateIcon },
  { name: 'Skills Matrix', href: '/admin/skills', icon: Wrench },
  { name: 'Experience', href: '/admin/experience', icon: Briefcase },
  { name: 'Education', href: '/admin/education', icon: GraduationCap },
  { name: 'Achievements', href: '/admin/achievements', icon: Award },
  { name: 'Hackathons', href: '/admin/hackathons', icon: Trophy },
  { name: 'Resume', href: '/admin/resume', icon: FileText },
  { name: 'Contact & Social', href: '/admin/contact', icon: Mail },
  { name: 'Site Settings', href: '/admin/settings', icon: Settings },
  { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
];

export const AdminLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: '/admin/login' as any });
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/60 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
              Portfolio CMS
            </span>
          </Link>
          <button
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href as any}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] transition-colors"
              activeProps={{
                className: 'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-cyan-400 bg-cyan-500/10 border border-cyan-500/20',
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-8 w-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-semibold text-xs">
              {user?.email?.[0].toUpperCase() || 'A'}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs font-medium text-slate-200 truncate">{user?.email}</span>
              <span className="text-[10px] text-slate-500">Administrator</span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              className="text-slate-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Control Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03]"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
