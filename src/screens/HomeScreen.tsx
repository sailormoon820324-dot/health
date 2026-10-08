import React, { useState } from 'react';
import { 
  Footprints, Flame, Moon, Heart, Droplets, ArrowUpRight, 
  Plus, CheckCircle2, Award
} from 'lucide-react';
import { UserHealthData, Period, Screen } from '../types';

interface HomeScreenProps {
  data: UserHealthData;
  onUpdateData: (updater: (prev: UserHealthData) => UserHealthData) => void;
  onNavigate: (screen: Screen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  data,
  onUpdateData,
  onNavigate,
}) => {
  const [period, setPeriod] = useState<Period>('daily');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [mealInput, setMealInput] = useState<{
    name: string;
    calories: number;
    type: '아침' | '점심' | '저녁' | '간식';
  }>({ name: '', calories: 350, type: '간식' });
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 2500);
  };

  const handleAddSteps = (amount: number) => {
    onUpdateData((prev) => {
      const newSteps = prev.todaySteps + amount;
      const extraKm = +(amount * 0.00074).toFixed(2);
      const extraKcal = Math.round(amount * 0.04);
      return {
        ...prev,
        todaySteps: newSteps,
        distanceKm: +(prev.distanceKm + extraKm).toFixed(1),
        caloriesBurned: prev.caloriesBurned + extraKcal,
        activeBurn: prev.activeBurn + extraKcal,
        activeMinutes: prev.activeMinutes + Math.round(amount / 120),
      };
    });
    showToast(`+${amount.toLocaleString()} 걸음이 추가되었습니다!`);
  };

  const handleAddWater = () => {
    onUpdateData((prev) => ({
      ...prev,
      hydrationMl: Math.min(prev.hydrationGoalMl + 1000, prev.hydrationMl + 250),
    }));
    showToast('수분 +250ml 기록 완료!');
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.name) return;
    const newMeal = {
      id: Date.now().toString(),
      name: mealInput.name,
      calories: Number(mealInput.calories) || 0,
      type: mealInput.type,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };

    onUpdateData((prev) => ({
      ...prev,
      calorieIntake: prev.calorieIntake + newMeal.calories,
      meals: [newMeal, ...prev.meals],
    }));

    setMealInput({ name: '', calories: 350, type: '간식' });
    setShowAddMealModal(false);
    showToast(`${newMeal.name} (+${newMeal.calories} kcal) 등록 완료`);
  };

  const stepPercent = Math.min(100, Math.round((data.todaySteps / data.stepGoal) * 100));
  const caloriePercent = Math.min(100, Math.round((data.caloriesBurned / data.calorieBurnGoal) * 100));
  const sleepPercent = Math.min(100, Math.round((data.sleepHours / data.sleepGoalHours) * 100));

  // Format sleep duration to hours and minutes
  const sleepH = Math.floor(data.sleepHours);
  const sleepM = Math.round((data.sleepHours - sleepH) * 60);

  return (
    <div className="space-y-4 pb-24">
      {/* Toast banner */}
      {notificationMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#131b2e] border border-[#f97316]/50 text-[#dae2fd] text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Cockpit HUD Subheader */}
      <div className="flex items-center justify-between bg-[#131b2e]/70 border border-white/[0.06] rounded-xl p-3">
        <div>
          <div className="text-[11px] font-telemetry text-[#94a3b8] flex items-center gap-1.5">
            <span>BIO-STATUS:</span>
            <span className="text-[#4edea3] font-semibold">OPTIMAL (생체 준비도 92%)</span>
          </div>
          <div className="text-xs text-[#dae2fd] mt-0.5">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
        </div>

        {/* Period Filter Chips */}
        <div className="flex items-center bg-[#0b1326] p-1 rounded-lg border border-white/[0.08]">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => {
            const labels: Record<Period, string> = { daily: '일간', weekly: '주간', monthly: '월간' };
            const isActive = period === p;
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 text-xs rounded transition-all font-medium ${
                  isActive
                    ? 'bg-[#1e293b] text-[#f97316] border border-[#f97316]/40 shadow-sm'
                    : 'text-[#94a3b8] hover:text-[#dae2fd]'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE 3 HEALTH METRICS DISPLAY */}
      <div className="grid grid-cols-1 gap-3">
        {/* 1. 걸음수 (Steps) HUD Card */}
        <div className="bg-[#171f33] border border-white/[0.08] hover:border-[#4edea3]/40 rounded-xl p-4 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4edea3]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/20">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-telemetry text-[#94a3b8] tracking-wider uppercase block">
                  KINETIC METRIC 01
                </span>
                <h2 className="text-sm font-bold text-[#dae2fd]">오늘 걸음수</h2>
              </div>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-[#4edea3] hover:text-[#6ffbbe] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
            >
              활동 분석 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-end justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-telemetry tracking-tight text-[#f8fafc] flex items-baseline gap-1.5">
                {data.todaySteps.toLocaleString()}
                <span className="text-xs font-normal text-[#94a3b8]">/ {data.stepGoal.toLocaleString()} 보</span>
              </div>
              <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-3 font-telemetry">
                <span>거리 <strong className="text-[#dae2fd]">{data.distanceKm} km</strong></span>
                <span>•</span>
                <span>활동 <strong className="text-[#dae2fd]">{data.activeMinutes}분</strong></span>
                <span>•</span>
                <span>계단 <strong className="text-[#dae2fd]">{data.floorsClimbed}층</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-telemetry font-bold text-[#4edea3]">{stepPercent}%</span>
              <span className="text-[10px] text-[#94a3b8] block">목표 달성률</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.08] my-3">
            <div
              className="h-full bg-gradient-to-r from-[#00a572] to-[#4edea3] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(78,222,163,0.5)]"
              style={{ width: `${stepPercent}%` }}
            />
          </div>

          {/* Interactive Fast Step Adders */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-[#94a3b8]">빠른 걸음수 추가:</span>
            <div className="flex items-center gap-1.5">
              {[
                { label: '+100보', val: 100 },
                { label: '+500보', val: 500 },
                { label: '+1,000보', val: 1000 },
              ].map((btn) => (
                <button
                  key={btn.val}
                  onClick={() => handleAddSteps(btn.val)}
                  className="px-2.5 py-1 text-[11px] font-telemetry font-semibold rounded bg-[#131b2e] hover:bg-[#4edea3]/20 hover:text-[#4edea3] text-[#dae2fd] border border-white/[0.08] transition-colors active:scale-95"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. 칼로리 (Active Flux / Caloric Burn) HUD Card */}
        <div className="bg-[#171f33] border border-white/[0.08] hover:border-[#f97316]/40 rounded-xl p-4 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f97316]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#f97316]/10 text-[#f97316] border border-[#f97316]/20">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-telemetry text-[#94a3b8] tracking-wider uppercase block">
                  METABOLIC FLUX 02
                </span>
                <h2 className="text-sm font-bold text-[#dae2fd]">오늘 소모 칼로리</h2>
              </div>
            </div>
            <button
              onClick={() => setShowAddMealModal(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded bg-[#f97316]/15 text-[#ffb690] hover:bg-[#f97316] hover:text-[#0b1326] border border-[#f97316]/30 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> 식사 기록
            </button>
          </div>

          <div className="flex items-end justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-telemetry tracking-tight text-[#f8fafc] flex items-baseline gap-1.5">
                {data.caloriesBurned.toLocaleString()}
                <span className="text-xs font-normal text-[#94a3b8]">/ {data.calorieBurnGoal.toLocaleString()} kcal</span>
              </div>
              <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-3 font-telemetry">
                <span>활동 대사 <strong className="text-[#f97316]">{data.activeBurn} kcal</strong></span>
                <span>•</span>
                <span>기초 대사 <strong className="text-[#dae2fd]">{data.basalBurn} kcal</strong></span>
                <span>•</span>
                <span>섭취량 <strong className="text-[#7bd0ff]">{data.calorieIntake} kcal</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-telemetry font-bold text-[#f97316]">{caloriePercent}%</span>
              <span className="text-[10px] text-[#94a3b8] block">목표 소모율</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/[0.08] my-3">
            <div
              className="h-full bg-gradient-to-r from-[#ea580c] to-[#f97316] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>

          {/* Caloric Net flux summary */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#94a3b8]">
              순 대사 수지: <strong className={data.caloriesBurned >= data.calorieIntake ? 'text-[#4edea3]' : 'text-[#f97316]'}>
                {data.caloriesBurned - data.calorieIntake > 0 ? `-${data.caloriesBurned - data.calorieIntake} kcal 결손 (체지방 연소 중)` : `+${data.calorieIntake - data.caloriesBurned} kcal 흑자`}
              </strong>
            </span>
            <span className="text-[#94a3b8]">식사 {data.meals.length}건 기록됨</span>
          </div>
        </div>

        {/* 3. 수면시간 (Sleep Recovery) HUD Card */}
        <div className="bg-[#171f33] border border-white/[0.08] hover:border-[#7bd0ff]/40 rounded-xl p-4 transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7bd0ff]/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-[#7bd0ff]/10 text-[#7bd0ff] border border-[#7bd0ff]/20">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-telemetry text-[#94a3b8] tracking-wider uppercase block">
                  CIRCADIAN PHASE 03
                </span>
                <h2 className="text-sm font-bold text-[#dae2fd]">오늘 수면시간</h2>
              </div>
            </div>
            <button
              onClick={() => onNavigate('sleep')}
              className="text-xs text-[#7bd0ff] hover:text-[#c4e7ff] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
            >
              수면 단계 분석 <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-end justify-between my-2">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-telemetry tracking-tight text-[#f8fafc] flex items-baseline gap-1.5">
                {sleepH}시간 {sleepM}분
                <span className="text-xs font-normal text-[#94a3b8]">/ {data.sleepGoalHours}시간 목표</span>
              </div>
              <div className="text-xs text-[#94a3b8] mt-1 flex items-center gap-3 font-telemetry">
                <span>취침 <strong className="text-[#dae2fd]">{data.bedTime}</strong></span>
                <span>•</span>
                <span>기상 <strong className="text-[#dae2fd]">{data.wakeTime}</strong></span>
                <span>•</span>
                <span>수면 효율 <strong className="text-[#4edea3]">{data.sleepEfficiency}%</strong></span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-telemetry font-bold text-[#7bd0ff]">{data.sleepScore}점</span>
              <span className="text-[10px] text-[#4edea3] block font-medium">최적 회복</span>
            </div>
          </div>

          {/* Sleep breakdown segments bar */}
          <div className="space-y-1.5 my-3">
            <div className="w-full bg-[#0b1326] h-2.5 rounded-full overflow-hidden flex p-0.5 border border-white/[0.08]">
              <div
                title={`깊은 수면: ${data.deepSleepMinutes}분`}
                className="h-full bg-[#38bdf8] rounded-l-full"
                style={{ width: `${(data.deepSleepMinutes / (data.sleepHours * 60)) * 100}%` }}
              />
              <div
                title={`렘 수면: ${data.remSleepMinutes}분`}
                className="h-full bg-[#818cf8]"
                style={{ width: `${(data.remSleepMinutes / (data.sleepHours * 60)) * 100}%` }}
              />
              <div
                title={`얕은 수면: ${data.lightSleepMinutes}분`}
                className="h-full bg-[#64748b]"
                style={{ width: `${(data.lightSleepMinutes / (data.sleepHours * 60)) * 100}%` }}
              />
              <div
                title={`깸: ${data.awakeMinutes}분`}
                className="h-full bg-[#f97316] rounded-r-full"
                style={{ width: `${(data.awakeMinutes / (data.sleepHours * 60)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#94a3b8] font-telemetry">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> 깊은 수면 {Math.floor(data.deepSleepMinutes / 60)}h {data.deepSleepMinutes % 60}m
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#818cf8]" /> REM {Math.floor(data.remSleepMinutes / 60)}h {data.remSleepMinutes % 60}m
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#64748b]" /> 얕은 수면 {Math.floor(data.lightSleepMinutes / 60)}h {data.lightSleepMinutes % 60}m
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BIOMETRIC SENSORS TELEMETRY STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Heart Rate */}
        <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-telemetry text-[#94a3b8] uppercase">HR // 심박수</span>
            <Heart className="w-3.5 h-3.5 text-[#f97316] animate-pulse" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-telemetry text-[#dae2fd]">{data.heartRate}</span>
            <span className="text-[11px] text-[#94a3b8]">BPM</span>
          </div>
          {/* ECG mini animation line */}
          <div className="mt-2 h-5 w-full overflow-hidden relative opacity-70">
            <svg className="w-full h-full text-[#f97316]" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path
                d="M0,10 L30,10 L35,2 L40,18 L45,10 L50,10 L55,4 L60,16 L65,10 L100,10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="text-[9px] text-[#94a3b8] mt-1 flex justify-between font-telemetry">
            <span>안정 58</span>
            <span>최대 148</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-telemetry text-[#94a3b8] uppercase">SPO2 // 산소포화도</span>
            <div className="w-2 h-2 rounded-full bg-[#4edea3]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-telemetry text-[#dae2fd]">{data.spo2}</span>
            <span className="text-[11px] text-[#94a3b8]">%</span>
          </div>
          <div className="mt-2 text-[10px] text-[#4edea3] font-medium">안정적 수준</div>
          <div className="text-[9px] text-[#94a3b8] mt-2 font-telemetry">야간 최저 96%</div>
        </div>

        {/* HRV */}
        <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-telemetry text-[#94a3b8] uppercase">HRV // 심박변이도</span>
            <div className="w-2 h-2 rounded-full bg-[#7bd0ff]" />
          </div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-telemetry text-[#dae2fd]">{data.hrv}</span>
            <span className="text-[11px] text-[#94a3b8]">ms</span>
          </div>
          <div className="mt-2 text-[10px] text-[#7bd0ff] font-medium">부교감신경 양호</div>
          <div className="text-[9px] text-[#94a3b8] mt-2 font-telemetry">전주 평균 대비 +8%</div>
        </div>

        {/* Hydration */}
        <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-telemetry text-[#94a3b8] uppercase">HYDRATION // 수분</span>
              <Droplets className="w-3.5 h-3.5 text-[#38bdf8]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-xl font-bold font-telemetry text-[#dae2fd]">{data.hydrationMl}</span>
              <span className="text-[11px] text-[#94a3b8]">/ {data.hydrationGoalMl}ml</span>
            </div>
          </div>
          <button
            onClick={handleAddWater}
            className="mt-2 w-full py-1 text-[11px] font-semibold bg-[#38bdf8]/15 hover:bg-[#38bdf8] text-[#7bd0ff] hover:text-[#060e20] rounded border border-[#38bdf8]/30 transition-all active:scale-95 text-center"
          >
            +250ml 기록
          </button>
        </div>
      </div>

      {/* TODAY'S RECENT ACTIVITIES TIMELINE */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#f97316]" />
            <h3 className="text-sm font-bold text-[#dae2fd]">오늘의 활동 기록</h3>
          </div>
          <button
            onClick={() => onNavigate('activity')}
            className="text-xs text-[#f97316] hover:underline"
          >
            새 운동 시작 +
          </button>
        </div>

        <div className="space-y-2">
          {data.workouts.slice(0, 3).map((w) => (
            <div
              key={w.id}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#0b1326] border border-white/[0.04] hover:border-white/[0.1] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#1e293b] flex items-center justify-center text-[#f97316]">
                  {w.type === 'running' ? <Flame className="w-4 h-4" /> : <Footprints className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#dae2fd]">{w.name}</div>
                  <div className="text-[10px] text-[#94a3b8] font-telemetry">{w.timestamp} • {w.durationMinutes}분</div>
                </div>
              </div>
              <div className="text-right font-telemetry">
                <div className="text-xs font-bold text-[#f97316]">+{w.caloriesBurned} kcal</div>
                {w.distanceKm && <div className="text-[10px] text-[#94a3b8]">{w.distanceKm} km</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEEKLY ACTIVITY OVERVIEW MINI-CHART */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-[#dae2fd]">주간 활동 트렌드</h3>
            <span className="text-[10px] text-[#94a3b8] font-telemetry">DAILY STEP TARGET 10,000 기준</span>
          </div>
          <span className="text-xs font-telemetry text-[#4edea3] font-semibold">평균 10,011 보/일</span>
        </div>

        <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4">
          {data.weeklyActivity.map((d, idx) => {
            const heightPct = Math.min(100, Math.round((d.steps / 13000) * 100));
            const isTargetMet = d.steps >= data.stepGoal;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="text-[9px] font-telemetry text-[#94a3b8] opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                  {(d.steps / 1000).toFixed(1)}k
                </div>
                <div className="w-full bg-[#0b1326] rounded-t-sm h-full flex items-end p-0.5">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      isTargetMet
                        ? 'bg-gradient-to-t from-[#00a572] to-[#4edea3] shadow-[0_0_6px_rgba(78,222,163,0.3)]'
                        : 'bg-gradient-to-t from-[#31394d] to-[#94a3b8]'
                    }`}
                  />
                </div>
                <span className={`text-[10px] mt-1.5 font-medium ${d.day === '오늘' ? 'text-[#f97316] font-bold' : 'text-[#94a3b8]'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ADD MEAL MODAL */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171f33] border border-white/[0.12] rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-[#dae2fd] mb-1">칼로리 & 식사 기록</h3>
            <p className="text-xs text-[#94a3b8] mb-4">섭취한 영양소를 입력하여 일일 칼로리 수지를 맞추세요.</p>

            <form onSubmit={handleAddMeal} className="space-y-3.5">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">식사 분류</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['아침', '점심', '저녁', '간식'] as const).map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => setMealInput((prev) => ({ ...prev, type }))}
                      className={`py-1.5 text-xs rounded-md border font-medium transition-all ${
                        mealInput.type === type
                          ? 'bg-[#f97316] text-[#060e20] border-[#f97316]'
                          : 'bg-[#0b1326] text-[#94a3b8] border-white/[0.08]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">메뉴 이름</label>
                <input
                  type="text"
                  placeholder="예: 그릭요거트 샐러드"
                  value={mealInput.name}
                  onChange={(e) => setMealInput((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-[#0b1326] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">칼로리 (kcal)</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={mealInput.calories}
                  onChange={(e) => setMealInput((prev) => ({ ...prev, calories: Number(e.target.value) }))}
                  required
                  className="w-full bg-[#0b1326] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#f97316] font-telemetry"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="flex-1 py-2 text-xs text-[#94a3b8] bg-[#0b1326] hover:bg-[#131b2e] rounded-lg border border-white/[0.08] transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-[#060e20] bg-gradient-to-r from-[#f97316] to-[#ffb690] hover:brightness-110 rounded-lg transition-all shadow-md"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
