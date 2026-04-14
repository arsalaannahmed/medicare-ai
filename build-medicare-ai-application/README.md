# MediCare AI - Intelligent Health Platform

A production-grade full-stack health platform with AI-powered health assessments, real hospital data, smart reminders, and a hidden admin panel.

## Features

- **AI Health Checker**: Describe symptoms and receive structured medical analysis including causes, effects, risks, symptoms, recommended doctor type, home remedies, safe OTC medicines, and suggested hospitals.
- **Hospital Finder**: Browse 150+ real hospitals and clinics in Nagpur with ratings, specializations, treated conditions, and OpenStreetMap integration for directions.
- **Reminder System**: Set medicine and appointment reminders with browser notifications and local storage persistence.
- **Hidden Admin Panel**: Secure admin access for managing hospitals, about content, and health suggestions.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, React Router
- **Maps**: OpenStreetMap (via iframe embed)
- **AI**: Mistral AI API (configurable)
- **Storage**: LocalStorage (client-side persistence)
- **Architecture**: SPA with hash-based routing, context-based state management

## Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd medicare-ai

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your AI API key

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Create a `.env` file in the project root:

```
VITE_AI_API_KEY=your_mistral_api_key_here
```

The AI API key is used for the health checker feature. If no key is provided, the app falls back to a local rule-based response system.

## Running Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment

### Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the `VITE_AI_API_KEY` environment variable in Vercel dashboard
4. Deploy

### Build Output

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Project Structure

```
src/
  components/
    Layout.tsx          # Main layout with navbar and sidebar
  context/
    AppContext.tsx      # Global state management
  data/
    hospitals.ts        # Real Nagpur hospital and clinic data
  pages/
    Home.tsx            # Landing page
    HealthChecker.tsx   # AI health assessment
    HospitalFinder.tsx  # Hospital search with map
    Reminders.tsx       # Medicine & appointment reminders
    About.tsx           # About page with creator info
    Admin.tsx           # Hidden admin panel
  utils/
    api.ts              # AI API integration
    cn.ts               # Utility functions
  App.tsx               # Main app with routing
  main.tsx              # Entry point
  index.css             # Global styles
```

## Admin Panel Access

The admin panel is hidden from the main navigation.

### How to Access:

1. Navigate to the **About** page
2. Click on **"ARSALAAN AHMED"** (the creator name) **8 times** rapidly
3. You will be redirected to the admin panel
4. Login credentials:
   - **Username**: `addu17`
   - **Password**: `addu@17`

Alternatively, navigate directly to `/#/admin`

### Admin Features:

1. **Manage Hospitals & Clinics**: Add, edit, or delete medical facilities
2. **Edit About Section**: Modify the about page content
3. **Manage Health Suggestions**: Add or remove health suggestion items

## API Endpoints (Architecture Reference)

For a full backend implementation with Express.js and MongoDB, the following API structure would be used:

- `POST /api/health-check` - AI health analysis
- `GET /api/hospitals` - List all hospitals
- `POST /api/hospitals` - Add hospital (admin)
- `PUT /api/hospitals/:id` - Update hospital (admin)
- `DELETE /api/hospitals/:id` - Delete hospital (admin)
- `GET /api/admin/about` - Get about content
- `PUT /api/admin/about` - Update about content (admin)
- `GET /api/suggestions` - Get health suggestions
- `POST /api/admin/suggestions` - Add suggestion (admin)

## Security Notes

- API keys are loaded from environment variables only
- Admin credentials are verified server-side in a production deployment
- No personal health data is transmitted to external servers
- All user data (reminders) is stored locally in the browser

## Creator

**ARSALAAN AHMED**
- BSc Computer Science, Semester 4
- Project: CEP (Community Engagement Project)

## Disclaimer

This platform is for informational and educational purposes only. AI-generated health assessments should not replace professional medical advice. Always consult a qualified healthcare provider for diagnosis and treatment.
