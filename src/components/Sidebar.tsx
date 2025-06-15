
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  MessageSquare, 
  BarChart3, 
  User, 
  Brain, 
  Wand2, 
  Target, 
  Search,
  Zap,
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Chat', href: '/chat', icon: MessageSquare },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Knowledge', href: '/knowledge', icon: Brain },
  { name: 'Content Generator', href: '/content', icon: Wand2 },
  { name: 'Competitive Intelligence', href: '/competitive-intelligence', icon: Target },
  { name: 'Research', href: '/research', icon: Search },
  { name: 'LAIGENT Orchestrator', href: '/laigent-orchestrator', icon: Zap },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin', icon: Shield },
];

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.user_metadata?.role === 'super_admin';

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <div className="flex items-center">
          <Brain className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold">LAIGENT</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 pb-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          {/* Main Navigation */}
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary',
                          'h-5 w-5 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Admin Navigation */}
          {isAdmin && (
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wide">
                Administration
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary',
                            'h-5 w-5 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}

          {/* Bottom Navigation */}
          <li className="mt-auto">
            <ul role="list" className="-mx-2 space-y-1">
              {bottomNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-white' : 'text-gray-400 group-hover:text-primary',
                          'h-5 w-5 shrink-0'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
