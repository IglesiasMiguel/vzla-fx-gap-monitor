# Vzla FX Gap Monitor

A React Native + Cloudflare Worker app to monitor the Venezuela Exchange Rate Gap (BCV vs Binance P2P) via Native Android Widgets.

## 🎯 What It Does

This application helps you monitor the exchange rate gap between the official Venezuelan Central Bank (BCV) rate and the parallel market rate (Binance P2P). It provides real-time data, intelligent recommendations, and native Android widgets for quick access to exchange rate information.

### Key Metrics

- **Purchasing Power**: Shows what percentage of purchasing power you have with the official dollar (BCV) compared to the parallel market (Binance). Formula: `(BCV / Binance) × 100`
- **Gap Spread**: Shows how much more expensive the parallel market is compared to the official rate. Formula: `((Binance - BCV) / BCV) × 100`
- **Smart Recommendations**: Automatically suggests `BUY_BCV`, `NEUTRAL`, or `SELL_USDT` based on current market conditions

## 🏗️ Architecture

This is a **monorepo** using npm workspaces with two main components:

- **`backend/`**: Cloudflare Worker that performs **compute-only** operations (gap calculations, purchasing power, recommendations). It does NOT fetch external APIs to avoid IP blocking.
- **`mobile/`**: Expo React Native app that:
  - Fetches BCV rates directly from `https://bcv-api.rafnixg.dev/rates/`
  - Fetches Binance P2P rates directly from Binance API (filters by PagoMovil payment method, calculates based on 25 USD equivalent)
  - Sends both rates to the Worker for computation
  - Displays results in the app with bilingual support (ES/EN)
  - Syncs data to native Android widgets via AsyncStorage

### Data Flow

```
Mobile App → BCV API (direct)
          → Binance P2P API (direct, filtered by PagoMovil, 25 USD equivalent)
          → Cloudflare Worker (POST /api/compute) → Returns calculated metrics
          → AsyncStorage (for widget access)
          → React Query cache (30-minute refresh policy)
```

### Data Refresh Policy

