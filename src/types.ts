export type Screen = 'home' | 'activity' | 'sleep' | 'profile';

export type Period = 'daily' | 'weekly' | 'monthly';

export interface WorkoutSession {
  id: string;
  type: 'running' | 'cycling' | 'strength' | 'walking' | 'hiit';
  name: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  avgHeartRate: number;
  timestamp: string;
}

export interface MealRecord {
  id: string;
  name: string;
  calories: number;
  type: '아침' | '점심' | '저녁' | '간식';
  time: string;
}

export interface HourlySteps {
  hour: string;
  steps: number;
}

export interface DayActivity {
  day: string;
  steps: number;
  calories: number;
  sleepHours: number;
}

export interface UserHealthData {
  // Steps
  todaySteps: number;
  stepGoal: number;
  distanceKm: number;
  activeMinutes: number;
  floorsClimbed: number;
  hourlySteps: HourlySteps[];
  weeklyActivity: DayActivity[];

  // Calories
  caloriesBurned: number;
  calorieBurnGoal: number;
  activeBurn: number;
  basalBurn: number;
  calorieIntake: number;
  calorieIntakeGoal: number;
  meals: MealRecord[];

  // Sleep
  sleepHours: number; // e.g. 7.63
  sleepGoalHours: number; // e.g. 8.0
  sleepScore: number;
  deepSleepMinutes: number;
  remSleepMinutes: number;
  lightSleepMinutes: number;
  awakeMinutes: number;
  bedTime: string;
  wakeTime: string;
  sleepEfficiency: number;
  sleepingNow: boolean;
  sleepStartTime: number | null;

  // Vitals
  heartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  hrv: number;
  spo2: number;
  hydrationMl: number;
  hydrationGoalMl: number;

  // Biometrics & Profile
  userName: string;
  userRank: string;
  userLevel: number;
  gender: '남성' | '여성';
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  bodyFatPercent: number;
  muscleMassKg: number;
  avatarUrl: string;

  // Sessions
  workouts: WorkoutSession[];

  // Settings
  deviceBattery: number;
  deviceName: string;
  lastSync: string;
  smartAlarmEnabled: boolean;
  alarmTime: string;
  notificationsEnabled: boolean;
}
