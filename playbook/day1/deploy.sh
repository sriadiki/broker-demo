#!/usr/bin/env bash
# day1/deploy.sh — set Fly secrets and deploy.
#
# Two ways to provide values:
#   1. (Recommended) put them in .env.local at the repo root — this script auto-loads it.
#   2. export them in your shell first.
#
# Required vars (use the Next.js naming — same as .env.local):
#   NEXT_PUBLIC_SUPABASE_URL
#   NEXT_PUBLIC_SUPABASE_ANON_KEY
#   SUPABASE_SERVICE_ROLE_KEY
#   SUPABASE_JWT_SECRET
#
# Optional:
#   RESEND_API_KEY
#   OPENAI_API_KEY
#   NEXT_PUBLIC_DEMO_MODE   (default: true)
#   NEXT_PUBLIC_APP_URL     (default: https://broker-demo.fly.dev)
#   SESSION_SECRET          (auto-generated if missing)
#   SUPER_ADMIN_EMAILS      (day 2+; comma-separated)
#   FLY_APP                 (default: broker-demo)
#
# Run from the repo root: `bash playbook/day1/deploy.sh`

set -euo pipefail

# ---------- 1. auto-load .env.local if present ----------
if [ -f .env.local ]; then
  echo "[deploy] loading .env.local"
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

# ---------- 2. validate required vars ----------
require() {
  local name="$1"
  if [ -z "${!name:-}" ]; then
    echo "[deploy] ERROR: $name is not set"
    echo "[deploy] Add it to .env.local or export it in your shell, then re-run."
    exit 1
  fi
}

require NEXT_PUBLIC_SUPABASE_URL
require NEXT_PUBLIC_SUPABASE_ANON_KEY
require SUPABASE_SERVICE_ROLE_KEY
require SUPABASE_JWT_SECRET

# ---------- 3. defaults ----------
APP="${FLY_APP:-broker-demo}"
NEXT_PUBLIC_DEMO_MODE="${NEXT_PUBLIC_DEMO_MODE:-true}"
NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL:-https://broker-demo.fly.dev}"
SESSION_SECRET="${SESSION_SECRET:-$(openssl rand -base64 48)}"

echo "[deploy] target app:    $APP"
echo "[deploy] DEMO_MODE:     $NEXT_PUBLIC_DEMO_MODE"
echo "[deploy] APP_URL:       $NEXT_PUBLIC_APP_URL"

# ---------- 4. set runtime secrets (NOT NEXT_PUBLIC_*; those are baked into the build below) ----------
echo "[deploy] setting fly secrets (runtime)..."
fly secrets set -a "$APP" \
  NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY" \
  SUPABASE_JWT_SECRET="$SUPABASE_JWT_SECRET" \
  SESSION_SECRET="$SESSION_SECRET" \
  NEXT_PUBLIC_DEMO_MODE="$NEXT_PUBLIC_DEMO_MODE" \
  NEXT_PUBLIC_APP_URL="$NEXT_PUBLIC_APP_URL" \
  RESEND_API_KEY="${RESEND_API_KEY:-}" \
  OPENAI_API_KEY="${OPENAI_API_KEY:-}" \
  SUPER_ADMIN_EMAILS="${SUPER_ADMIN_EMAILS:-}"

# Note: setting NEXT_PUBLIC_* via secrets above is for SAFETY / completeness — it lets server-side code
# read them. But they ALSO must be passed as --build-arg below so Next.js can inline them into the client bundle.

# ---------- 5. deploy with build args (for NEXT_PUBLIC_* — public values, safe to bake into the image) ----------
echo "[deploy] deploying (with build args for NEXT_PUBLIC_*)..."
fly deploy -a "$APP" \
  --build-arg "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg "NEXT_PUBLIC_DEMO_MODE=$NEXT_PUBLIC_DEMO_MODE" \
  --build-arg "NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL"

echo ""
echo "[deploy] done. Verify with:"
echo "  fly secrets list -a $APP"
echo "  fly logs -a $APP"
