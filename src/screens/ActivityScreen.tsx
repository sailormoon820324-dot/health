import React, { useState, useEffect } from 'react';
import { 
  Footprints, Flame, Play, Pause, Square, 
  TrendingUp, Award, Zap, Compass, CheckCircle2, ChevronRight
} from 'lucide-react';
import { UserHealthData, Period, WorkoutSession } from '../types';

interface ActivityScreenProps {
  data: UserHealthData;
  onUpdateData: (updater: (prev: UserHealthData) => UserHealthData) => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ data, onUpdateData }) => {
  const [period, setPeriod] = useState<Period>('daily');
  
  // Workout timer state
  const [selectedSport, setSelectedSport] = useState<WorkoutSession['type']>('running');
  const [isWorkingOut, setIsWorkingOut] = useState(false);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isWorkingOut) {
      interval = setInterval(() => {
        setWorkoutSeconds((sec) => sec + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkingOut]);

  const sportsConfig: Record<
    WorkoutSession['type'],
    { label: string; icon: string; kcalPerMin: number; hrBase: number }
  > = {
    running: { label: '야외 러닝', icon: '🏃', kcalPerMin: 11.5, hrBase: 145 },
    cycling: { label: '사이클링', icon: '🚴', kcalPerMin: 8.5, hrBase: 130 },
    walking: { label: '파워 워킹', icon: '🚶', kcalPerMin: 4.8, hrBase: 105 },
    strength: { label: '근력 트레이닝', icon: '🏋️', kcalPerMin: 7.2, hrBase: 125 },
    hiit: { label: '고강도 인터벌', icon: '⚡', kcalPerMin: 13.0, hrBase: 160 },
  };

  const handleStartWorkout = () => {
    setIsWorkingOut(true);
    showToast(`${sportsConfig[selectedSport].label} 세션이 시작되었습니다!`);
  };

  const handlePauseWorkout = () => {
    setIsWorkingOut(false);
  };

  const handleFinishWorkout = () => {
    const mins = Math.max(1, Math.round(workoutSeconds / 60));
    const burned = Math.round(mins * sportsConfig[selectedSport].kcalPerMin);
    const addedSteps = selectedSport === 'running' ? mins * 160 : selectedSport === 'walking' ? mins * 110 : 0;
    const addedDist = +(addedSteps * 0.00075).toFixed(2);

    const newSession: WorkoutSession = {
      id: Date.now().toString(),
      type: selectedSport,
      name: `${sportsConfig[selectedSport].label} 세션`,
      durationMinutes: mins,
      caloriesBurned: burned,
      distanceKm: addedDist > 0 ? addedDist : undefined,
      avgHeartRate: sportsConfig[selectedSport].hrBase,
      timestamp: '방금 완료',
    };

    onUpdateData((prev) => ({
      ...prev,
      todaySteps: prev.todaySteps + addedSteps,
      distanceKm: +(prev.distanceKm + addedDist).toFixed(1),
      caloriesBurned: prev.caloriesBurned + burned,
      activeBurn: prev.activeBurn + burned,
      activeMinutes: prev.activeMinutes + mins,
      workouts: [newSession, ...prev.workouts],
    }));

    setIsWorkingOut(false);
    setWorkoutSeconds(0);
    showToast(`운동 완료! +${burned} kcal, +${addedSteps}보 기록됨`);
  };

  const handleQuickAdd = (steps: number) => {
    onUpdateData((prev) => {
      const extraKm = +(steps * 0.00074).toFixed(2);
      const extraKcal = Math.round(steps * 0.04);
      return {
        ...prev,
        todaySteps: prev.todaySteps + steps,
        distanceKm: +(prev.distanceKm + extraKm).toFixed(1),
        caloriesBurned: prev.caloriesBurned + extraKcal,
        activeBurn: prev.activeBurn + extraKcal,
        activeMinutes: prev.activeMinutes + Math.round(steps / 120),
      };
    });
    showToast(`+${steps.toLocaleString()} 걸음 반영 완료`);
  };

  const stepGoalPercent = Math.min(100, Math.round((data.todaySteps / data.stepGoal) * 100));
  const currentSport = sportsConfig[selectedSport];
  const workoutMins = Math.floor(workoutSeconds / 60);
  const workoutSecs = workoutSeconds % 60;
  const liveBurnedKcal = Math.round((workoutSeconds / 60) * currentSport.kcalPerMin);

  return (
    <div className="space-y-4 pb-24">
      {/* Toast banner */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#131b2e] border border-[#4edea3]/50 text-[#dae2fd] text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Cockpit HUD Subheader */}
      <div className="flex items-center justify-between bg-[#131b2e]/70 border border-white/[0.06] rounded-xl p-3">
        <div>
          <div className="text-[11px] font-telemetry text-[#4edea3] flex items-center gap-1.5 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>KINETIC MOTION ENGINE</span>
          </div>
          <div className="text-xs text-[#94a3b8] mt-0.5">활동 가속도 및 에너지 대사 추적</div>
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
                    ? 'bg-[#1e293b] text-[#4edea3] border border-[#4edea3]/40 shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#dae2fd]'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN STEP TELEMETRY CARD */}
      <div className="bg-[#171f33] border border-white/[0.08] rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-telemetry text-[#94a3b8] tracking-wider uppercase">
                LOCOMOTION TELEMETRY
              </span>
              <h2 className="text-base font-bold text-[#dae2fd]">오늘 총 걸음 분석</h2>
            </div>
          </div>
          <span className="text-xs font-telemetry px-2 py-0.5 rounded bg-[#4edea3]/15 text-[#4edea3] border border-[#4edea3]/30">
            {stepGoalPercent}% 달성
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-4xl sm:text-5xl font-bold font-telemetry tracking-tight text-[#f8fafc]">
              {data.todaySteps.toLocaleString()}
              <span className="text-sm font-normal text-[#94a3b8] ml-2">보</span>
            </div>
            <div className="text-xs text-[#94a3b8] mt-1">
              목표 {data.stepGoal.toLocaleString()}보까지 {Math.max(0, data.stepGoal - data.todaySteps).toLocaleString()}보 남음
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-[#0b1326] p-3 rounded-lg border border-white/[0.06] font-telemetry">
            <div>
              <span className="text-[10px] text-[#94a3b8] block">이동 거리</span>
              <span className="text-sm font-bold text-[#dae2fd]">{data.distanceKm} km</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block">활동 시간</span>
              <span className="text-sm font-bold text-[#dae2fd]">{data.activeMinutes} 분</span>
            </div>
            <div>
              <span className="text-[10px] text-[#94a3b8] block">등반 층수</span>
              <span className="text-sm font-bold text-[#dae2fd]">{data.floorsClimbed} 층</span>
            </div>
          </div>
        </div>

        {/* Step goal visual bar */}
        <div className="w-full bg-[#0b1326] h-3 rounded-full overflow-hidden p-0.5 border border-white/[0.08] my-4">
          <div
            className="h-full bg-gradient-to-r from-[#00a572] to-[#4edea3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
            style={{ width: `${stepGoalPercent}%` }}
          />
        </div>

        {/* Fast Step Simulator Buttons */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-[#94a3b8]">걸음수 즉시 기록:</span>
          <div className="flex items-center gap-2">
            {[100, 500, 1000].map((num) => (
              <button
                key={num}
                onClick={() => handleQuickAdd(num)}
                className="px-3 py-1.5 text-xs font-telemetry font-bold rounded bg-[#131b2e] hover:bg-[#4edea3]/20 hover:text-[#4edea3] text-[#dae2fd] border border-white/[0.08] transition-colors active:scale-95"
              >
                +{num.toLocaleString()}보
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HOURLY STEP DISTRIBUTION CHART */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#4edea3]" />
            <h3 className="text-sm font-bold text-[#dae2fd]">시간대별 걸음 분포</h3>
          </div>
          <span className="text-[10px] font-telemetry text-[#94a3b8]">피크: 18:00 (1,950보)</span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 items-end h-28 pt-2">
          {data.hourlySteps.map((h, i) => {
            const height = Math.min(100, Math.round((h.steps / 2200) * 100));
            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[9px] font-telemetry text-[#4edea3] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {h.steps}
                </div>
                <div className="w-full bg-[#0b1326] rounded-t-sm h-full flex items-end p-0.5">
                  <div
                    style={{ height: `${height}%` }}
                    className="w-full bg-gradient-to-t from-[#00a572] to-[#4edea3] rounded-t-sm group-hover:brightness-125 transition-all"
                  />
                </div>
                <span className="text-[9px] font-telemetry text-[#94a3b8] mt-1.5 truncate">
                  {h.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE WORKOUT TRACKER ENGINE */}
      <div className="bg-gradient-to-b from-[#171f33] to-[#131b2e] border border-[#f97316]/30 rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#f97316]" />
            <div>
              <h3 className="text-sm font-bold text-[#dae2fd]">실시간 운동 세션 트래커</h3>
              <span className="text-[10px] text-[#94a3b8]">GPS 궤적 및 대사 소모율 실시간 측정</span>
            </div>
          </div>
          {isWorkingOut && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#f97316]/20 border border-[#f97316]/40 text-[#f97316] text-[11px] font-telemetry animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#f97316]" /> RECORDING
            </span>
          )}
        </div>

        {/* Sport Picker */}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {(Object.keys(sportsConfig) as WorkoutSession['type'][]).map((sportKey) => {
            const item = sportsConfig[sportKey];
            const isSelected = selectedSport === sportKey;
            return (
              <button
                key={sportKey}
                disabled={isWorkingOut}
                onClick={() => setSelectedSport(sportKey)}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isSelected
                    ? 'bg-[#f97316]/20 border-[#f97316] text-[#dae2fd]'
                    : 'bg-[#0b1326] border-white/[0.06] text-[#94a3b8] hover:border-white/20'
                } ${isWorkingOut ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-xl mb-0.5">{item.icon}</div>
                <div className="text-[10px] font-medium leading-none">{item.label}</div>
              </button>
            );
          })}
        </div>

        {/* Live Timer Display */}
        <div className="bg-[#0b1326] rounded-xl p-4 border border-white/[0.08] text-center my-2">
          <div className="text-3xl sm:text-4xl font-telemetry font-bold tracking-tight text-[#dae2fd]">
            {String(workoutMins).padStart(2, '0')}:{String(workoutSecs).padStart(2, '0')}
          </div>
          <div className="flex justify-center gap-6 mt-3 text-xs font-telemetry text-[#94a3b8]">
            <div>
              <span>소모 칼로리: </span>
              <strong className="text-[#f97316] font-bold">+{liveBurnedKcal} kcal</strong>
            </div>
            <div>
              <span>예상 심박: </span>
              <strong className="text-[#4edea3] font-bold">{isWorkingOut ? currentSport.hrBase : '--'} BPM</strong>
            </div>
          </div>
        </div>

        {/* Controller Buttons */}
        <div className="flex items-center gap-2 mt-3">
          {!isWorkingOut ? (
            <button
              onClick={handleStartWorkout}
              className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-[#f97316] to-[#ffb690] text-[#060e20] font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" /> 운동 시작
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseWorkout}
                className="flex-1 py-2.5 rounded-lg bg-[#31394d] hover:bg-[#475569] text-[#dae2fd] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Pause className="w-4 h-4" /> 일시정지
              </button>
              <button
                onClick={handleFinishWorkout}
                className="flex-1 py-2.5 rounded-lg bg-[#00a572] hover:bg-[#10b981] text-[#060e20] font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Square className="w-4 h-4 fill-current" /> 운동 완료 & 저장
              </button>
            </>
          )}
        </div>
      </div>

      {/* BIOMECHANICS TELEMETRY */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-[#7bd0ff]" />
          <h3 className="text-sm font-bold text-[#dae2fd]">보행 역학 바이오메트릭스</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-telemetry">
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-[#94a3b8] block">평균 보폭</span>
            <span className="text-base font-bold text-[#dae2fd]">74 cm</span>
            <span className="text-[9px] text-[#4edea3] block mt-0.5">최적 보폭 유지중</span>
          </div>
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-[#94a3b8] block">평균 케이던스</span>
            <span className="text-base font-bold text-[#dae2fd]">168 SPM</span>
            <span className="text-[9px] text-[#4edea3] block mt-0.5">러너 권장 범위</span>
          </div>
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-[#94a3b8] block">좌/우 접지 밸런스</span>
            <span className="text-base font-bold text-[#dae2fd]">50.2 : 49.8</span>
            <span className="text-[9px] text-[#4edea3] block mt-0.5">대칭성 매우 우수</span>
          </div>
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <span className="text-[10px] text-[#94a3b8] block">지면 접촉 시간</span>
            <span className="text-base font-bold text-[#dae2fd]">218 ms</span>
            <span className="text-[9px] text-[#7bd0ff] block mt-0.5">상위 12% 탄력</span>
          </div>
        </div>
      </div>

      {/* RECENT WORKOUT LOG LIST */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#dae2fd]">최근 운동 기록</h3>
          <span className="text-xs text-[#94a3b8]">{data.workouts.length}건</span>
        </div>

        <div className="space-y-2">
          {data.workouts.map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 rounded-lg bg-[#0b1326] border border-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#171f33] border border-white/[0.08] flex items-center justify-center text-lg">
                  {sportsConfig[w.type]?.icon || '🏃'}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#dae2fd]">{w.name}</h4>
                  <div className="text-[10px] text-[#94a3b8] font-telemetry mt-0.5">
                    {w.timestamp} • {w.durationMinutes}분 • 평균 심박 {w.avgHeartRate} BPM
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right font-telemetry">
                  <div className="text-xs font-bold text-[#f97316]">+{w.caloriesBurned} kcal</div>
                  {w.distanceKm && <div className="text-[10px] text-[#94a3b8]">{w.distanceKm} km</div>}
                </div>
                <ChevronRight className="w-4 h-4 text-[#64748b]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
