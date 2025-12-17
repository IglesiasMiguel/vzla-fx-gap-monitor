# Vzla FX Gap Monitor

A React Native + Cloudflare Worker app to monitor the Venezuela Exchange Rate Gap (BCV vs Binance P2P) via Native Android Widgets.

## 🏗️ Architecture

This is a **monorepo** using npm workspaces with two main components:

- **`backend/`**: Cloudflare Worker that performs **compute-only** operations (gap calculations, purchasing power, recommendations). It does NOT fetch external APIs to avoid IP blocking.
- **`mobile/`**: Expo React Native app that:
  - Fetches BCV rates directly from `https://bcv-api.rafnixg.dev/rates/`
  - Fetches Binance P2P rates directly from Binance API
  - Sends both rates to the Worker for computation
  - Displays results in the app and syncs data to the native Android widget

### Data Flow

```
Mobile App → BCV API (direct)
          → Binance P2P API (direct)
          → Cloudflare Worker (POST /api/compute) → Returns calculated metrics
          → AsyncStorage (for widget access)
```

### Data Refresh Policy

- **Automatic refresh**: Every 30 minutes while the app is in foreground
- **Manual refresh**: Pull-to-refresh gesture in the app
- **Widget**: Only displays cached data from AsyncStorage (no network requests)
- **No aggressive retries**: Prevents Binance API rate limiting

## 📁 Project Structure

```
.
├── .github/
│   └── workflows/        # CI/CD workflows
│       ├── ci.yml        # Lint + typecheck on PRs and main
│       ├── deploy-worker.yml  # Auto-deploy Worker on backend changes
│       └── eas-preview.yml    # Manual EAS build trigger
├── backend/              # Cloudflare Worker (compute-only API)
│   ├── src/
│   │   └── index.ts      # Worker entry point
│   ├── wrangler.toml     # Cloudflare configuration
│   └── package.json
├── mobile/               # Expo React Native App
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # React Query hooks
│   │   ├── services/     # API services
│   │   ├── utils/        # Storage utilities
│   │   └── widgets/      # Android widget code
│   ├── app.json          # Expo configuration
│   ├── eas.json          # EAS build profiles
│   └── package.json
└── package.json          # Root workspace configuration
```

## ✨ Features

- Real-time BCV and Binance P2P rate monitoring
- Android Home Screen Widget (native widget)
- Dark Mode / Light Mode support (automatic system detection)
- Minimalist, professional UI
- Automatic data caching with 30-minute refresh policy
- Graceful error handling with cached data fallback
- Widget preview component in-app (for design iteration)

## 🚀 Setup

### Prerequisites

- **Node.js 20+**
- **npm** (comes with Node.js)
- **Expo Go app** (for testing on Android)
- **Cloudflare account** (for backend deployment)
- **Expo account** (for EAS builds)

### Installation

1. **Clone the repository** (if not already done)

2. **Install all dependencies** (from root):

```bash
npm install
```

This will install dependencies for both `backend/` and `mobile/` workspaces automatically.

## 💻 Development

### Backend (Cloudflare Worker)

The Worker is a **compute-only** endpoint. It receives BCV and Binance rates from the mobile app and returns calculated metrics.

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Start development server:**

```bash
npm run dev
```

3. **Deploy to Cloudflare:**

```bash
npm run deploy
```

**Note:** After deploying, the Worker URL is already configured in `mobile/src/services/api.ts`. If you change the Worker name or account, update the `WORKER_BASE_URL` constant.

### Mobile App

1. **Navigate to mobile directory:**

```bash
cd mobile
```

2. **Start Expo development server:**

```bash
npm start
# or from root: npm start --workspace=mobile
```

3. **Scan QR code** with Expo Go app (Android)

**Important Notes:**

- **Widgets cannot be tested in Expo Go**. You need to build an APK to test the widget functionality.
- Use the **Widget Preview** component in the app to see how the widget will look.
- The app displays cached data immediately on startup for instant UI feedback.

## 📦 Building APK

### Prerequisites

1. **Install EAS CLI globally:**

```bash
npm install -g eas-cli
```

2. **Login to Expo:**

