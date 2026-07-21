#!/usr/bin/env bash
# terms_gate — HARD. R1/R2/R3: 100個の用語の日本語JSONが存在 + 必須フィールド + 8カテゴリ。
# macOS bash 3.2 safe, fail-closed. JUDGE only.
set -u
ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
DIR="$ROOT/src/data/terms"
RC=0

if [ ! -d "$DIR" ]; then
  echo "FAIL[terms]: terms dir missing: $DIR"; exit 1
fi

# pythonで決定論的に検証(日本語出力を安全に扱うため)。無ければfail-closed。
if ! command -v python3 >/dev/null 2>&1; then
  echo "FAIL[terms]: python3 not found (cannot verify)"; exit 1
fi

OUT="$(python3 - "$DIR" <<'PY'
import json, os, sys
d = sys.argv[1]
req = ["slug","title_ja","deck_ja","analogy_ja","body_html","category_en"]
cats_expected = {"The Basics","How AI Works","Building With AI","Code & Collaboration",
                 "Shipping & Running","APIs & Connections","How Developers Think","More"}
files = [f for f in os.listdir(d) if f.endswith(".json")]
n = len(files)
bad = []
seen_cats = {}
for f in files:
    try:
        t = json.load(open(os.path.join(d, f), encoding="utf-8"))
    except Exception as e:
        bad.append(f+":invalid-json"); continue
    for k in req:
        v = t.get(k)
        if not v or (isinstance(v,str) and not v.strip()):
            bad.append(f+":empty-"+k)
    c = t.get("category_en","")
    seen_cats[c] = seen_cats.get(c,0)+1
print("COUNT", n)
print("BADN", len(bad))
for b in bad[:20]:
    print("BAD", b)
missing = cats_expected - set(seen_cats.keys())
print("CATS", len(seen_cats))
for m in missing:
    print("MISSINGCAT", m)
PY
)"
echo "$OUT" | grep -v '^BAD\|^MISSINGCAT' | sed 's/^/  /'

COUNT="$(echo "$OUT" | awk '/^COUNT/{print $2}')"
BADN="$(echo "$OUT" | awk '/^BADN/{print $2}')"
[ "${COUNT:-0}" -ge 100 ] || { echo "FAIL[terms]: only ${COUNT:-0}/100 term JSONs"; RC=1; }
[ "${BADN:-1}" -eq 0 ] || { echo "FAIL[terms]: ${BADN} field problems"; echo "$OUT" | grep '^BAD' | sed 's/^BAD/  -/'; RC=1; }
if echo "$OUT" | grep -q '^MISSINGCAT'; then
  echo "FAIL[terms]: empty/missing categories:"; echo "$OUT" | grep '^MISSINGCAT' | sed 's/^MISSINGCAT/  -/'; RC=1
fi

[ "$RC" -eq 0 ] && echo "PASS[terms]: ${COUNT} terms, all fields, 8 categories"
exit "$RC"
