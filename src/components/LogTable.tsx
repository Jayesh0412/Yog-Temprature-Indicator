import { LogEntry } from '../types';
import { Download, FileText } from 'lucide-react';

interface LogTableProps {
  logs: LogEntry[];
  onDownloadCSV: () => void;
}

export default function LogTable({ logs, onDownloadCSV }: LogTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">Hold Log History</h2>
        </div>
        <button
          onClick={onDownloadCSV}
          disabled={logs.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Download CSV
        </button>
      </div>

      {logs.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sensor Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Temperature</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Decimal Index</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr
                  key={log.id}
                  className={`border-b border-gray-100 hover:bg-blue-50 transition ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-4 text-sm text-gray-800">{log.date}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{log.time}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{log.sensorType}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                    {log.temperature.toFixed(2)}°C
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-800">{log.decimalIndex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hold events logged yet</p>
          <p className="text-sm text-gray-500 mt-2">
            When Hold Status is activated, events will be automatically logged here
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Total logs: {logs.length}
        </div>
      )}
    </div>
  );
}
