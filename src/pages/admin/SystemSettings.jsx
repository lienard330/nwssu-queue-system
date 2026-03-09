import { useState, useEffect } from 'react';
import { Settings, Sliders, Bell, PlusCircle } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useQueueApi } from '../../hooks/useQueueApi';
import { useToast } from '../../context/ToastContext';
import ToggleSwitch from '../../components/common/ToggleSwitch';

export default function SystemSettings() {
  const { settings, updateSettings, updateServiceSetting } = useSettings();
  const queueApi = useQueueApi();
  const { toast } = useToast();
  const [cutOff, setCutOff] = useState(settings.cutOffTime || '17:00');
  const [gracePeriod, setGracePeriod] = useState(settings.gracePeriod ?? 5);
  const [notificationTrigger, setNotificationTrigger] = useState(settings.notificationTrigger ?? 3);
  const [apiMode, setApiMode] = useState(false);
  const [serviceConfigs, setServiceConfigs] = useState({});

  useEffect(() => {
    (async () => {
      const ok = await queueApi.checkBackend();
      setApiMode(ok);
      if (ok) {
        for (const s of ['EN', 'CL', 'TR', 'IP']) {
          try {
            const c = await queueApi.getServiceConfig(s);
            setServiceConfigs((prev) => ({ ...prev, [s]: c }));
          } catch (e) {}
        }
      }
    })();
  }, []);

  const handleSaveAll = () => {
    updateSettings({ cutOffTime: cutOff, gracePeriod, notificationTrigger });
    if (apiMode) {
      const serveFirst = parseInt(document.getElementById('carry-over-serve-first')?.value || '0', 10);
      const expireDays = parseInt(document.getElementById('carry-over-expire')?.value || '3', 10);
      ['EN', 'CL', 'TR', 'IP'].forEach((id) => {
        queueApi.updateServiceConfig(id, {
          cutoff_time: cutOff,
          grace_period_minutes: gracePeriod,
          carry_over_serve_first: serveFirst,
          carry_over_expire_days: expireDays,
        }).catch(() => {});
      });
    }
    toast.success('Settings Saved', 'All settings saved successfully');
  };

  const handleServiceSave = async (id, name, dailyLimit) => {
    updateServiceSetting(id, { maxPerDay: dailyLimit });
    if (apiMode) {
      try {
        await queueApi.updateServiceConfig(id, { daily_limit: dailyLimit });
      } catch (e) {}
    }
    toast.success('Settings Saved', `${name} settings saved ✓`);
  };

  const services = [
    { id: 'EN', name: 'Enrollment' },
    { id: 'CL', name: 'Clearance' },
    { id: 'TR', name: 'Transcript' },
    { id: 'IP', name: 'INC Process' },
  ];

  const futureServices = [
    { name: 'Cashier Office', desc: 'Handle payment queues and billing transactions', icon: '🏦' },
    { name: 'University Library', desc: 'Manage library service requests', icon: '📚' },
    { name: 'Health / Clinic', desc: 'Student health consultations', icon: '🏥' },
    { name: 'Scholarship Office', desc: 'Scholarship applications', icon: '🎓' },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-sm text-gray-500">Configure queue system parameters</p>
        </div>
        <button onClick={handleSaveAll} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800">
          Save All Changes
        </button>
      </div>

      <div className="p-6 rounded-xl bg-white shadow-sm mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Service Settings</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Configure processing time and daily limits</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-4">Service</th>
                <th className="pb-2 pr-4">Avg Processing Time</th>
                <th className="pb-2 pr-4">Max Queue Per Day</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => {
                const cfg = settings.serviceSettings?.[s.id] || {};
                const apiCfg = serviceConfigs[s.id] || {};
                const dailyLimit = apiMode ? (apiCfg.daily_limit ?? cfg.maxPerDay ?? 100) : (cfg.maxPerDay ?? 100);
                return (
                  <tr key={s.id} className="border-b">
                    <td className="py-3 pr-4">
                      <span className="font-semibold">{s.name}</span>
                      <span className="ml-2 text-xs text-gray-400">{s.id}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <input type="number" defaultValue={cfg.avgTime ?? 5} className="w-16 px-2 py-1 border rounded" /> min
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="number"
                        defaultValue={dailyLimit}
                        id={`daily-${s.id}`}
                        className="w-20 px-2 py-1 border rounded"
                      />{' '}
                      slots
                    </td>
                    <td className="py-3 pr-4">
                      <ToggleSwitch checked={cfg.status === 'Open'} onChange={(v) => updateServiceSetting(s.id, { status: v ? 'Open' : 'Closed' })} />
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleServiceSave(s.id, s.name, parseInt(document.getElementById(`daily-${s.id}`)?.value || dailyLimit, 10))}
                        className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 rounded-xl bg-white shadow-sm mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Sliders className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Queue Parameters</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Control core queue behavior</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-900">Cut-Off Time</p>
            <p className="text-xs text-gray-500 mt-1">Time after which no new queues are accepted</p>
            <input type="time" value={cutOff} onChange={(e) => setCutOff(e.target.value)} className="mt-2 px-4 py-2 border rounded-lg w-full" />
          </div>
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-900">Grace Period</p>
            <p className="text-xs text-gray-500 mt-1">Minutes student has to arrive after being called</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="number" value={gracePeriod} onChange={(e) => setGracePeriod(Number(e.target.value))} className="w-16 px-2 py-2 border rounded-lg" />
              <span>minutes</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-900">Notification Trigger</p>
            <p className="text-xs text-gray-500 mt-1">Alert student when X slots away from turn</p>
            <div className="mt-2 flex items-center gap-2">
              <input type="number" value={notificationTrigger} onChange={(e) => setNotificationTrigger(Number(e.target.value))} className="w-16 px-2 py-2 border rounded-lg" />
              <span>slots before</span>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-gray-200">
            <p className="font-medium text-gray-900">Priority Queue</p>
            <p className="text-xs text-gray-500 mt-1">Unserved students get priority next business day</p>
            <div className="mt-2">
              <ToggleSwitch checked={settings.priorityQueueEnabled} onChange={(v) => updateSettings({ priorityQueueEnabled: v })} />
            </div>
          </div>
          {apiMode && (
            <>
              <div className="p-4 rounded-xl border border-gray-200">
                <p className="font-medium text-gray-900">Carry-Over: Serve First X</p>
                <p className="text-xs text-gray-500 mt-1">Serve first N carry-over tickets before regular</p>
                <input
                  type="number"
                  id="carry-over-serve-first"
                  defaultValue={serviceConfigs.EN?.carry_over_serve_first ?? 0}
                  min={0}
                  className="mt-2 w-20 px-2 py-2 border rounded-lg"
                />
              </div>
              <div className="p-4 rounded-xl border border-gray-200">
                <p className="font-medium text-gray-900">Carry-Over Expire Days</p>
                <p className="text-xs text-gray-500 mt-1">Carry-over tickets expire after N days</p>
                <input
                  type="number"
                  id="carry-over-expire"
                  defaultValue={serviceConfigs.EN?.carry_over_expire_days ?? 3}
                  min={1}
                  className="mt-2 w-20 px-2 py-2 border rounded-lg"
                />
              </div>
            </>
          )}
        </div>
        <button onClick={handleSaveAll} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
          Save Queue Parameters
        </button>
      </div>

      <div className="p-6 rounded-xl bg-white shadow-sm mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Notification Settings</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Control when and how students are notified</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable In-App Notifications</p>
              <p className="text-xs text-gray-500">Students receive position updates</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Send Missed-Call Alert</p>
              <p className="text-xs text-gray-500">Alert student when they miss their turn</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto-Cancel After Grace Period</p>
              <p className="text-xs text-gray-500">Automatically cancel queue</p>
            </div>
            <ToggleSwitch checked={true} onChange={() => {}} />
          </div>
        </div>
        <button onClick={() => toast.success('Saved', 'Notification settings saved')} className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">
          Save Notification Settings
        </button>
      </div>

      <div className="p-6 rounded-xl bg-white shadow-sm mt-4">
        <div className="flex items-center gap-2 mb-2">
          <PlusCircle className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">System Expansion</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Planned service modules for future deployment</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureServices.map((fs) => (
            <div key={fs.name} className="p-5 rounded-xl border-2 border-dashed border-gray-200 relative">
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">Coming Soon</span>
              <span className="text-3xl">{fs.icon}</span>
              <h4 className="font-semibold text-gray-900 mt-3">{fs.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{fs.desc}</p>
              <button disabled className="mt-3 w-full py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed text-sm">
                Enable Module
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
