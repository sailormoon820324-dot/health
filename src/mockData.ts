import { UserHealthData } from './types';

export const initialHealthData: UserHealthData = {
  // Steps
  todaySteps: 8420,
  stepGoal: 10000,
  distanceKm: 6.2,
  activeMinutes: 74,
  floorsClimbed: 14,
  hourlySteps: [
    { hour: '06:00', steps: 120 },
    { hour: '08:00', steps: 1450 },
    { hour: '10:00', steps: 890 },
    { hour: '12:00', steps: 1820 },
    { hour: '14:00', steps: 640 },
    { hour: '16:00', steps: 1100 },
    { hour: '18:00', steps: 1950 },
    { hour: '20:00', steps: 450 },
  ],
  weeklyActivity: [
    { day: '월', steps: 9420, calories: 2150, sleepHours: 7.2 },
    { day: '화', steps: 10840, calories: 2380, sleepHours: 8.0 },
    { day: '수', steps: 8150, calories: 1940, sleepHours: 6.8 },
    { day: '목', steps: 11200, calories: 2420, sleepHours: 7.5 },
    { day: '금', steps: 9600, calories: 2080, sleepHours: 7.1 },
    { day: '토', steps: 12450, calories: 2650, sleepHours: 8.4 },
    { day: '오늘', steps: 8420, calories: 1840, sleepHours: 7.63 },
  ],

  // Calories
  caloriesBurned: 1840,
  calorieBurnGoal: 2200,
  activeBurn: 620,
  basalBurn: 1220,
  calorieIntake: 1480,
  calorieIntakeGoal: 2100,
  meals: [
    { id: 'm1', name: '오트밀 볼 & 바나나 + 그릭요거트', calories: 420, type: '아침', time: '08:15' },
    { id: 'm2', name: '수비드 닭가슴살 샐러드 & 현미밥', calories: 580, type: '점심', time: '12:40' },
    { id: 'm3', name: '프로틴 쉐이크 & 아몬드', calories: 230, type: '간식', time: '16:20' },
    { id: 'm4', name: '연어 구이 & 구운 야채', calories: 250, type: '저녁', time: '19:10' },
  ],

  // Sleep
  sleepHours: 7.63, // 7h 38m
  sleepGoalHours: 8.0,
  sleepScore: 88,
  deepSleepMinutes: 105, // 1h 45m
  remSleepMinutes: 130,  // 2h 10m
  lightSleepMinutes: 200, // 3h 20m
  awakeMinutes: 23,
  bedTime: '23:20',
  wakeTime: '06:58',
  sleepEfficiency: 95,
  sleepingNow: false,
  sleepStartTime: null,

  // Vitals
  heartRate: 68,
  restingHeartRate: 58,
  maxHeartRate: 148,
  hrv: 64,
  spo2: 98,
  hydrationMl: 1750,
  hydrationGoalMl: 2500,

  // Profile
  userName: '최지훈',
  userRank: 'Kinetic Elite (상위 4%)',
  userLevel: 24,
  gender: '남성',
  age: 29,
  heightCm: 178,
  weightKg: 71.4,
  targetWeightKg: 70.0,
  bodyFatPercent: 15.2,
  muscleMassKg: 35.8,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',

  // Workouts
  workouts: [
    {
      id: 'w1',
      type: 'running',
      name: '도심 모닝 인터벌 러닝',
      durationMinutes: 32,
      caloriesBurned: 340,
      distanceKm: 4.8,
      avgHeartRate: 142,
      timestamp: '오늘 오전 07:10',
    },
    {
      id: 'w2',
      type: 'walking',
      name: '점심 활력 보행',
      durationMinutes: 24,
      caloriesBurned: 110,
      distanceKm: 1.6,
      avgHeartRate: 98,
      timestamp: '오늘 오후 12:45',
    },
    {
      id: 'w3',
      type: 'strength',
      name: '상체 코어 & 케틀벨 루틴',
      durationMinutes: 40,
      caloriesBurned: 280,
      avgHeartRate: 128,
      timestamp: '어제 오후 19:00',
    },
  ],

  // Settings
  deviceBattery: 84,
  deviceName: 'Kinetic Pulse Band Ultra',
  lastSync: '방금 전 (실시간 연동)',
  smartAlarmEnabled: true,
  alarmTime: '06:45',
  notificationsEnabled: true,
};

const STORAGE_KEY = 'kinetic_telemetry_health_data_v2';

export function loadHealthData(): UserHealthData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...initialHealthData, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return initialHealthData;
}

export function saveHealthData(data: UserHealthData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // fallback
  }
}
