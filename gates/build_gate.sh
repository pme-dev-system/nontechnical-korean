#!/usr/bin/env bash
# build_gate — HARD. R6/R7/R8: フォント適用 + ルート存在 + next build成功。
# macOS bash 3.2 safe, fail-closed. JUDGE only.
set -u
ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
RC=0

# R6 フォント
G="$ROOT/src/app/globals.css"
if [ -f "$G" ] && grep -q 'Noto+Sans+JP' "$G" && grep -q '"Noto Sans JP"' "$G"; then :; else
  echo "FAIL[build]: Noto Sans JP font not applied in globals.css"; RC=1
fi

# R7 ルート
for f in src/app/page.tsx "src/app/term/[slug]/page.tsx" "src/app/category/[slug]/page.tsx"; do
  [ -f "$ROOT/$f" ] || { echo "FAIL[build]: missing route $f"; RC=1; }
done

# R8 next build — SKIP_BUILD=1 なら省略(高速ゲート用)。デフォルトは実行。
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
# 静的出力の確認
if [ -d "$ROOT/.next" ]; then
  echo "PASS[build]: next build OK + routes + fonts"
else
  echo "FAIL[build]: .next not produced"; RC=1
fi
exit "$RC"
