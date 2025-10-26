# Timesheet Frontend - Backend Integration Guide

This document describes the integration between the Timesheet Frontend (Timesheet_Fe_ts) and the Timesheet Backend microservices (save-service and submit-service).

## Overview

The Timesheet Frontend is now fully integrated with the backend microservices architecture:

- **Save Service** (Port 3000): Saves draft timesheet records with status "Saved"
- **Submit Service** (Port 3001): Submits final timesheet records with status "Submitted"

## Architecture

### Frontend Structure

```
src/
├── services/
│   └── timesheetAPI.ts          # API service layer for backend communication
├── components/
│   ├── HoursCell.tsx             # Editable hours cell component
│   ├── WFHCell.tsx               # Work-from-home toggle component
│   ├── Header.tsx
│   ├── DateCell.tsx
│   └── DayCell.tsx
├── utils/
│   └── weekNavigation.ts          # Week navigation utilities
├── App.tsx                        # Main app with state management
└── main.tsx
```

### Backend Services

```
Timesheet-backend/
├── save-service/                 # Save Service (Port 3000)
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
├── submit-service/               # Submit Service (Port 3001)
│   ├── index.js
│   ├── package.json
│   └── Dockerfile
└── docker-compose.yml            # Run both services + MongoDB
```

## Features

### Frontend Features

✅ **Interactive Timesheet Grid**
- 7-day week view with date navigation
- Editable billable hours cells (click to edit)
- Editable non-billable hours cells (click to edit)
- WFH (Work From Home) toggle for each day
- Status messages for success/error feedback
- Backend service health monitoring

✅ **Data Management**
- Weekly timesheet data state management
- Automatic day selection tracking
- Date formatting for API compatibility

✅ **API Integration**
- Async save functionality to save-service
- Async submit functionality to submit-service
- Error handling with user-friendly messages
- Service health checks on app startup

### Backend Features

✅ **Save Service (Port 3000)**
- `POST /save-service/timesheets` - Save single timesheet record
- `POST /save-service/timesheets/weekly` - Save weekly timesheet records
- `GET /save-service/health` - Health check

✅ **Submit Service (Port 3001)**
- `POST /submit-service/timesheets` - Submit single timesheet record
- `POST /submit-service/timesheets/weekly` - Submit weekly timesheet records
- `GET /submit-service/health` - Health check

✅ **Database**
- MongoDB collection for storing timesheet records
- Upsert logic: updates existing records or creates new ones
- Records include: date, hours, employeeId, projectId, taskId, recordType, status, timestamps

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (local or Docker)
- Docker & Docker Compose (optional, for containerized setup)

### 1. Start Backend Services

**Option A: Using Docker Compose (Recommended)**

```bash
cd Timesheet-backend
docker-compose up -d
```

