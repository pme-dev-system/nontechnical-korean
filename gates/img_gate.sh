#!/usr/bin/env bash
# img_gate — HARD. R9: 用語ごとの画像が参照パスに存在すること。
# 各term JSONのimgパス(public基準)が実際のファイルとして存在するか検証する。
# macOS bash 3.2 safe, fail-closed. JUDGE only.
set -u
ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
DIR="$ROOT/src/data/terms"
RC=0
[ -d "$DIR" ] || { echo "FAIL[img]: terms dir missing"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "FAIL[img]: python3 not found"; exit 1; }

OUT="$(python3 - "$DIR" "$ROOT" <<'PY'
import json, os, sys
d, root = sys.argv[1], sys.argv[2]
missing = []
total = 0
for f in os.listdir(d):
    if not f.endswith(".json"): continue
    try:
        t = json.load(open(os.path.join(d,f), encoding="utf-8"))
    except Exception:
        continue
    total += 1
    img = (t.get("img") or "").lstrip("/")
    if not img:
        missing.append(f+":no-img-field"); continue
    p = os.path.join(root, "public", img)
    if not os.path.isfile(p):
        missing.append(t.get("slug",f)+" -> "+img)
print("TOTAL", total)
print("MISSN", len(missing))
for m in missing[:30]:
    print("MISS", m)
PY
)"
TOTAL="$(echo "$OUT" | awk '/^TOTAL/{print $2}')"
MISSN="$(echo "$OUT" | awk '/^MISSN/{print $2}')"
if [ "${MISSN:-1}" -ne 0 ]; then
  echo "FAIL[img]: ${MISSN}/${TOTAL} term images missing:"
  echo "$OUT" | grep '^MISS ' | sed 's/^MISS/  -/'
  RC=1
else
  echo "PASS[img]: all ${TOTAL} term images present"
fi
exit "$RC"
