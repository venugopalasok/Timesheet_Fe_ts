# Timesheet Application - Frontend

A modern, responsive timesheet management application built with React, TypeScript, and Vite. This application allows users to track billable and non-billable hours, manage work-from-home status, and submit timesheets for approval.

## ✨ Features

- 📅 **Weekly Timesheet View** - Interactive grid for tracking daily hours
- ⏰ **Billable & Non-Billable Hours** - Separate tracking for different work types
- 🏠 **WFH Status** - Toggle work-from-home status per day
- 💾 **Save & Submit** - Save drafts or submit for approval
- 🔐 **Authentication** - User login and registration with JWT
- 📱 **PWA Support** - Progressive Web App capabilities
- 🎨 **Modern UI** - Built with Tailwind CSS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend services running (see [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md))

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Timesheet_Fe_ts
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp env.template .env.local
# Edit .env.local with your backend URLs
```

4. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## 🌐 Deployment

### Deploy to AWS Amplify
For AWS Amplify deployment, see:
- **Quick Start**: [AWS_AMPLIFY_QUICKSTART.md](AWS_AMPLIFY_QUICKSTART.md) - 5-minute setup guide
- **Detailed Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive deployment instructions

### Environment Variables

Set these in your deployment platform (AWS Amplify, Vercel, Netlify, etc.):

```
VITE_BACKEND_URL=https://your-backend-url.com
VITE_AUTH_SERVICE_URL=https://your-auth-url.com
```

## 🔧 Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **PWA** - Progressive Web App support

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DateCell.tsx    # Date display component
│   ├── DayCell.tsx     # Day name component
│   ├── HoursCell.tsx   # Editable hours input
│   ├── WFHCell.tsx     # Work-from-home toggle
│   └── Header.tsx      # App header
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── Grid.tsx        # Main timesheet grid
│   ├── SignIn.tsx      # Login page
│   └── SignUp.tsx      # Registration page
├── services/           # API service layers
│   ├── authAPI.ts      # Authentication API calls
│   └── timesheetAPI.ts # Timesheet API calls
├── utils/              # Utility functions
│   └── weekNavigation.ts # Week navigation helpers
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## 🔌 Backend Integration

This frontend connects to three backend microservices:

1. **Auth Service** (Port 3002)
   - User authentication
   - Registration and login
   - Profile management

2. **Save Service** (Port 3000)
   - Save draft timesheets
   - Retrieve saved records

3. **Submit Service** (Port 3001)
   - Submit timesheets for approval
   - Retrieve submitted records

See [BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md) for detailed API documentation.

## 🔑 How Frontend Finds Backend

The frontend uses environment variables to locate backend services:

```typescript
// In src/services/timesheetAPI.ts
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// In src/services/authAPI.ts
const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3002';
```

### API Endpoints

**Authentication:**
- `POST ${VITE_AUTH_SERVICE_URL}/auth-service/register`
- `POST ${VITE_AUTH_SERVICE_URL}/auth-service/login`
- `GET ${VITE_AUTH_SERVICE_URL}/auth-service/profile`

**Timesheet Operations:**
- `POST ${VITE_BACKEND_URL}/save-service/timesheets`
- `POST ${VITE_BACKEND_URL}/submit-service/timesheets`
- `GET ${VITE_BACKEND_URL}/save-service/timesheets`

## 📚 Documentation

- **[AWS_AMPLIFY_QUICKSTART.md](AWS_AMPLIFY_QUICKSTART.md)** - Quick deployment guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Comprehensive deployment instructions
- **[API_GATEWAY_SETUP.md](API_GATEWAY_SETUP.md)** - API Gateway configuration guide
- **[BACKEND_INTEGRATION.md](BACKEND_INTEGRATION.md)** - Backend API integration guide
- **[START_HERE.md](START_HERE.md)** - Getting started guide
- **[env.template](env.template)** - Environment variables template

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