This starts:
- MongoDB (mongodb://localhost:27017)
- Save Service (http://localhost:3000)
- Submit Service (http://localhost:3001)

**Option B: Manual Setup**

```bash
# Terminal 1: Start Save Service
cd Timesheet-backend/save-service
npm install
npm run dev

# Terminal 2: Start Submit Service
cd Timesheet-backend/submit-service
npm install
npm run dev
```

### 2. Configure Frontend

Create a `.env.local` file in the Timesheet_Fe_ts directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` to set your backend URL:

```
# For local development
VITE_BACKEND_URL=http://localhost:3000

# For production
# VITE_BACKEND_URL=https://your-api-domain.com
```

### 3. Install & Run Frontend

```bash
cd Timesheet_Fe_ts
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or the Vite-assigned port).

## API Endpoints Reference

### Health Checks

```bash
# Check Save Service
curl http://localhost:3000/save-service/health

# Check Submit Service
curl http://localhost:3001/submit-service/health
```

### Save Single Timesheet

```bash
POST http://localhost:3000/save-service/timesheets
Content-Type: application/json

{
  "date": "2025-10-24",
  "hours": 8,
  "employeeId": "EMP001",
  "projectId": "PROJ001",
  "recordType": "billable",
  "taskId": "TASK001"
}
```

### Save Weekly Timesheets

```bash
POST http://localhost:3000/save-service/timesheets/weekly
Content-Type: application/json

{
  "startDate": "2025-10-20",
  "endDate": "2025-10-26",
  "hours": 8,
  "employeeId": "EMP001",
  "projectId": "PROJ001",
  "recordType": "billable",
  "taskId": "TASK001"
}
```

### Submit Weekly Timesheets

```bash
POST http://localhost:3001/submit-service/timesheets/weekly
Content-Type: application/json

{
  "startDate": "2025-10-20",
  "endDate": "2025-10-26",
  "hours": 8,
  "employeeId": "EMP001",
  "projectId": "PROJ001",
  "recordType": "billable",
  "taskId": "TASK001"
}
```

## Frontend API Service (`src/services/timesheetAPI.ts`)

The `timesheetAPI.ts` module provides the following functions:

```typescript
// Health Checks
checkSaveServiceHealth(): Promise<boolean>
checkSubmitServiceHealth(): Promise<boolean>

// Single Records
saveTimesheet(record: TimesheetRecord): Promise<TimesheetResponse>
submitTimesheet(record: TimesheetRecord): Promise<TimesheetResponse>

// Weekly Records
saveWeeklyTimesheets(request: WeeklyTimesheetRequest): Promise<TimesheetResponse>
submitWeeklyTimesheets(request: WeeklyTimesheetRequest): Promise<TimesheetResponse>

// Interfaces
interface TimesheetRecord {
  date: string | Date
  hours: number
  employeeId: string
  projectId: string
  taskId: string
  recordType: string
}

interface WeeklyTimesheetRequest {
  startDate: string
  endDate: string
  hours: number
  employeeId: string
  projectId: string
  recordType: string
  taskId: string
}
```

## Component Documentation

### HoursCell Component

Interactive editable hours cell for entering billable or non-billable hours.

**Props:**
- `hours: number` - Current hours value
- `onChange?: (hours: number) => void` - Callback when hours change
- `dayIndex?: number` - Day index for accessibility

**Features:**
- Click to edit
- Input validation (0-24)
- Enter to save, Escape to cancel
- Real-time visual feedback

### WFHCell Component

Toggle button for Work From Home status.

**Props:**
- `isWFH: boolean` - Current WFH status
- `onChange?: (isWFH: boolean) => void` - Callback when status changes
- `dayIndex?: number` - Day index for accessibility

**Features:**
- Click to toggle
- Visual indication (Y/N)
- Color coded (blue when WFH=true)

## Data Flow

```
User Input (Frontend)
    ↓
HoursCell/WFHCell Components
    ↓
App.tsx State Management (dayData)
    ↓
Save/Submit Buttons Click
    ↓
timesheetAPI Service Functions
    ↓
HTTP POST Requests
    ↓
Backend Services
    ↓
MongoDB
    ↓
Response ← Success/Error Message ← Frontend
```

## Error Handling

The frontend includes comprehensive error handling:

1. **Service Health Checks**: On app startup, health is checked for both services
2. **API Errors**: Network/HTTP errors are caught and displayed to the user
3. **User Feedback**: Success and error messages are shown in colored banners
4. **Disabled States**: Buttons are disabled when services are unavailable

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Base URL for backend services | `http://localhost:3000` |

**URL Construction:**
- Save Service: `{VITE_BACKEND_URL}/save-service/*`
- Submit Service: `{VITE_BACKEND_URL.replace('3000', '3001')}/submit-service/*`

## Development Notes

### Default Configuration

Currently, the frontend uses default values for:
- `employeeId`: "EMP001"
- `projectId`: "PROJ001"
- `taskId`: "TASK001"

**To customize:** Edit the constants at the top of `src/App.tsx`:

```typescript
const DEFAULT_PROJECT_ID = 'PROJ001'
const DEFAULT_EMPLOYEE_ID = 'EMP001'
const DEFAULT_TASK_ID = 'TASK001'
```

### Adding Authentication

To add authentication headers to API requests, modify `src/services/timesheetAPI.ts`:

```typescript
const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // Add this
  },
  body: JSON.stringify(data)
})
```

### Testing the Integration

**Quick Test:**

```bash
# Terminal 1: Backend
cd Timesheet-backend && docker-compose up

# Terminal 2: Frontend
cd Timesheet_Fe_ts && npm run dev

# Open browser to http://localhost:5173
# Edit hours and click Save/Submit
# Check browser console for API responses
# Check MongoDB for saved records
```

## Troubleshooting

### Services Not Responding

1. Check if services are running:
```bash
curl http://localhost:3000/save-service/health
curl http://localhost:3001/submit-service/health
```

2. Check MongoDB connection:
```bash
# If using Docker
docker logs timesheet-backend-mongo-1
```

3. Check frontend console for errors (DevTools)

### CORS Issues

If you see CORS errors, ensure the backend services have CORS enabled. They should have:
```javascript
app.use(cors())
```

### Environment Variables Not Loading

1. Ensure `.env.local` file exists in frontend root
2. Restart the dev server (`npm run dev`)
3. Check that variable names start with `VITE_`

## Deployment

### Frontend Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment

See `Timesheet-backend/README.md` for deployment instructions.

Update `VITE_BACKEND_URL` in production `.env` to point to your deployed backend.

## Future Enhancements

- [ ] Authentication/Authorization
- [ ] User profiles and employee details
- [ ] Project and task selection UI
- [ ] Timesheet history and templates
- [ ] Notifications
- [ ] PDF export
- [ ] Mobile responsive design improvements
- [ ] Offline support with service workers
- [ ] Data validation and business rules

## Support

For issues or questions:
1. Check the backend logs: `docker logs`
2. Check the frontend console: F12 → Console tab
3. Review API responses in Network tab
4. Check MongoDB for data persistence

## License

ISC
