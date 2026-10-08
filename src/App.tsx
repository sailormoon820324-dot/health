/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, UserHealthData } from './types';
import { loadHealthData, saveHealthData, initialHealthData } from './mockData';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './screens/HomeScreen';
import { ActivityScreen } from './screens/ActivityScreen';
import { SleepScreen } from './screens/SleepScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [healthData, setHealthData] = useState<UserHealthData>(loadHealthData);

  // Sync state changes with localStorage
  useEffect(() => {
    saveHealthData(healthData);
  }, [healthData]);

  const handleUpdateData = (updater: (prev: UserHealthData) => UserHealthData) => {
    setHealthData((prev) => updater(prev));
  };

  const handleResetData = () => {
    setHealthData(initialHealthData);
    saveHealthData(initialHealthData);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex flex-col font-sans selection:bg-[#f97316]/30 selection:text-white">
      {/* Universal Header with Profile Button (//header//img[@alt='Profile']/parent::*) */}
      <Header
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        avatarUrl={healthData.avatarUrl}
        userName={healthData.userName}
      />

      {/* Main Screen Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3.5 pt-3.5 pb-6">
        {currentScreen === 'home' && (
          <HomeScreen
            data={healthData}
            onUpdateData={handleUpdateData}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'activity' && (
          <ActivityScreen
            data={healthData}
            onUpdateData={handleUpdateData}
          />
        )}

        {currentScreen === 'sleep' && (
          <SleepScreen
            data={healthData}
            onUpdateData={handleUpdateData}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            data={healthData}
            onUpdateData={handleUpdateData}
            onResetData={handleResetData}
          />
        )}
      </main>

      {/* Universal Bottom Navigation Bar (//nav//a[@data-path='...']) */}
      <Navigation
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />
    </div>
  );
}
