import React from 'react';
import { Home, Flame, Moon, User } from 'lucide-react';
import { Screen } from '../types';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentScreen, onNavigate }) => {
  const navItems: { path: Screen; label: string; icon: React.ReactNode; code: string }[] = [
    {
      path: 'home',
      label: '홈',
      code: 'NAV.01',
      icon: <Home className="w-5 h-5" />,
    },
    {
      path: 'activity',
      label: '활동',
      code: 'NAV.02',
      icon: <Flame className="w-5 h-5" />,
    },
    {
      path: 'sleep',
      label: '수면',
      code: 'NAV.03',
      icon: <Moon className="w-5 h-5" />,
    },
    {
      path: 'profile',
      label: '프로필',
      code: 'NAV.04',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b1326]/95 backdrop-blur-xl border-t border-white/[0.08] shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto grid grid-cols-4 px-2">
        {navItems.map((item) => {
          const isActive = currentScreen === item.path;
          return (
            <a
              key={item.path}
              data-path={item.path}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(item.path);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(item.path);
                }
              }}
              className={`relative flex flex-col items-center justify-center pt-2.5 pb-2.5 transition-all duration-150 cursor-pointer select-none group ${
                isActive
                  ? 'text-[#f97316]'
                  : 'text-[#64748B] hover:text-[#dae2fd]'
              }`}
            >
              {/* Sharp top border segment (2px height) in #F97316 when active */}
              {isActive && (
                <span className="absolute top-0 inset-x-3 h-[2px] bg-[#f97316] shadow-[0_0_8px_#f97316]" />
              )}

              <div
                className={`transition-transform duration-150 ${
                  isActive ? 'scale-105 text-[#f97316]' : 'group-hover:scale-105'
                }`}
              >
                {item.icon}
              </div>

              <span
                className={`text-[11px] font-medium tracking-tight mt-1 transition-colors ${
                  isActive ? 'text-[#dae2fd] font-semibold' : 'text-[#64748B]'
                }`}
              >
                {item.label}
              </span>

              <span className="text-[9px] font-telemetry tracking-tighter opacity-40 leading-none">
                {item.code}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
};
