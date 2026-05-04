# Broker-Demo App - README

**Last Updated:** May 2026  
**Status:** Production (Live on Fly.io)  
**Current Version:** 0.1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Local Setup](#local-setup)
5. [Environment Variables](#environment-variables)
6. [Running the App](#running-the-app)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [Features](#features)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contact & Support](#contact--support)

---

## Overview

**Broker-Demo** is a Next.js-based insurance broker website platform designed to showcase how an insurance agent can have a professional, conversion-focused website.

**Current Use Case:** Demo/Proof-of-concept for ClearPath Insurance broker

**Live URL:** https://broker-demo.fly.dev

**Future Plan:** Multi-tenant platform (in progress - see STEP 6 branch)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 14.2.5 |
| **Language** | TypeScript | 5 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Database** | Supabase (PostgreSQL) | Latest |
| **Authentication** | Supabase Auth | Built-in |
| **Deployment** | Fly.io | Latest |
| **Email** | Resend | 3.4.0 |
| **Icons** | Lucide React | 0.400.0 |

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18+ installed ([download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (for cloning repository)
- **Supabase account** ([sign up free](https://app.supabase.com))
- **Fly.io account** ([sign up free](https://fly.io)) - for deployment only
- **VS Code** or any code editor

---

## Local Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_GITHUB/broker-demo.git
cd broker-demo
```

If you don't have the repo yet, create it:

```bash
mkdir broker-demo
cd broker-demo
npx create-next-app@14 . --typescript --tailwind
```

### Step 2: Install Dependencies

```bash
npm install
```

Should output:
```
added 500+ packages in 45s
```

### Step 3: Create Environment File

Create `.env.local` in root directory:

```bash
cat > .env.local << 'EOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxx

# Optional: Anthropic API (for future agents)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
EOF
```

**Get Supabase Keys:**
1. Go to https://app.supabase.com
2. Select your project
3. Settings → API
4. Copy: Project URL, Anon Key, Service Role Key

### Step 4: Set Up Database

```bash
# Create tables in Supabase (if not already created)
# Run migration from supabase/migrations/ or create manually

# Tables needed:
# - leads (quote submissions)
# - agents (broker information)
```

SQL for tables:

```sql
-- Leads table (quote form submissions)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  product_type VARCHAR(100),
  estimate_low DECIMAL,
  estimate_high DECIMAL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Agents table (broker information)
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  npn VARCHAR(20),
  license_number VARCHAR(100),
  e_o_insurance_carrier VARCHAR(255),
  e_o_insurance_policy VARCHAR(100),
  carriers TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 5: Verify Setup

```bash
npm run dev
```

Expected output:
```
> broker-demo@0.1.0 dev
> next dev

  ▲ Next.js 14.2.5
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.3s
```

Open http://localhost:3000 in browser.

You should see the ClearPath Insurance homepage.

---

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGc...` |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `RESEND_API_KEY` | Email service API key | Not set |
| `ANTHROPIC_API_KEY` | Claude API key (future use) | Not set |
| `NEXT_PUBLIC_APP_URL` | App URL for links | `http://localhost:3000` |

---

## Running the App

### Development

```bash
npm run dev
```

Visit: http://localhost:3000

Hot reload enabled - changes reflect instantly.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

---

## Project Structure

```
broker-demo/
├── app/
│   ├── page.tsx                 # Homepage (hardcoded content)
│   ├── quote/
│   │   └── page.tsx             # Quote form page
│   ├── onboarding/
│   │   └── page.tsx             # Agent onboarding form
│   ├── api/
│   │   ├── onboard/route.ts      # Form submission endpoint
│   │   ├── quote/route.ts        # Quote calculation
│   │   ├── auth/route.ts         # Auth endpoint
│   │   └── dashboard/route.ts    # Dashboard data
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer component
│   ├── Card.tsx                 # Reusable card
│   └── Button.tsx               # Reusable button
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── auth.ts                  # Auth functions
│   ├── quote-engine.ts          # Quote calculation logic
│   └── multi-tenant.ts          # Multi-tenant logic (NEW - STEP 6)
├── public/
│   └── favicon.ico              # Favicon
├── supabase/
│   └── migrations/              # Database migrations
├── .env.local                   # Environment variables (NOT in git)
├── .env.example                 # Example env vars
├── package.json                 # Dependencies
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── Dockerfile                   # Docker config (for Fly.io)
├── fly.toml                     # Fly.io config
├── README.md                    # This file
└── .gitignore                   # Git ignore
```

---

## Database Schema

### leads table

```
Column          | Type      | Description
----------------|-----------|------------------
id              | UUID      | Primary key
name            | VARCHAR   | Lead name
email           | VARCHAR   | Lead email
phone           | VARCHAR   | Lead phone
product_type    | VARCHAR   | 'home', 'auto', 'health'
estimate_low    | DECIMAL   | Low estimate
estimate_high   | DECIMAL   | High estimate
status          | VARCHAR   | 'pending', 'contacted', 'converted'
created_at      | TIMESTAMP | Creation timestamp
```

### agents table

```
Column                      | Type      | Description
----------------------------|-----------|------------------
id                          | UUID      | Primary key
first_name                  | VARCHAR   | First name
last_name                   | VARCHAR   | Last name
email                       | VARCHAR   | Email (unique)
phone                       | VARCHAR   | Phone
npn                         | VARCHAR   | NPN license number
license_number              | VARCHAR   | State license
e_o_insurance_carrier       | VARCHAR   | E&O carrier
e_o_insurance_policy        | VARCHAR   | E&O policy number
carriers                    | TEXT[]    | Array of carriers
created_at                  | TIMESTAMP | Creation timestamp
```

### NEW TABLES (STEP 6 - Multi-Tenant)

See STEP6_TEST_MULTITENANT.md for schema details.

---

## Features

### Current (Live)

- ✅ Beautiful, responsive landing page
- ✅ Multi-step quote form
- ✅ Rule-based quote engine
- ✅ Agent onboarding flow
- ✅ Email notifications (Resend)
- ✅ Supabase integration
- ✅ SEO optimized (meta tags, sitemap, robots.txt)
- ✅ Mobile responsive
- ✅ Dark/light mode ready

### In Progress (STEP 6 Branch)

- 🔄 Multi-tenant support (organizations, sites)
- 🔄 Data-driven content (pull from database)
- 🔄 Content ingestion (Agent 1)
- 🔄 Content generation (Agent 2)

### Planned (Future)

- 🎯 AI agents (Agents 3-6)
- 🎯 n8n integrations
- 🎯 Stripe payments
- 🎯 Analytics dashboard
- 🎯 A/B testing

---

## Deployment

### Deploy to Fly.io

```bash
# Install Fly CLI
brew install flyctl  # macOS
# or follow: https://fly.io/docs/getting-started/installing-flyctl/

# Login
fly auth login

# Deploy
fly launch --name broker-demo-prod

# Set environment variables
fly secrets set NEXT_PUBLIC_SUPABASE_URL=https://...
fly secrets set NEXT_PUBLIC_SUPABASE_ANON_KEY=...
fly secrets set SUPABASE_SERVICE_ROLE_KEY=...
fly secrets set RESEND_API_KEY=...

# Deploy again
fly deploy
```

### Deploy to Vercel (Alternative)

```bash
# Push to GitHub
git push origin main

# Go to https://vercel.com
# Connect GitHub repo
# Deploy automatically
```

---

## Common Tasks

### Adding New Pages

```bash
# Create page
mkdir -p app/new-page
cat > app/new-page/page.tsx << 'EOF'
export default function NewPage() {
  return <h1>New Page</h1>;
}
EOF
```

### Modifying Content

**Hardcoded content (current):**
- Edit `app/page.tsx` for homepage
- Edit `app/quote/page.tsx` for quote page
- Edit component files for UI

**Database content (STEP 6):**
- Insert into `content` table in Supabase
- Content pulls automatically via `lib/multi-tenant.ts`

### Testing Forms

```bash
# Quote form submits to: POST /api/onboard
# Data saved to: leads table

# Agent form submits to: POST /api/onboard
# Data saved to: agents table
```

### Checking Database

```bash
# Supabase Studio (Web UI)
https://app.supabase.com → Your Project → Table Editor

# Via CLI
supabase db list
supabase db query "SELECT * FROM leads LIMIT 10"
```

---

## Troubleshooting

### Issue: "Cannot find module @supabase/supabase-js"

**Fix:**
```bash
npm install @supabase/supabase-js
npm run dev
```

### Issue: "Failed to load resource: 406" (Supabase error)

**Cause:** Missing .env.local or incorrect keys

**Fix:**
1. Verify .env.local exists in root
2. Check keys are correct:
   ```bash
   cat .env.local | grep SUPABASE
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

### Issue: Quote form doesn't save data

**Cause:** Supabase credentials wrong or `leads` table doesn't exist

**Fix:**
1. Check Supabase connection: https://app.supabase.com → Health
2. Verify `leads` table exists: Table Editor
3. Check API keys have correct permissions

### Issue: Quotes showing "$0 - $0"

**Cause:** Quote engine logic issue

**Fix:** Check `lib/quote-engine.ts` - update rules as needed

### Issue: Emails not sending

**Cause:** Resend API key missing or invalid

**Fix:**
1. Get API key: https://resend.com → API Keys
2. Add to .env.local:
   ```
   RESEND_API_KEY=re_xxxxx
   ```
3. Restart dev server

### Issue: Port 3000 already in use

**Fix:**
```bash
# Use different port
npm run dev -- -p 3001
# or kill process on 3000
lsof -i :3000
kill -9 <PID>
```

---

## Git Workflow

### Branches

```
main
├── production-ready code
│
└── feature/multi-tenant-sme-platform (STEP 6)
    ├── Multi-tenant schema
    ├── Data-driven content
    └── Agent 1 integration
```

### Committing Changes

```bash
# Add files
git add .

# Commit
git commit -m "Description of changes"

# Push
git push origin branch-name

# Create PR for code review
```

---

## Performance

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

Check locally:
```bash
# In Chrome DevTools: Lighthouse tab
# or use: npm run lighthouse
```

### Optimization Tips

- ✅ Images: Use next/image for optimization
- ✅ CSS: Tailwind purges unused classes
- ✅ JS: Code splitting via dynamic imports
- ✅ API: Cache Supabase queries with React Query
- ✅ CDN: Fly.io distributes globally

---

## Security

### Never Commit

```bash
# Add to .gitignore
.env.local
.env.*.local
.DS_Store
node_modules/
.next/
```

### API Key Rotation

Every 90 days:
1. Go to Supabase Settings → API
2. Regenerate keys
3. Update .env.local and Fly.io secrets
4. Restart app

### RLS (Row Level Security)

For production, enable RLS on all tables:

```sql
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Add policies as needed
CREATE POLICY "Allow all" ON leads FOR ALL USING (true);
```

---

## Monitoring

### Logs

```bash
# Local dev
npm run dev
# Check terminal output

# Fly.io production
fly logs
```

### Errors

Check:
1. Browser console (DevTools F12)
2. Network tab (failed requests)
3. Supabase Studio (database issues)
4. Fly.io logs: `fly logs`

---

## Contact & Support

**Current Maintainer:** [Your Name]  
**Offshore Team Lead:** [Offshore Contact]  
**Project Manager:** [PM Name]

### Important Links

- **GitHub:** https://github.com/YOUR_GITHUB/broker-demo
- **Live App:** https://broker-demo.fly.dev
- **Supabase:** https://app.supabase.com
- **Fly.io:** https://fly.io/apps
- **Documentation:** See docs/ folder

### Escalation Path

1. **Dev Issue:** Check troubleshooting section
2. **Database Issue:** Contact Supabase support
3. **Deployment Issue:** Contact Fly.io support
4. **Product Issue:** Contact [PM Name]

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1.0 | May 2026 | Initial release - demo/MVP |
| (pending) | TBD | Multi-tenant STEP 6 merge |
| (pending) | TBD | Agents integration |

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fly.io Documentation](https://fly.io/docs/)

---

**Last Updated:** May 3, 2026  
**For Questions:** Contact maintainer listed above
