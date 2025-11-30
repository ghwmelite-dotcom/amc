# AMC Hospital Dashboard

A world-class, premium hospital management dashboard for **Accra Medical Centre** - Ghana's leading healthcare facility.

![AMC Dashboard](https://img.shields.io/badge/AMC-Dashboard-00D4AA?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=for-the-badge&logo=tailwindcss)

## About Accra Medical Centre

- **Founded**: November 22, 2011 (Opened February 2012)
- **Location**: 6 Angola Close, Ringway, Osu, Accra
- **Staff**: 200-219 medical professionals
- **Patients**: ~90,000 annually (Target: 120,000)
- **CEO**: Dr. Cynthia Opoku-Akoto
- **Operating Hours**: 24/7, including holidays

## Features

### Dashboard Pages
- **Dashboard** - Real-time hospital statistics, coverage metrics, and alerts
- **Schedule** - Interactive calendar with shift management
- **Staff** - Staff directory with search, filters, and modals
- **Departments** - 12+ clinical departments with live stats
- **Leave** - Leave request management system
- **Reports** - Analytics with multiple chart types
- **Patients** - Patient queue and appointment management
- **Emergency** - Critical care dashboard with ICU status
- **Settings** - User preferences and system configuration

### Premium UI Features
- Ultra-dark premium theme with glassmorphism
- Interactive 3D card effects with glare
- Particle system background
- Morphing blob animations
- Sound effects on interactions
- Animated charts and statistics
- Real-time clock and notifications

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI Framework |
| TypeScript | 5.2+ | Type Safety |
| Vite | 5.0+ | Build Tool |
| Tailwind CSS | 3.3+ | Styling |
| React Router | 6.20+ | Routing |
| Zustand | 4.4+ | State Management |
| Lucide React | 0.294+ | Icons |
| date-fns | 2.30+ | Date Formatting |

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ghwmelite-dotcom/amc.git

# Navigate to project directory
cd amc

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## Deployment

### Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main

## Project Structure

```
amc/
├── src/
│   ├── components/
│   │   ├── common/      # Reusable UI components
│   │   ├── charts/      # Chart components
│   │   ├── effects/     # Visual effects
│   │   └── layout/      # Layout components
│   ├── pages/           # Page components
│   ├── hooks/           # Custom hooks
│   ├── stores/          # Zustand stores
│   ├── data/            # Mock data
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── styles/          # Global styles
├── public/              # Static assets
└── ...config files
```

## Clinical Departments

1. General Medicine / Family Practice
2. Internal Medicine
3. Paediatrics
4. Gynaecology / Obstetrics / Maternity
5. ENT (Ear, Nose, Throat)
6. Ophthalmology
7. Nephrology
8. Rheumatology
9. Urology
10. Plastic Surgery
11. Psychology & Psychiatry
12. Gastroenterology

## Support Services

- Laboratory Services
- Pharmacy Services
- Medical Diagnostics (CT, MRI, Ultrasound, Mammogram, X-ray)
- Emergency Services (24/7)
- Ambulance Services
- ICU/HDU
- Inpatient Services
- Ambulatory Surgical Services
- Dietetics/Nutrition
- Occupational Health & Wellness

## License

This project is proprietary software for Accra Medical Centre.

---

**Accra Medical Centre** - *Excellence in Healthcare*

Built with React, TypeScript, and Tailwind CSS.
