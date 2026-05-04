# Day 1 — Security & secrets (work from this file top-to-bottom)

**Goal of today (or this morning):** close the six critical security holes before any paying customer touches the app. By end of day the forgeable cookie is gone, demo creds are gated, secrets are out of `fly.toml`, and repo junk is removed.

**Estimated time:** 4–6 hours.

**Pre-flight check:**
- You have `flyctl` installed and authenticated (`fly auth whoami`).
- You have your Supabase project's: project URL, anon key, service-role key, and JWT Secret. The JWT Secret is at **Supabase Dashboard → Project Settings → API → JWT Settings → JWT Secret**. Copy this — you need it.
- You have your `RESEND_API_KEY` and `OPENAI_API_KEY`.
- You have Node 18+ and the broker-demo repo cloned and building locally.

---

## 1. Install jose (JWT library)

```bash
cd broker-demo
npm install jose
```

This is the only new dependency for day 1. `jose` is small, edge-runtime-safe, and used by NextAuth — no surprises.

## 2. Copy the day-1 files in

From the playbook folder, copy these into your repo, **overwriting** existing files where applicable:

```
playbook/day1/files/lib/session.ts                  -> lib/session.ts                  (NEW)
playbook/day1/files/lib/auth-guard.ts               -> lib/auth-guard.ts               (NEW)
playbook/day1/files/lib/auth.ts                     -> lib/auth.ts                     (REPLACES)
playbook/day1/files/app/api/auth/route.ts           -> app/api/auth/route.ts           (REPLACES)
playbook/day1/files/app/api/dashboard/route.ts      -> app/api/dashboard/route.ts      (REPLACES)
playbook/day1/files/app/login/page.tsx              -> app/login/page.tsx              (REPLACES)
playbook/day1/files/.gitignore                      -> .gitignore                      (REPLACES)
playbook/day1/files/.env.example                    -> .env.example                    (NEW)
playbook/day1/files/fly.toml                        -> fly.toml                        (REPLACES)
```

`cp -r` works fine. Diff each one before committing if you want to see exactly what changed.

## 3. Clean the repo

```bash
chmod +x playbook/day1/cleanup.sh
bash playbook/day1/cleanup.sh
```

This deletes `.DS_Store`, `*.old`, `*.old.ts`, `*.old.tsx`, `route old.ts`, `fly.toml.old`, and `git rm --cached`s any of those that are tracked. Review with `git status`.

## 4. Set up local `.env.local`

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
# edit .env.local
```

Crucially:

- `NEXT_PUBLIC_SUPABASE_URL` — fix the typo from `fly.toml` (it was `ohttps://...` — drop the leading `o`).
- `SUPABASE_JWT_SECRET` — paste the JWT Secret you copied from Supabase. (Day 2 needs this; day 1 alone uses `SESSION_SECRET`, but set both now.)
- `SESSION_SECRET` — generate with `openssl rand -base64 48` and paste.
- `NEXT_PUBLIC_DEMO_MODE=true` — keep on for now (the `broker-demo.fly.dev` instance stays in demo mode). Customer apps will set this to `false`.

## 5. Local sanity test (5 min)

```bash
npm run dev
# Open http://localhost:3000/login
```

You should see:
- The demo-credentials panel still shows (because `NEXT_PUBLIC_DEMO_MODE=true`).
- Click "Broker Admin", then **Sign in**. You should land on `/dashboard` with leads visible.
- In DevTools → Application → Cookies, `auth-user` is now a long JWT string starting with `eyJ...`, not raw JSON.

**Forgery test (the whole point of day 1):**
1. Edit the `auth-user` cookie value in DevTools to literally `tampered`.
2. Reload the dashboard.
3. You should be bounced back to `/login` (or get a 401 on `/api/dashboard`).

If you do not get bounced, stop and check that `lib/session.ts` is in place and `requireUser()` is being called in `/api/dashboard/route.ts`.

## 6. Set Fly secrets and deploy

Pre-fill your shell with the values:

```bash
export SUPABASE_URL='https://<your-project>.supabase.co'
export SUPABASE_ANON='eyJ...'           # anon public key
export SUPABASE_SERVICE='eyJ...'        # service role key (keep this private!)
export SUPABASE_JWT_SECRET='...'        # the JWT Secret from Supabase
export RESEND_KEY='re_...'              # optional but recommended
export OPENAI_KEY='sk-...'              # optional but recommended
export DEMO_MODE='true'                 # broker-demo stays in demo mode
```

Then:

```bash
chmod +x playbook/day1/deploy.sh
bash playbook/day1/deploy.sh
```

The script:
1. `fly secrets set` for everything (one atomic operation).
2. `fly deploy`.
3. Tells you how to verify.

After it finishes:

```bash
fly secrets list -a broker-demo        # confirm everything is present
fly logs -a broker-demo                 # watch the deploy
```

## 7. Production smoke test

Hit the live site:

```bash
# 1. Unauthenticated dashboard call should be 401:
curl -i https://broker-demo.fly.dev/api/dashboard | head -1

# 2. Forged cookie should be 401:
curl -i -H 'cookie: auth-user={"id":"x","email":"hax@x.com","role":"admin","name":"Hax"}' \
  https://broker-demo.fly.dev/api/dashboard | head -1

# 3. Login flow:
curl -c /tmp/c.txt -H 'content-type: application/json' \
  -d '{"email":"admin@clearpath.com","password":"demo1234"}' \
  https://broker-demo.fly.dev/api/auth

curl -b /tmp/c.txt https://broker-demo.fly.dev/api/dashboard | head -c 400
```

All three should behave correctly: 401, 401, then a leads array.

## 8. Commit and push

```bash
git add -A
git commit -m "day 1: signed JWT sessions, gated demo creds, secrets out of fly.toml, repo cleanup"
git push
```

## Day 1 — done when

- [ ] `auth-user` cookie is a JWT, not JSON.
- [ ] Forged cookies return 401 (verified locally AND on broker-demo.fly.dev).
- [ ] `fly secrets list -a broker-demo` shows all 7 secrets.
- [ ] `fly.toml` no longer has `[build.args]` block.
- [ ] No `*.old` or `.DS_Store` in `git status`.
- [ ] `npm run build` succeeds with no TypeScript errors.

If all six boxes are ticked, you're ready for day 2.
