# dayLink - Meeting Scheduler

![dayLink Banner](https://img.shields.io/badge/Privacy-First-green) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A privacy-first meeting scheduler that runs entirely in your browser. No servers, no tracking, no compromises.

## Features

### Privacy First
- **100% Local Storage** - All data stays in your browser
- **AES-256 Encryption** - Military-grade encryption for your data
- **No Backend Required** - Zero servers, zero tracking
- **Unique Phrase Authentication** - No email or password needed

### Meeting Management
- **Multi-Platform Support** - Google Meet, Microsoft Teams, Zoom, and custom links
- **Recurring Meetings** - Daily, weekdays, weekends, or custom schedules
- **Drag & Drop Reordering** - Organize meetings your way
- **Quick Templates** - Create meetings from saved templates

### Modern UI
- **Dark Mode Default** - Easy on the eyes with optional light mode
- **Animated Transitions** - Smooth Framer Motion animations
- **Responsive Design** - Works on desktop and mobile
- **Calendar View** - Visual overview with meeting indicators

### Smart Features
- **Browser Notifications** - Get reminded before meetings
- **One-Click Join** - Join meetings instantly
- **Export/Import Backup** - Easily move between devices
- **Offline Ready** - Works without internet connection

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
dayLink/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Landing page with onboarding
│   ├── dashboard/          # Dashboard pages
│   └── globals.css         # Global styles & theme
├── components/
│   ├── auth/               # Login, Onboarding components
│   ├── dashboard/          # Header, Greeting, QuickActions
│   ├── landing/            # Hero, Features, HowItWorks
│   ├── meetings/           # MeetingForm, MeetingList, Calendar
│   ├── shared/             # ThemeToggle, Footer, EmptyState
│   └── ui/                 # Shadcn/UI components
├── hooks/                  # Custom React hooks
│   ├── use-auth.tsx        # Authentication context
│   ├── use-meetings.ts     # Meeting CRUD operations
│   ├── use-theme.ts        # Theme management
│   └── use-notifications.ts # Browser notifications
├── lib/                    # Utility libraries
│   ├── encryption.ts       # AES-256 encryption
│   ├── storage.ts          # LocalStorage wrapper
│   ├── meeting-utils.ts    # Meeting helpers
│   └── notifications.ts    # Notification scheduling
├── types/                  # TypeScript definitions
│   └── index.ts            # All type interfaces
└── constants/              # App constants
    └── templates.ts        # Default meeting templates
```

## How Authentication Works

dayLink uses a unique **phrase-based authentication** system:

1. **Generate Phrase** - A unique XXXXX-XXXXX format phrase is generated
2. **Save Phrase** - This is your "password" - keep it safe!
3. **Login Anytime** - Enter your phrase on any device to access your data

Your phrase is used to encrypt/decrypt your data using AES-256 encryption.

## Tech Stack

- **Framework**: Next.js 15 with App Router & Turbopack
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with CSS variables
- **Animations**: Framer Motion 12
- **UI Components**: Radix UI + Shadcn/UI
- **Drag & Drop**: @dnd-kit
- **Encryption**: crypto-js (AES-256)
- **Date Handling**: date-fns 4
- **Notifications**: react-hot-toast

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Data Backup

### Export Backup
1. Click your username in the header
2. Select "Export Backup"
3. Save the JSON file securely

### Import Backup
1. Click "I Have an Account" on landing page
2. Click "Import Backup"
3. Select your backup file

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) for details.
