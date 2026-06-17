#!/usr/bin/env bash
# build_gate — HARD. R6/R7/R8: 폰트 적용 + 라우트 존재 + next build 성공.
# macOS bash 3.2 safe, fail-closed. JUDGE only.
set -u
ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
RC=0

# R6 폰트
G="$ROOT/src/app/globals.css"
if [ -f "$G" ] && grep -q 'AtoZ-Regular.ttf' "$G" && grep -q 'font-family: "AtoZ"' "$G"; then :; else
  echo "FAIL[build]: AtoZ @font-face not applied in globals.css"; RC=1
fi
FCOUNT="$(ls "$ROOT/public/fonts"/AtoZ-*.ttf 2>/dev/null | wc -l | tr -d ' ')"
[ "${FCOUNT:-0}" -ge 9 ] || { echo "FAIL[build]: AtoZ font files ${FCOUNT}/9"; RC=1; }

# R7 라우트
for f in src/app/page.tsx "src/app/term/[slug]/page.tsx" "src/app/category/[slug]/page.tsx"; do
  [ -f "$ROOT/$f" ] || { echo "FAIL[build]: missing route $f"; RC=1; }
done

# R8 next build — SKIP_BUILD=1 이면 건너뜀(빠른 게이트용). 기본은 실행.
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  echo "PASS[build]: structure OK (build skipped via SKIP_BUILD=1)"
  exit "$RC"
fi
if [ ! -d "$ROOT/node_modules/next" ]; then
  echo "FAIL[build]: node_modules/next missing (run npm install)"; exit 1
fi
echo "[build] running next build ..."
BUILD_LOG="$(cd "$ROOT" && NEXT_TELEMETRY_DISABLED=1 npm run build 2>&1)"
BRC=$?
if [ "$BRC" -ne 0 ]; then
  echo "FAIL[build]: next build exit $BRC"
  echo "$BUILD_LOG" | tail -25 | sed 's/^/  /'
  exit 1
fi
# 정적 산출 확인
if [ -d "$ROOT/.next" ]; then
  echo "PASS[build]: next build OK + routes + fonts"
else
  echo "FAIL[build]: .next not produced"; RC=1
fi
exit "$RC"
