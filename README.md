# Temperature Monitoring Dashboard - Yog Electro Process Pvt. Ltd.

A secure, real-time temperature monitoring dashboard with Firebase Authentication and Realtime Database integration.

## Features

- **Secure Authentication**: Firebase Email/Password authentication with protected routes
- **Real-time Monitoring**: Live temperature and sensor data updates from Firebase
- **Interactive Chart**: Dynamic temperature vs time graph with live updates
- **Automatic Logging**: Automatic hold event logging when Hold Status is activated
- **Data Export**: Download logs as CSV for analysis
- **Responsive Design**: Mobile-friendly dashboard with modern UI

## Setup Instructions

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Authentication** with Email/Password sign-in method
4. Enable **Realtime Database**
5. Set up database rules for security

### 2. Firebase Configuration

1. In your Firebase project, go to Project Settings
2. Copy your Firebase configuration details
3. Open the `.env` file in the project root
4. Replace the placeholder values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Database Structure

Your Realtime Database should follow this structure:

```json
{
  "Yog": {
    "Sensor": "K-Type TC",
    "Decimal Index": 1,
    "Temperature": 28.1,
    "Hold Active": false,
    "Battery": 87
  },
  "logs": {
    "logId1": {
      "date": "2026-01-31",
      "time": "10:15:22",
      "sensorType": "K-Type TC",
      "temperature": 28.1,
      "decimalIndex": 1
    }
  }
}
```

### 4. Create User Accounts

1. Go to Firebase Console > Authentication
2. Add users manually or use Firebase Authentication API
3. Users can then log in with their email and password

### 5. Run the Application

```bash
npm install
npm run dev
```

The application will start and you can access it at the URL shown in the terminal.

## Dashboard Features

### Real-time Data Cards
- **Sensor Type**: Shows the active thermocouple type (K-Type TC, PT100, PT1000, etc.)
- **Temperature**: Current temperature reading in Celsius
- **Decimal Index**: Precision level for temperature readings
- **Hold Status**: ON/OFF indicator for hold mode
- **Battery**: Current battery percentage

### Live Temperature Chart
- Displays last 20 temperature readings
- Updates automatically as new data comes from Firebase
- Shows temperature trends over time with smooth line graph

### Hold Log System
- Automatically logs events when Hold Status changes to ON
- Records: Date, Time, Sensor Type, Temperature, Decimal Index
- Displays logs in a sortable table
- Export logs to CSV with one click

## Security Features

- Protected routes requiring authentication
- Only authenticated users can access the dashboard
- Secure Firebase connection with environment variables
- Automatic session management

## Technologies Used

- React 18 with TypeScript
- Firebase Authentication & Realtime Database
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons
- SVG-based charting for real-time visualization

## Support

For issues or questions, contact Yog Electro Process Pvt. Ltd. technical support.