```bash
eas login
```

3. **Configure EAS** (if not already done):

```bash
cd mobile
eas build:configure
```

### Build Options

#### Option 1: Local Build (via GitHub Actions)

1. Go to your GitHub repository → **Actions** tab
2. Select **"EAS Preview (Android APK)"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for the build to complete (check EAS dashboard)
5. Download the APK from Expo dashboard

#### Option 2: Local Build (via CLI)

```bash
cd mobile
eas build -p android --profile preview
```

**Build Profiles:**

- `preview`: APK for testing (no Play Store)
- `production`: APK for distribution (if needed)

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration and deployment.

### Workflows

1. **CI** (`.github/workflows/ci.yml`)
   - Runs on: Pull Requests and pushes to `main`
   - Executes: Lint + TypeScript type checking
   - Purpose: Ensure code quality before merging

2. **Deploy Worker** (`.github/workflows/deploy-worker.yml`)
   - Runs on: Push to `main` when `backend/` changes
   - Executes: Deploys Cloudflare Worker automatically
   - Purpose: Keep Worker in sync with backend code

3. **EAS Preview** (`.github/workflows/eas-preview.yml`)
   - Runs on: Manual trigger only (`workflow_dispatch`)
   - Executes: Creates Android APK via EAS Build
   - Purpose: Generate preview builds on-demand (saves monthly build quota)

### Required GitHub Secrets

Configure these in **Settings → Secrets and variables → Actions**:

- `EXPO_TOKEN`: Your Expo access token (from expo.dev → Account Settings → Access Tokens)
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Workers deploy permissions

### Testing PRs

**⚠️ QR Code in PRs:** It's **not possible** to generate an automatic QR code in GitHub Actions for Expo Go because:

- Expo Go requires a running Metro bundler server
- CI environments are ephemeral and can't host long-running servers

**Alternatives for PR testing:**

1. **Test locally**: Clone the PR branch and run `npm start` in `mobile/`
2. **Manual EAS build**: Trigger the EAS Preview workflow manually (consumes 1 of 30 monthly builds)

## 🛠️ Code Quality

This project uses:

- **Husky**: Git hooks automation
- **Prettier**: Code formatting
- **ESLint**: Linting with TypeScript and React rules
- **TypeScript**: Strict type checking

### Git Hooks

- **Pre-commit**: Automatically formats and lints staged files
- **Pre-push**: Runs TypeScript type checking (`npx tsc --noEmit`)

### Manual Commands

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📱 Widget Configuration

The Android widget is configured in `mobile/app.json`:

- **Name**: GapWidget
- **Label**: Vzla FX Monitor
- **Update Period**: 30 minutes (1800000ms)
- **Min Size**: 320dp × 120dp

The widget reads data from AsyncStorage (populated by the main app) and displays:

- BCV rate
- Binance rate
- Gap percentage (with color coding: green < 60%, yellow 60-90%, red > 90%)

## 🔧 Technology Stack

- **Frontend**: React Native (Expo SDK ~54), TypeScript, NativeWind v4, React Query
- **Backend**: Cloudflare Workers, TypeScript
- **Widget**: `react-native-android-widget`
- **Build**: EAS Build (Expo Application Services)
- **CI/CD**: GitHub Actions

## 📝 Development Workflow

1. **Create a feature branch:**

```bash
git checkout -b feature/my-feature
```

2. **Make changes and commit:**

```bash
# Hooks will auto-format and lint
git add .
git commit -m "feat: add new feature"
```

3. **Push and create PR:**

```bash
git push origin feature/my-feature
```

4. **CI will run automatically** on the PR

5. **After PR is merged to `main`:**
   - CI runs again
   - If `backend/` changed, Worker auto-deploys
   - You can manually trigger EAS Preview if needed

## 🐛 Troubleshooting

### Metro bundler port already in use

```bash
# Windows PowerShell
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

### Clear Expo cache

```bash
cd mobile
npx expo start --clear
```

### Widget not updating

- Ensure the app has fetched data at least once
- Check AsyncStorage permissions
- Rebuild APK if widget code changed

## 📄 License

Private project - Personal use only
