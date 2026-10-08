import React, { useState } from 'react';
import { 
  User, Shield, Smartphone, BatteryCharging, 
  Settings, Award, RefreshCw, CheckCircle2, 
  Target, Edit3, Save, Flame, Footprints, Moon, Droplets
} from 'lucide-react';
import { UserHealthData } from '../types';

interface ProfileScreenProps {
  data: UserHealthData;
  onUpdateData: (updater: (prev: UserHealthData) => UserHealthData) => void;
  onResetData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  data,
  onUpdateData,
  onResetData,
}) => {
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form states
  const [goalSteps, setGoalSteps] = useState(data.stepGoal);
  const [goalSleep, setGoalSleep] = useState(data.sleepGoalHours);
  const [goalCalories, setGoalCalories] = useState(data.calorieBurnGoal);
  const [goalHydration, setGoalHydration] = useState(data.hydrationGoalMl);
  const [weight, setWeight] = useState(data.weightKg);
  const [height, setHeight] = useState(data.heightCm);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleSaveGoals = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateData((prev) => ({
      ...prev,
      stepGoal: Number(goalSteps),
      sleepGoalHours: Number(goalSleep),
      calorieBurnGoal: Number(goalCalories),
      hydrationGoalMl: Number(goalHydration),
      weightKg: Number(weight),
      heightCm: Number(height),
    }));
    setIsEditingGoals(false);
    showToast('건강 목표 및 신체 프로필이 갱신되었습니다!');
  };

  const handleSyncDevice = () => {
    onUpdateData((prev) => ({
      ...prev,
      lastSync: '방금 전 동기화됨',
      deviceBattery: Math.max(10, prev.deviceBattery - 1),
    }));
    showToast('Kinetic Band 디바이스와 동기화 완료!');
  };

  const handleToggleNotifications = () => {
    onUpdateData((prev) => ({
      ...prev,
      notificationsEnabled: !prev.notificationsEnabled,
    }));
    showToast(
      data.notificationsEnabled
        ? '알림이 비활성화되었습니다.'
        : '생체 텔레메트리 알림이 활성화되었습니다.'
    );
  };

  // BMI calculate
  const bmi = +(data.weightKg / Math.pow(data.heightCm / 100, 2)).toFixed(1);

  return (
    <div className="space-y-4 pb-24">
      {/* Toast banner */}
      {toastMsg && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#131b2e] border border-[#f97316]/50 text-[#dae2fd] text-xs font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#f97316]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* USER PROFILE HEADER CARD */}
      <div className="bg-[#171f33] border border-white/[0.08] rounded-xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#f97316]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <img
              src={data.avatarUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#f97316] shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#10b981] border-2 border-[#171f33] flex items-center justify-center text-[10px] text-white">
              ✓
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2.5">
              <h2 className="text-xl font-bold text-[#dae2fd]">{data.userName}</h2>
              <span className="text-xs px-2 py-0.5 rounded bg-[#f97316]/20 text-[#ffb690] font-telemetry border border-[#f97316]/30 inline-block mx-auto sm:mx-0">
                LEVEL {data.userLevel} • {data.userRank}
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] mt-1 font-telemetry">
              ID: KINETIC-8203 // KOREA REGION // ACTIVE MEMBER
            </p>

            {/* Biometric quick summary */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/[0.06] font-telemetry text-center">
              <div>
                <span className="text-[10px] text-[#94a3b8] block">신장</span>
                <span className="text-xs font-bold text-[#dae2fd]">{data.heightCm} cm</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94a3b8] block">체중</span>
                <span className="text-xs font-bold text-[#dae2fd]">{data.weightKg} kg</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94a3b8] block">BMI</span>
                <span className="text-xs font-bold text-[#4edea3]">{bmi}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#94a3b8] block">체지방률</span>
                <span className="text-xs font-bold text-[#dae2fd]">{data.bodyFatPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HEALTH GOALS MANAGEMENT */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#f97316]" />
            <h3 className="text-sm font-bold text-[#dae2fd]">일일 건강 관리 목표 설정</h3>
          </div>
          <button
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="text-xs text-[#f97316] hover:underline flex items-center gap-1"
          >
            {isEditingGoals ? '닫기' : <><Edit3 className="w-3.5 h-3.5" /> 목표 수정</>}
          </button>
        </div>

        {!isEditingGoals ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-telemetry">
            <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#4edea3] mb-1">
                <Footprints className="w-3.5 h-3.5" /> 목표 걸음
              </div>
              <div className="text-base font-bold text-[#dae2fd]">{data.stepGoal.toLocaleString()} 보</div>
              <span className="text-[10px] text-[#94a3b8]">현재 {data.todaySteps.toLocaleString()}보</span>
            </div>

            <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#7bd0ff] mb-1">
                <Moon className="w-3.5 h-3.5" /> 목표 수면
              </div>
              <div className="text-base font-bold text-[#dae2fd]">{data.sleepGoalHours} 시간</div>
              <span className="text-[10px] text-[#94a3b8]">현재 {data.sleepHours.toFixed(1)}시간</span>
            </div>

            <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#f97316] mb-1">
                <Flame className="w-3.5 h-3.5" /> 소모 칼로리
              </div>
              <div className="text-base font-bold text-[#dae2fd]">{data.calorieBurnGoal.toLocaleString()} kcal</div>
              <span className="text-[10px] text-[#94a3b8]">현재 {data.caloriesBurned} kcal</span>
            </div>

            <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-[#38bdf8] mb-1">
                <Droplets className="w-3.5 h-3.5" /> 수분 섭취
              </div>
              <div className="text-base font-bold text-[#dae2fd]">{data.hydrationGoalMl.toLocaleString()} ml</div>
              <span className="text-[10px] text-[#94a3b8]">현재 {data.hydrationMl} ml</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveGoals} className="bg-[#0b1326] p-4 rounded-xl border border-white/[0.08] space-y-3 font-telemetry">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">일일 목표 걸음 (보)</label>
                <input
                  type="number"
                  step="500"
                  value={goalSteps}
                  onChange={(e) => setGoalSteps(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#4edea3]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">목표 수면시간 (시간)</label>
                <input
                  type="number"
                  step="0.5"
                  value={goalSleep}
                  onChange={(e) => setGoalSleep(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#7bd0ff]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">목표 소모 칼로리 (kcal)</label>
                <input
                  type="number"
                  step="50"
                  value={goalCalories}
                  onChange={(e) => setGoalCalories(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#f97316]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">목표 수분 섭취 (ml)</label>
                <input
                  type="number"
                  step="100"
                  value={goalHydration}
                  onChange={(e) => setGoalHydration(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">현재 체중 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs text-[#94a3b8] mb-1">신장 (cm)</label>
                <input
                  type="number"
                  step="1"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-[#131b2e] border border-white/[0.1] rounded-lg px-3 py-1.5 text-sm text-[#dae2fd] focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingGoals(false)}
                className="px-3 py-1.5 text-xs text-[#94a3b8] bg-[#131b2e] rounded-lg"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-[#060e20] bg-gradient-to-r from-[#f97316] to-[#ffb690] rounded-lg flex items-center gap-1.5 shadow"
              >
                <Save className="w-3.5 h-3.5" /> 저장하기
              </button>
            </div>
          </form>
        )}
      </div>

      {/* CONNECTED HARDWARE DEVICES */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#4edea3]" />
            <h3 className="text-sm font-bold text-[#dae2fd]">연동된 스마트 기기</h3>
          </div>
          <button
            onClick={handleSyncDevice}
            className="text-xs text-[#4edea3] hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> 지금 동기화
          </button>
        </div>

        <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#171f33] border border-white/[0.08] flex items-center justify-center text-[#4edea3]">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#dae2fd]">{data.deviceName}</div>
              <div className="text-[10px] text-[#94a3b8] font-telemetry mt-0.5">
                배터리 {data.deviceBattery}% • {data.lastSync}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-telemetry px-2 py-0.5 rounded bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/30">
            CONNECT OK
          </span>
        </div>
      </div>

      {/* ACHIEVEMENTS & BADGES */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-[#ffb690]" />
          <h3 className="text-sm font-bold text-[#dae2fd]">획득한 텔레메트리 배지</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="text-2xl mb-1">🏃‍♂️</div>
            <div className="text-xs font-bold text-[#dae2fd]">10,000보 정복</div>
            <span className="text-[9px] text-[#94a3b8]">32회 달성</span>
          </div>

          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="text-2xl mb-1">🌙</div>
            <div className="text-xs font-bold text-[#dae2fd]">숙면 마스터</div>
            <span className="text-[9px] text-[#94a3b8]">7일 연속 8h</span>
          </div>

          <div className="p-3 bg-[#0b1326] rounded-lg border border-white/[0.04]">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs font-bold text-[#dae2fd]">칼로리 버스터</div>
            <span className="text-[9px] text-[#94a3b8]">일일 2,500 kcal</span>
          </div>
        </div>
      </div>

      {/* SETTINGS & SYSTEM CONTROLS */}
      <div className="bg-[#131b2e] border border-white/[0.08] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-[#94a3b8]" />
          <h3 className="text-sm font-bold text-[#dae2fd]">시스템 환경설정</h3>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-[#0b1326] rounded-lg">
          <div>
            <div className="text-xs font-medium text-[#dae2fd]">생체 지표 알림 푸시</div>
            <div className="text-[10px] text-[#94a3b8]">목표 달성 및 심박 이상 리포트</div>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
              data.notificationsEnabled ? 'bg-[#f97316]' : 'bg-[#31394d]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                data.notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-2.5 bg-[#0b1326] rounded-lg">
          <div>
            <div className="text-xs font-medium text-[#dae2fd]">데이터 초기화</div>
            <div className="text-[10px] text-[#94a3b8]">기본 텔레메트리 수치로 리셋</div>
          </div>
          <button
            onClick={() => {
              if (window.confirm('정말 기본 데이터로 초기화하시겠습니까?')) {
                onResetData();
                showToast('기본 데이터로 초기화되었습니다.');
              }
            }}
            className="px-2.5 py-1 text-xs text-[#ffb4ab] bg-[#93000a]/30 hover:bg-[#93000a]/50 rounded border border-[#ffb4ab]/30 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
};
