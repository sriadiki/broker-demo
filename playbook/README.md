# broker-demo — Path B playbook (10-day path to first paying customer)

This folder is your executable plan. Path B = shared multi-tenant: one Fly app + one Supabase project, all customers separated by `broker_id` + RLS. Customer #2 in 2 months becomes a single API call.

## How to use this folder

1. **Read** `../Broker_Demo_Assessment_and_10_Day_Plan.docx` first if you haven't (it's the overall context — wedge analysis, what's broken, what each day delivers, EZLynx realities).
2. **Day 1 today:** open `day1/RUN.md` and work top-to-bottom. Estimated 4–6 hours.
3. **Day 2 same day or tomorrow:** open `day2/RUN.md`. Estimated 5–7 hours. Should not start until day 1 is fully deployed.
4. **Days 3–10:** open `days_3_to_10.md`. Each day has tasks, code sketches, and a "done when" checklist. Code files for these days depend on customer-specific decisions (their brand, their domain, etc.) — sketches are deliberately editable rather than drop-in.

## Folder layout

```
playbook/
├── README.md                       (this file)
├── days_3_to_10.md                 days 3–10 plan with code sketches
├── day1/
│   ├── RUN.md                      step-by-step day 1
│   ├── cleanup.sh                  removes .DS_Store, *.old, etc.
│   ├── deploy.sh                   sets fly secrets + fly deploy
│   └── files/                      drop-in replacements / new files
│       ├── lib/
│       │   ├── session.ts          (NEW) signed-JWT session helpers
│       │   ├── auth-guard.ts       (NEW) requireUser / requireRole
│       │   └── auth.ts             (REPLACE) demo creds gated
│       ├── app/
│       │   ├── api/auth/route.ts   (REPLACE) signed JWT login
│       │   ├── api/dashboard/route.ts (REPLACE) verifies session
│       │   └── login/page.tsx      (REPLACE) demo panel gated
│       ├── .gitignore              (REPLACE) DS_Store, *.old, env
│       ├── .env.example            (NEW)
│       └── fly.toml                (REPLACE) secrets out of build args
└── day2/
    ├── RUN.md                      step-by-step day 2
    ├── smoke-test.sh               5 curl checks against deployed app
    └── files/
        ├── supabase/migrations/0001_brokers_multitenancy.sql
        │                            (NEW) brokers table + RLS + queue
        ├── lib/
        │   ├── session.ts          (REPLACE day 1's) Supabase-compatible JWT w/ broker_id
        │   ├── auth.ts             (REPLACE day 1's) demo users get broker_id
        │   ├── supabase.ts         (REPLACE) three clients: service / anon / userClient(jwt)
        │   └── broker-resolver.ts  (NEW) hostname → broker, in-memory cache
        ├── app/
        │   ├── api/auth/route.ts   (REPLACE day 1's) looks up broker_id at login
        │   ├── api/dashboard/route.ts (REPLACE day 1's) tenant-scoped via JWT
        │   ├── api/onboard/route.ts (REPLACE) broker_id from hostname
        │   └── api/admin/provision/route.ts (NEW) create new broker tenant
        └── middleware.ts           (NEW) attaches x-host header
```

## Sequencing rule

**Day 1 must be fully deployed and smoke-tested before day 2 starts.** They are deliberately separable. Day 1 is security-only and changes nothing about your data. Day 2 changes the data model and adds tenant scoping. Doing them as one mega-deploy is possible but harder to debug if something breaks.

If you only have time for one of them today, **do day 1**. It closes the bleeding wounds. Day 2 can wait until tomorrow.

## What each day costs in dollars

- Day 1: $0 (existing infra).
- Day 2: $0 (existing Supabase + Fly).
- Day 3: $0 (code only).
- Day 4: $0 (Supabase Auth + Google/Microsoft OAuth are free).
- Day 5: $0.
- Day 6: $0–20/mo (Zapier or Make if customer wants webhook bridge — usually customer pays).
- Day 7: $0.
- Day 8: customer pays for their domain. Resend free tier covers thousands of emails/mo.
- Day 9: ~$0–25/mo (Sentry free tier covers a lot; BetterStack free; PostHog/Plausible free at small scale).
- Day 10: $0.

Customer #1 break-even is ~1 month at $149 MRR. Build it.

## Common-sense reminders

- Commit and push after each day. Tag the commit (`git tag day1-complete`) so you can roll back if day 2 goes sideways.
- Test in `broker-demo.fly.dev` first, not on the customer app. The customer app should be a fresh provision once everything is proven.
- Keep `NEXT_PUBLIC_DEMO_MODE=true` on `broker-demo.fly.dev` forever — it's your sales demo. Never set it on a customer app.
- Don't merge days. The order is intentional: security → data model → presentation → identity → provisioning → integration → integration polish → domain → hardening → ship.

You've got this.
