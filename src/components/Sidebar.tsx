'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Search,
  ShieldCheck,
  BookTemplate,
  GitBranch,
  Settings,
  PlusCircle,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/adrs', label: 'All ADRs', icon: FileText },
  { href: '/adrs/new', label: 'New ADR', icon: PlusCircle },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { href: '/templates', label: 'Templates', icon: BookTemplate },
  { href: '/timeline', label: 'Timeline', icon: GitBranch },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar-bg text-sidebar-text">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-white">ADR Copilot</h1>
          <p className="text-xs text-sidebar-text/60">Architecture Decisions</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sidebar-active/20 text-white'
                      : 'text-sidebar-text/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-primary-light' : ''}`} />
                  {item.label}
                  {item.href === '/adrs/new' && (
                    <span className="ml-auto flex h-5 items-center rounded bg-primary/30 px-1.5 text-[10px] font-medium text-primary-light">
                      AI
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary-light">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">Sarah Chen</p>
            <p className="truncate text-xs text-sidebar-text/50">AI Architect</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
