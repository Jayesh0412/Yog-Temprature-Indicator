import { useEffect, useState } from 'react';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  time: string;
  temperature: number;
}

export default function TemperatureChart() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const maxPoints = 20;

  useEffect(() => {
    const sensorRef = ref(database, 'Yog');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.Temperature !== null) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();

        setDataPoints((prev) => {
          const newPoints = [...prev, { time: timeString, temperature: data.Temperature }];
          return newPoints.slice(-maxPoints);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const maxTemp = Math.max(...dataPoints.map((d) => d.temperature), 30);
  const minTemp = Math.min(...dataPoints.map((d) => d.temperature), 0);
  const tempRange = maxTemp - minTemp || 1;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Temperature vs Time</h2>
        </div>
        <div className="text-sm text-gray-600">
          Live Data (Last {dataPoints.length} readings)
        </div>
      </div>

      {dataPoints.length > 0 ? (
        <div className="relative h-80 bg-gradient-to-b from-blue-50 to-white rounded-lg p-4 border border-gray-200">
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
            <defs>
              <linearGradient id="temperatureGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
                <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
              </linearGradient>
            </defs>

            <polyline
              fill="url(#temperatureGradient)"
              stroke="none"
              points={dataPoints
                .map((point, index) => {
                  const x = (index / (maxPoints - 1)) * 800;
                  const y = 300 - ((point.temperature - minTemp) / tempRange) * 280;
                  return `${x},${y}`;
                })
                .join(' ') + ` 800,300 0,300`}
            />

            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={dataPoints
                .map((point, index) => {
                  const x = (index / (maxPoints - 1)) * 800;
                  const y = 300 - ((point.temperature - minTemp) / tempRange) * 280;
                  return `${x},${y}`;
                })
                .join(' ')}
            />

            {dataPoints.map((point, index) => {
              const x = (index / (maxPoints - 1)) * 800;
              const y = 300 - ((point.temperature - minTemp) / tempRange) * 280;
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#3B82F6"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          <div className="absolute top-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
            <span>{maxTemp.toFixed(1)}°C</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-600">
            <span>{minTemp.toFixed(1)}°C</span>
          </div>
        </div>
      ) : (
        <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Waiting for temperature data...</p>
        </div>
      )}

      {dataPoints.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
          <span>First reading: {dataPoints[0].time}</span>
          <span className="font-semibold text-blue-600">
            Current: {dataPoints[dataPoints.length - 1].temperature.toFixed(1)}°C
          </span>
          <span>Latest reading: {dataPoints[dataPoints.length - 1].time}</span>
        </div>
      )}
    </div>
  );
}
