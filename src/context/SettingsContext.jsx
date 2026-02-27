import { createContext, useContext, useState, useEffect } from 'react';

const defaultSettings = {
  cutOffTime: '17:00',
  gracePeriod: 5,
  notificationTrigger: 3,
  priorityQueueEnabled: true,
  inAppNotifications: true,
  notifySlotsBefore: 3,
  missedCallAlert: true,
  autoCancelAfterGrace: true,
  dailySummaryToAdmin: false,
  notifyOnCancellation: true,
  serviceSettings: {
    EN: { avgTime: 5, maxPerDay: 100, status: 'Open' },
    CL: { avgTime: 8, maxPerDay: 80, status: 'Open' },
    TR: { avgTime: 15, maxPerDay: 60, status: 'Open' },
    IP: { avgTime: 10, maxPerDay: 50, status: 'Closed' },
  },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('nwssu_settings');
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('nwssu_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateServiceSetting = (serviceId, updates) => {
    setSettings((prev) => ({
      ...prev,
      serviceSettings: {
        ...prev.serviceSettings,
        [serviceId]: { ...prev.serviceSettings[serviceId], ...updates },
      },
    }));
  };

  const cutOffFormatted = () => {
    const [h, m] = (settings.cutOffTime || '17:00').split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateServiceSetting, cutOffFormatted }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