- **Automatic refresh**: Every 30 minutes while the app is in foreground
- **Manual refresh**: Pull-to-refresh gesture in the app
- **Widgets**: Only display cached data from AsyncStorage (no network requests)
- **No aggressive retries**: Prevents Binance API rate limiting
- **Smart caching**: App displays cached data immediately on startup for instant UI feedback

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
│   │   ├── components/   # UI components (Dashboard, RateCard, GapIndicator, etc.)
│   │   ├── hooks/        # React Query hooks, language hooks
│   │   ├── services/     # API services (BCV, Binance, Worker)
│   │   ├── utils/        # Storage utilities (AsyncStorage)
│   │   ├── widgets/      # Android widget code (GapWidget, PurchasingPowerWidget)
│   │   └── types/        # TypeScript type definitions
│   ├── app.json          # Expo configuration
│   ├── eas.json          # EAS build profiles
│   └── package.json
└── package.json          # Root workspace configuration
```

## ✨ Features

### Core Functionality

- **Real-time BCV and Binance P2P rate monitoring**
- **Dual display modes**: Switch between Purchasing Power and Gap Spread views
- **Smart recommendations**: Automatic suggestions based on market conditions
- **Color-coded indicators**:
  - Green (< 60% purchasing power): Good opportunity to buy official dollar
  - Yellow (60-90%): Neutral situation, monitor the market
  - Red (> 90%): Rates converging, less opportunity

### User Experience

- **Bilingual support**: Spanish (ES) and English (EN) with in-app language switcher
- **Dark Mode / Light Mode**: Automatic system detection with manual override
- **Integrated documentation**: Built-in help screen explaining concepts, formulas, and use cases
- **Widget preview**: See how widgets will look before adding them to your home screen
- **Pull-to-refresh**: Manual data refresh with visual feedback
- **Graceful error handling**: Shows cached data when network requests fail
- **Minimalist, professional UI**: Clean design with NativeWind (Tailwind CSS for React Native)

### Android Widgets

- **GapWidget (4x1)**: Displays BCV rate, Binance rate, and Gap percentage
- **PurchasingPowerWidget (2x1)**: Compact widget showing only purchasing power percentage
- **Auto-update**: Widgets refresh every 30 minutes
- **Offline support**: Widgets read from cached data (no network requests)

## 🚀 Setup

### Prerequisites

- **Node.js 20+**
- **npm** (comes with Node.js)
- **Expo Go app** (for testing on Android, widgets require APK build)
- **Cloudflare account** (for backend deployment)
- **Expo account** (for EAS builds, optional if using local builds)

### Installation

1. **Clone the repository** (if not already done)

2. **Install all dependencies** (from root):

```bash
npm install
```

This will install dependencies for both `backend/` and `mobile/` workspaces automatically.

## 💻 Development

### Backend (Cloudflare Worker)

The Worker is a **compute-only** endpoint. It receives BCV and Binance rates from the mobile app and returns calculated metrics (gap spread, purchasing power, recommendations).

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
- Use the **Widget Preview** component in the app to see how the widgets will look.
- The app displays cached data immediately on startup for instant UI feedback.
- Language preference and display mode are persisted across app restarts.

## 📦 Building APK

### Prerequisites

#### Option A: EAS Build (Cloud-based)

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

#### Option B: Local Build (Recommended for frequent testing)

1. **Install Android Studio** with Android SDK
2. **Set up environment variables** (ANDROID_HOME, JAVA_HOME)
3. **Generate native folders:**

```bash
cd mobile
npx expo prebuild --platform android
```

This generates the `android/` folder (already ignored by `.gitignore`).

### Build Options

#### Option 1: EAS Build (via GitHub Actions)

1. Go to your GitHub repository → **Actions** tab
2. Select **"EAS Preview (Android APK)"** workflow
3. Click **"Run workflow"** → **"Run workflow"**
4. Wait for the build to complete (check EAS dashboard)
5. Download the APK from Expo dashboard

**Note:** EAS Build has a free tier limit of 30 builds per month.

#### Option 2: EAS Build (via CLI)

```bash
cd mobile
eas build -p android --profile preview
```

**Build Profiles:**

- `preview`: APK for testing (no Play Store)
- `production`: APK for distribution (if needed)

#### Option 3: Local Build (Fastest, No Limits)

After running `npx expo prebuild --platform android`:

**Option A - Using Gradle directly:**

```bash
cd mobile/android
./gradlew assembleDebug
# APK will be in: android/app/build/outputs/apk/debug/app-debug.apk
```

**Option B - Using Android Studio:**

```bash
cd mobile
npx expo run:android
# This opens Android Studio automatically and builds the APK
```

Or manually:

1. Open Android Studio
2. File → Open → Select `mobile/android/` folder
3. Build → Build Bundle(s) / APK(s) → Build APK(s)

**Advantages of Local Build:**

- ✅ No build queue waiting
- ✅ Unlimited builds
- ✅ Faster iteration for widget testing
- ✅ Full debugging capabilities

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
3. **Local build**: Use `npx expo prebuild` + Android Studio for unlimited testing

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

The Android widgets are configured in `mobile/app.json`:

### GapWidget (4x1)

- **Name**: `GapWidget`
- **Label**: "Vzla FX Monitor"
- **Update Period**: 30 minutes (1800000ms)
- **Min Size**: 320dp × 120dp (4x1 grid cells)

**Displays:**

- BCV rate (left)
- Binance rate (center)
- Gap percentage (right, color-coded)

### PurchasingPowerWidget (2x1)

- **Name**: `PurchasingPowerWidget`
- **Label**: "Vzla FX - Purchasing Power"
- **Update Period**: 30 minutes (1800000ms)
- **Min Size**: 160dp × 120dp (2x1 grid cells)

**Displays:**

- Purchasing Power percentage (large, centered, color-coded)

### Widget Behavior

- **Data Source**: Both widgets read from AsyncStorage (populated by the main app)
- **No Network Requests**: Widgets never make API calls, only display cached data
- **Color Coding**:
  - Green: < 60% purchasing power (good opportunity)
  - Yellow: 60-90% (neutral)
  - Red: > 90% (rates converging)
- **Update Frequency**: Widgets auto-update every 30 minutes via Android's update mechanism

## 🔧 Technology Stack

- **Frontend**:
  - React Native (Expo SDK ~54)
  - TypeScript
  - NativeWind v4 (Tailwind CSS for React Native)
  - React Query (@tanstack/react-query) for data fetching and caching
  - React Native Android Widget for native widgets

- **Backend**:
  - Cloudflare Workers
  - TypeScript

- **Build**:
  - EAS Build (Expo Application Services) - Cloud-based
  - Expo Prebuild + Android Studio - Local builds

- **CI/CD**:
  - GitHub Actions

- **Storage**:
  - AsyncStorage for local data persistence
  - React Query cache for in-memory data

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

- Ensure the app has fetched data at least once (widgets read from AsyncStorage)
- Check AsyncStorage permissions
- Rebuild APK if widget code changed
- Wait up to 30 minutes for automatic widget update, or manually refresh the widget

### Prebuild issues

If `npx expo prebuild` fails:

```bash
# Clean and retry
cd mobile
rm -rf android ios  # or just android/ if only building Android
npx expo prebuild --platform android --clean
```

### Android Studio build errors

- Ensure Android SDK is properly installed
- Check that `ANDROID_HOME` environment variable is set
- Verify Java/JDK is installed and `JAVA_HOME` is set
- Sync Gradle files: File → Sync Project with Gradle Files

## 📄 License

Private project - Personal use only
