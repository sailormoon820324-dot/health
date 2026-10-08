import React, { useState } from 'react';
import { 
  Moon, Bed, Clock, Sparkles, CheckCircle2, 
  Waves, Heart, Wind, ShieldAlert, ArrowRight, Sliders
} from 'lucide-react';
import { UserHealthData, Period } from '../types';

interface SleepScreenProps {
  data: UserHealthData;
  onUpdateData: (updater: (prev: UserHealthData) => UserHealthData) => void;
}

export const SleepScreen: React.FC<SleepScreenProps> = ({ data, onUpdateData }) => {
  const [period, setPeriod] = useState<Period>('daily');
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Edit states for adjustment modal
  const [inputBedTime, setInputBedTime] = useState(data.bedTime);
  const [inputWakeTime, setInputWakeTime] = useState(data.wakeTime);
  const [inputSleepScore, setInputSleepScore] = useState(data.sleepScore);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleToggleSleepNow = () => {
    onUpdateData((prev) => {
      const nextState = !prev.sleepingNow;
      return {
        ...prev,
        sleepingNow: nextState,
        sleepStartTime: nextState ? Date.now() : null,
      };
    });
    showToast(data.sleepingNow ? '수면 모드가 종료되었습니다.' : '취침 모드가 활성화되었습니다. 쾌적한 수면 되세요.');
  };

  const handleToggleAlarm = () => {
    onUpdateData((prev) => ({
      ...prev,
      smartAlarmEnabled: !prev.smartAlarmEnabled,
    }));
    showToast(
      data.smartAlarmEnabled
        ? '스마트 기상 알람이 해제되었습니다.'
        : `스마트 기상 알람 (${data.alarmTime})이 활성화되었습니다.`
    );
  };

  const handleSaveSleepAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData((prev) => ({
      ...prev,
      bedTime: inputBedTime,
      wakeTime: inputWakeTime,
      sleepScore: Number(inputSleepScore),
    }));
    setShowAdjustModal(false);
    showToast('수면 데이터가 갱신되었습니다.');
  };

  const sleepH = Math.floor(data.sleepHours);
  const sleepM = Math.round((data.sleepHours - sleepH) * 60);

  // Stage breakdown
  const totalMins = data.sleepHours * 60;
  const deepPct = Math.round((data.deepSleepMinutes / totalMins) * 100);
  const remPct = Math.round((data.remSleepMinutes / totalMins) * 100);
  const lightPct = Math.round((data.lightSleepMinutes / totalMins) * 100);
  const awakePct = Math.max(1, 100 - (deepPct + remPct + lightPct));

  return (
    <div className="space-y-4 pb-24">
      {/* Toast banner */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#131b2e] border border-[#7bd0ff]/50 text-[#dae2fd] text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#7bd0ff]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Cockpit HUD Subheader */}
      <div className="flex items-center justify-between bg-[#131b2e]/70 border border-white/[0.06] rounded-xl p-3">
        <div>
          <div className="text-[11px] font-telemetry text-[#7bd0ff] flex items-center gap-1.5 font-semibold">
            <Moon className="w-3.5 h-3.5" />
            <span>CIRCADIAN REST ENGINE</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-0.5">수면 주기 및 신경계 회복 추적</div>
        </div>

        {/* Period selection */}
        <div className="flex items-center bg-[#0b1326] p-1 rounded-lg border border-white/[0.08]">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => {
            const labels: Record<Period, string> = { daily: '일간', weekly: '주간', monthly: '월간' };
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                  period === p
                    ? 'bg-[#1e293b] text-[#7bd0ff] border border-[#7bd0ff]/40 shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#dae2fd]'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* SLEEP SCORE & HERO METRICS */}
      <div className="bg-[#171f33] border border-white/[0.08] rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#7bd0ff]/10 text-[#7bd0ff] border border-[#7bd0ff]/20">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-telemetry text-[#94a3b8] tracking-wider uppercase">
                RECOVERY SCORE
              </span>
              <h2 className="text-base font-bold text-[#dae2fd]">오늘 수면 분석</h2>
            </div>
          </div>
          <button
            onClick={() => setShowAdjustModal(true)}
            className="text-xs text-[#7bd0ff] hover:text-[#c4e7ff] flex items-center gap-1 bg-[#131b2e] px-2.5 py-1 rounded border border-white/[0.08]"
          >
            <Sliders className="w-3.5 h-3.5" /> 수면 조정
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-2">
          {/* Circular Score Gauge */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#0b1326"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * data.sleepScore) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold font-telemetry text-[#dae2fd]">{data.sleepScore}</span>
                <span className="text-[9px] text-[#94a3b8] font-telemetry">점수</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-bold text-[#4edea3] flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> 최적의 회복 상태
              </div>
              <p className="text-xs text-[#94a3b8] mt-1">
                목표 대비 <strong className="text-[#dae2fd]">{Math.round((data.sleepHours / data.sleepGoalHours) * 100)}%</strong> 달성. 뇌 피로 및 근육 회복이 충분합니다.
              </p>
            </div>
          </div>

          {/* Quick stats box */}
          <div className="w-full sm:w-auto grid grid-cols-2 gap-2 bg-[#0b1326] p-3 rounded-lg border border-white/[0.06] font-telemetry text-center sm:text-left">
            <div>
              <span className="text-[10px] text-[#94a3b8] block">총 수면 시간</span>
              <span className="text-base font-bold text-[#dae2fd]">
                {sleepH}h {sleepM}m
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block">수면 효율</span>
              <span className="text-base font-bold text-[#4edea3]">{data.sleepEfficiency}%</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block">취침 시각</span>
              <span className="text-xs font-semibold text-[#dae2fd]">{data.bedTime}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block">기상 시각</span>
              <span className="text-xs font-semibold text-[#dae2fd]">{data.wakeTime}</span>
            </div>
          </div>
        </div>

        {/* Live Sleep Mode Toggle Button */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-[#dae2fd]">실시간 수면 추적 모드</div>
            <div className="text-[10px] text-[#94a3b8]">
              {data.sleepingNow ? '취침 중 센서가 미세 뒤척임을 감지하고 있습니다' : '잠들기 전 수면 모드를 시작하세요'}
            </div>
          </div>
          <button
            onClick={handleToggleSleepNow}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              data.sleepingNow
                ? 'bg-[#38bdf8] text-[#060e20] shadow-[0_0_12px_rgba(56,189,248,0.5)] animate-pulse'
                : 'bg-[#131b2e] hover:bg-[#38bdf8]/20 text-[#7bd0ff] border border-white/[0.1]'
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            {data.sleepingNow ? '수면 종료' : '취침 모드 시작'}
          </button>
        </div>
      </div>

      {/* SLEEP STAGES HYPNOGRAM CHART */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="text-sm font-bold text-[#dae2fd]">수면 단계 상세 (Hypnogram)</h3>
          </div>
          <span className="text-[10px] font-telemetry text-[#94a3b8]">4개 수면 사이클 완료</span>
        </div>

        {/* Hypnogram visual wave bar */}
        <div className="h-24 bg-[#0b1326] rounded-lg border border-white/[0.06] p-2 relative flex flex-col justify-between my-2">
          {/* Depth labels */}
          <div className="absolute left-2 inset-y-2 flex flex-col justify-between text-[9px] font-telemetry text-[#64748b] pointer-events-none">
            <span>깸</span>
            <span>REM</span>
            <span>얕음</span>
            <span>깊음</span>
          </div>

          {/* Stepped Hypnogram SVG Curve */}
          <svg className="w-full h-full pl-8" viewBox="0 0 300 70" preserveAspectRatio="none">
            <path
              d="M0,15 L20,35 L40,55 L70,55 L85,35 L105,25 L125,55 L155,55 L170,35 L190,25 L210,55 L230,55 L250,25 L270,15 L300,5"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Area gradient */}
            <path
              d="M0,15 L20,35 L40,55 L70,55 L85,35 L105,25 L125,55 L155,55 L170,35 L190,25 L210,55 L230,55 L250,25 L270,15 L300,5 L300,70 L0,70 Z"
              fill="url(#hypnoGradient)"
              opacity="0.25"
            />
            <defs>
              <linearGradient id="hypnoGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Time axis */}
          <div className="flex justify-between pl-8 text-[9px] font-telemetry text-[#64748b]">
            <span>23:20</span>
            <span>01:30</span>
            <span>03:30</span>
            <span>05:15</span>
            <span>06:58</span>
          </div>
        </div>

        {/* Stage distribution indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <div className="bg-[#0b1326] p-2 rounded-lg border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#38bdf8]">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> 깊은 수면
            </div>
            <div className="text-sm font-bold font-telemetry text-[#dae2fd] mt-1">
              {Math.floor(data.deepSleepMinutes / 60)}h {data.deepSleepMinutes % 60}m
            </div>
            <div className="text-[9px] text-[#94a3b8] font-telemetry">{deepPct}% (적정 15~25%)</div>
          </div>

          <div className="bg-[#0b1326] p-2 rounded-lg border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#818cf8]">
              <span className="w-2 h-2 rounded-full bg-[#818cf8]" /> REM 수면
            </div>
            <div className="text-sm font-bold font-telemetry text-[#dae2fd] mt-1">
              {Math.floor(data.remSleepMinutes / 60)}h {data.remSleepMinutes % 60}m
            </div>
            <div className="text-[9px] text-[#94a3b8] font-telemetry">{remPct}% (기억 정리)</div>
          </div>

          <div className="bg-[#0b1326] p-2 rounded-lg border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
              <span className="w-2 h-2 rounded-full bg-[#94a3b8]" /> 얕은 수면
            </div>
            <div className="text-sm font-bold font-telemetry text-[#dae2fd] mt-1">
              {Math.floor(data.lightSleepMinutes / 60)}h {data.lightSleepMinutes % 60}m
            </div>
            <div className="text-[9px] text-[#94a3b8] font-telemetry">{lightPct}% (신체 회복)</div>
          </div>

          <div className="bg-[#0b1326] p-2 rounded-lg border border-white/[0.04]">
            <div className="flex items-center gap-1.5 text-[10px] text-[#f97316]">
              <span className="w-2 h-2 rounded-full bg-[#f97316]" /> 잠든 중 깸
            </div>
            <div className="text-sm font-bold font-telemetry text-[#dae2fd] mt-1">
              {data.awakeMinutes}m
            </div>
            <div className="text-[9px] text-[#94a3b8] font-telemetry">{awakePct}% (안정적)</div>
          </div>
        </div>
      </div>

      {/* OVERNIGHT BIOMETRIC VITALS */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <h3 className="text-sm font-bold text-[#dae2fd] mb-3">수면 중 생체 텔레메트리</h3>
        <div className="grid grid-cols-3 gap-2 font-telemetry">
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#94a3b8]">
              <span className="text-[10px]">수면 심박수</span>
              <Heart className="w-3.5 h-3.5 text-[#f97316]" />
            </div>
            <div className="text-base font-bold text-[#dae2fd] mt-1">54 BPM</div>
            <span className="text-[9px] text-[#4edea3]">최저 49 BPM</span>
          </div>

          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#94a3b8]">
              <span className="text-[10px]">호흡수</span>
              <Wind className="w-3.5 h-3.5 text-[#7bd0ff]" />
            </div>
            <div className="text-base font-bold text-[#dae2fd] mt-1">14.2 회/분</div>
            <span className="text-[9px] text-[#4edea3]">호흡 매우 규칙적</span>
          </div>

          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="flex items-center justify-between text-[#94a3b8]">
              <span className="text-[10px]">최저 산소포화도</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#4edea3]" />
            </div>
            <div className="text-base font-bold text-[#dae2fd] mt-1">96%</div>
            <span className="text-[9px] text-[#4edea3]">무호흡 이상 없음</span>
          </div>
        </div>
      </div>

      {/* SMART ALARM & SLEEP COACHING */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#f97316]" />
            <div>
              <div className="text-xs font-bold text-[#dae2fd]">스마트 기상 알람</div>
              <div className="text-[10px] text-[#94a3b8]">
                얕은 수면 구간({data.alarmTime} 전후 15분)에 부드럽게 진동
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleAlarm}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
              data.smartAlarmEnabled ? 'bg-[#f97316]' : 'bg-[#31394d]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                data.smartAlarmEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Coaching Tip */}
        <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04] text-xs">
          <div className="text-[#ffb690] font-semibold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" /> 키네틱 서카디언 코칭
          </div>
          <p className="text-[#94a3b8] leading-relaxed text-[11px]">
            오전 8시 이전에 20분간 햇빛을 쬐면 코르티솔이 정상 분비되어 14시간 후 멜라토닌 분비가 원활해집니다. 오늘 밤 최적의 입면 시간은 <strong className="text-[#dae2fd]">23:15</strong>로 예상됩니다.
          </p>
        </div>
      </div>

      {/* ADJUST SLEEP MODAL */}
      {showAdjustModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.12] rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#dae2fd] mb-1">수면 기록 수정</h3>
            <p className="text-xs text-[#94a3b8] mb-4">어젯밤 실제 취침 및 기상 시간을 조정합니다.</p>

            <form onSubmit={handleSaveSleepAdjustment} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">취침 시각</label>
                <input
                  type="time"
                  value={inputBedTime}
                  onChange={(e) => setInputBedTime(e.target.value)}
                  className="w-full bg-[#0b1326] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#7bd0ff] font-telemetry"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">기상 시각</label>
                <input
                  type="time"
                  value={inputWakeTime}
                  onChange={(e) => setInputWakeTime(e.target.value)}
                  className="w-full bg-[#0b1326] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#7bd0ff] font-telemetry"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">수면 점수 (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputSleepScore}
                  onChange={(e) => setInputSleepScore(Number(e.target.value))}
                  className="w-full bg-[#0b1326] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#7bd0ff] font-telemetry"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-2 text-xs text-[#94a3b8] bg-[#0b1326] hover:bg-[#131b2e] rounded-lg border border-white/[0.08]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-[#060e20] bg-[#38bdf8] hover:bg-[#7bd0ff] rounded-lg transition-all shadow-md"
                >
                  적용하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
