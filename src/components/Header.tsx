import React from 'react';
import { Bell, Zap, ShieldCheck } from 'lucide-react';
import { Screen } from '../types';

interface HeaderProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  avatarUrl: string;
  userName: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  avatarUrl,
  userName,
}) => {
  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home':
        return { tag: 'SYS.ACTIVE // TELEMETRY', label: '홈 대시보드' };
      case 'activity':
        return { tag: 'KINEMATICS // REALTIME', label: '활동 트래킹' };
      case 'sleep':
        return { tag: 'CIRCADIAN // RECOVERY', label: '수면 분석' };
      case 'profile':
        return { tag: 'BIOMETRICS // IDENTITY', label: '내 프로필' };
    }
  };

  const titleInfo = getScreenTitle();

  return (
    <header className="sticky top-0 z-40 bg-[#0b1326]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#f97316] to-[#ffb690] flex items-center justify-center text-[#060e20] shadow-[0_0_12px_rgba(249,115,22,0.35)]">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="text-[10px] font-telemetry tracking-wider text-[#f97316] uppercase font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
            {titleInfo.tag}
          </div>
          <h1 className="text-base font-bold text-[#dae2fd] tracking-tight leading-none mt-0.5">
            {titleInfo.label}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Status indicator badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#131b2e] border border-white/[0.08] text-[11px] text-[#4edea3]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-telemetry">SYNC OK</span>
        </div>

        {/* Notifications button */}
        <button
          aria-label="알림"
          className="p-2 rounded-lg bg-[#131b2e] hover:bg-[#1e293b] text-[#94a3b8] hover:text-[#dae2fd] transition-colors border border-white/[0.06] relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#f97316]" />
        </button>

        {/* Profile Avatar button - targets //header//img[@alt='Profile']/parent::* */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          title="내 프로필로 이동"
          className={`relative p-0.5 rounded-full transition-all duration-200 focus:outline-none ${
            currentScreen === 'profile'
              ? 'ring-2 ring-[#f97316] shadow-[0_0_12px_rgba(249,115,22,0.4)]'
              : 'hover:ring-2 hover:ring-[#f97316]/50'
          }`}
        >
          <img
            src={avatarUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full object-cover border border-white/20"
          />
          <span className="sr-only">내 프로필 ({userName})</span>
        </button>
      </div>
    </header>
  );
};
