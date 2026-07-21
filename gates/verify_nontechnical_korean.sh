#!/usr/bin/env bash
# qa-canon MASTER gate (template -> verify_<name>.sh). nontechnical_korean
# (日本語ローカライズ版もこの名前のまま運用する — リポジトリ名に合わせたゲート識別子)
# OR-aggregate, fail-closed, macOS bash 3.2 safe. Exit 0 PASS / 1 FAIL.
# Loop contract: emits machine-readable FAIL[<gate>]: <reason> lines so an agent
# can diagnose -> fix -> re-run until exit 0 (this script is the JUDGE, not the fixer).
set -u

ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
GATES_DIR="$(cd "$(dirname "$0")" && pwd)"
RC=0; FAILED=""
log()  { printf '%s\n' "$*"; }
fail() { RC=1; FAILED="$FAILED $1"; log "FAIL[$1]: $2"; }

# --- structure: loop-engineeringにはSSoT + 記憶 + readmeが必須 ---
for f in REQUIREMENTS.md FAILURE_LOG.md README.md; do
  [ -f "$ROOT/$f" ] || fail structure "missing $f"
done

# --- run every *_gate.sh in gates/ (each HARD). fail-closed even on crash. ---
shopt -s nullglob 2>/dev/null || true
for g in "$GATES_DIR"/*_gate.sh; do
  [ -e "$g" ] || continue
  base="$(basename "$g")"
  bash "$g" "$ROOT" "$@"; rc=$?
  [ "$rc" -ne 0 ] && fail "$base" "exit $rc"
done

if [ "$RC" -eq 0 ]; then
  log "VERIFY PASS (root=$ROOT)"
else
  log "VERIFY FAIL:$FAILED"
fi
exit "$RC"
