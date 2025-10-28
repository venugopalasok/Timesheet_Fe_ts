# Timesheet Application - Quick Start Guide

Get the Timesheet application running in 5 minutes!

## Prerequisites

- Node.js 18+
- npm or yarn
- Docker & Docker Compose (recommended for backend)
- Git

## Quick Setup

### Step 1: Start Backend Services (in a terminal)

```bash
cd Timesheet-backend
docker-compose up -d
```

Wait 10-15 seconds for MongoDB and services to start.

**Verify services are running:**
```bash
curl http://localhost:3000/save-service/health
curl http://localhost:3001/submit-service/health
```

Both should return: `{"status":"OK"}`

### Step 2: Configure Frontend (in new terminal)

```bash
cd Timesheet_Fe_ts
cp .env.example .env.local
```

The `.env.local` file should contain:
```
VITE_BACKEND_URL=http://localhost:3000
```

### Step 3: Install & Run Frontend

```bash
npm install
npm run dev
```

Open your browser to: **http://localhost:5173**

## What You Can Do Now

✅ **Edit Hours:** Click any hour cell to enter billable/non-billable hours (0-24)
✅ **Toggle WFH:** Click Y/N cells to toggle Work From Home status
✅ **Navigate Weeks:** Use < > buttons to navigate through the current month
✅ **Save Draft:** Click "Save" button to save your timesheet to the backend
✅ **Submit:** Click "Submit" button to submit your timesheet

## Testing the Integration

1. **Edit some hours:**
   - Click on a billable hours cell
   - Enter a number (e.g., 8)
   - Press Enter

2. **Save to backend:**
   - Click the "Save" button
   - You should see a green success message

3. **Check the data:**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Click Save again
   - See the POST request to `/save-service/timesheets/weekly`

4. **View in MongoDB:**
   ```bash
   docker exec -it timesheet-backend-mongo-1 mongosh timesheet -u admin -p password --eval "db.timesheets.find().pretty()"
   ```

## Common Issues & Solutions

### Services Won't Start
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :27017

# Kill process on port 3000
kill -9 $(lsof -t -i :3000)
```

### CORS Error in Browser
- Ensure backend services are running
- Check VITE_BACKEND_URL in .env.local
- Restart frontend: `npm run dev`

### Can't Connect to Backend
1. Check services health:
   ```bash
   curl http://localhost:3000/save-service/health
   ```
2. Check frontend console (F12)
3. Check backend logs:
   ```bash
   docker-compose logs -f
   ```

### MongoDB Connection Failed
```bash
# Restart containers
docker-compose down
docker-compose up -d
```

## Development Tips

### Frontend Development

**Make changes and they'll hot-reload:**
```bash
# Already running with npm run dev
# Edit src/App.tsx, components, etc.
# Browser updates automatically
```

**View logs in browser console:**
```
F12 → Console tab
Watch for API responses and errors
```

### Backend Development

**View service logs:**
```bash
docker-compose logs -f save-service
docker-compose logs -f submit-service
docker-compose logs -f mongo
```

**Restart services without losing data:**
```bash
docker-compose restart
```

**Clear all data and restart:**
```bash
docker-compose down -v
docker-compose up -d
```

## Next Steps

### Customize the App

1. **Change employee/project IDs:**
   - Edit `src/App.tsx`
   - Look for `DEFAULT_EMPLOYEE_ID`, `DEFAULT_PROJECT_ID`

2. **Add authentication:**
   - See `BACKEND_INTEGRATION.md` → "Adding Authentication"

3. **Customize styling:**
   - Edit components in `src/components/`
   - Tailwind CSS classes are used

### Deploy to Production

1. **Frontend:**
   ```bash
   npm run build
   # Deploy dist/ folder to your hosting
   ```

2. **Backend:**
   - See `Timesheet-backend/README.md`
   - Deploy services to your server
   - Update `VITE_BACKEND_URL` environment variable

## Useful Commands

### Frontend
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Check code quality
```

### Backend
```bash
docker-compose up -d      # Start services
docker-compose down       # Stop services
docker-compose logs -f    # View logs
docker-compose restart    # Restart services
```

### Database
```bash
# Access MongoDB shell
docker exec -it timesheet-backend-mongo-1 mongosh timesheet -u admin -p password

# View collections
show collections

# Query timesheets
db.timesheets.find().pretty()

# Count records
db.timesheets.countDocuments()
```

## Project Structure

```
Timesheet_Fe_ts/
├── src/
│   ├── services/
│   │   └── timesheetAPI.ts        ← API calls to backend
│   ├── components/
│   │   ├── App.tsx                ← Main component
│   │   ├── HoursCell.tsx          ← Editable hours
│   │   └── WFHCell.tsx            ← WFH toggle
│   └── utils/
│       └── weekNavigation.ts       ← Date utilities
├── .env.example                   ← Copy to .env.local
├── BACKEND_INTEGRATION.md         ← Full documentation
└── QUICKSTART.md                  ← This file

Timesheet-backend/
├── save-service/                  ← Save drafts (port 3000)
├── submit-service/                ← Submit timesheets (port 3001)
├── docker-compose.yml             ← Run all services
└── README.md                       ← Backend docs
```

## API Endpoints (for reference)

### Save Service (Port 3000)
```
GET  /save-service/health
GET  /save-service/timesheets?employeeId=EMP001&startDate=2025-10-20&endDate=2025-10-26
GET  /save-service/timesheets/:id
POST /save-service/timesheets
POST /save-service/timesheets/weekly
```

### Submit Service (Port 3001)
```
GET  /submit-service/health
GET  /submit-service/timesheets?employeeId=EMP001&startDate=2025-10-20&endDate=2025-10-26
GET  /submit-service/timesheets/:id
POST /submit-service/timesheets
POST /submit-service/timesheets/weekly
```

## Need Help?

1. Check browser console: **F12 → Console**
2. Check backend logs: `docker-compose logs`
3. Read full docs: `BACKEND_INTEGRATION.md`
4. Test API manually with curl commands from BACKEND_INTEGRATION.md

## License

ISC

---

**Happy timesheeting! 🎉**
