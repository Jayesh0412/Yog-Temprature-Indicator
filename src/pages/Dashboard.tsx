import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { database } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { SensorData, LogEntry } from '../types';
import { LogOut, Thermometer, Activity, Gauge, Battery, Lock, Unlock } from 'lucide-react';
import TemperatureChart from '../components/TemperatureChart';
import LogTable from '../components/LogTable';

export default function Dashboard() {
  const { signOut, currentUser } = useAuth();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [previousHoldStatus, setPreviousHoldStatus] = useState(false);

  useEffect(() => {
    const sensorRef = ref(database, 'Yog');
    const unsubscribeSensor = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(data);

        if (data['Hold Active'] && !previousHoldStatus) {
          logHoldEvent(data);
        }

        setPreviousHoldStatus(data['Hold Active']);
      }
    });

    const logsRef = ref(database, 'logs');
    const unsubscribeLogs = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const logsArray: LogEntry[] = Object.entries(data).map(([id, log]: [string, any]) => ({
          id,
          date: log.date,
          time: log.time,
          sensorType: log.sensorType,
          temperature: log.temperature,
          decimalIndex: log.decimalIndex,
        }));
        setLogs(logsArray.reverse());
      }
    });

    return () => {
      unsubscribeSensor();
      unsubscribeLogs();
    };
  }, [previousHoldStatus]);

  const logHoldEvent = (data: SensorData) => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];

    const logsRef = ref(database, 'logs');
    const newLogRef = push(logsRef);

    set(newLogRef, {
      date,
      time,
      sensorType: data.Sensor,
      temperature: data.Temperature,
      decimalIndex: data['Decimal Index'],
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const downloadCSV = () => {
    const headers = ['Date', 'Time', 'Sensor Type', 'Temperature (°C)', 'Decimal Index'];
    const rows = logs.map(log => [
      log.date,
      log.time,
      log.sensorType,
      log.temperature.toString(),
      log.decimalIndex.toString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temperature-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Yog Electro Process Pvt. Ltd.</h1>
                <p className="text-xs text-gray-600">Temperature Monitoring Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sensorData ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Sensor Type</p>
                <p className="text-xl font-bold text-gray-800">{sensorData.Sensor}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <Thermometer className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Temperature</p>
                <p className="text-3xl font-bold text-gray-800">{sensorData.Temperature.toFixed(sensorData['Decimal Index'])}°C</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <Gauge className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Decimal Index</p>
                <p className="text-xl font-bold text-gray-800">{sensorData['Decimal Index']}</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  {sensorData['Hold Active'] ? (
                    <Lock className="w-8 h-8 text-orange-600" />
                  ) : (
                    <Unlock className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">Hold Status</p>
                <p className={`text-xl font-bold ${sensorData['Hold Active'] ? 'text-orange-600' : 'text-gray-400'}`}>
                  {sensorData['Hold Active'] ? 'ON' : 'OFF'}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-2">
                  <Battery className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-sm text-gray-600 mb-1">Battery</p>
                <p className="text-xl font-bold text-gray-800">{sensorData.Battery}%</p>
              </div>
            </div>

            <TemperatureChart />

            <LogTable logs={logs} onDownloadCSV={downloadCSV} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading sensor data...</p>
          </div>
        )}
      </main>
    </div>
  );
}
