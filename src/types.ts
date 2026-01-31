export interface SensorData {
  Sensor: string;
  'Decimal Index': number;
  Temperature: number;
  'Hold Active': boolean;
  Battery: number;
  date: string;
  time: string;
}

export interface LogEntry {
  id: string;
  date: string;
  time: string;
  sensorType: string;
  temperature: number;
  decimalIndex: number;
}
