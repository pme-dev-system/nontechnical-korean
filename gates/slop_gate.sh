#!/usr/bin/env bash
# slop_gate — HARD. R4/R5: AI臭さの除去 + 日本語本文比率。
# 絵文字 / 'TLDR:'残存 / メタ文言 / 誇張自画自賛語 / 英文本文残存を遮断。
# macOS bash 3.2 safe, fail-closed. JUDGE only.
set -u
ROOT="${1:-$(pwd)}"; case "$ROOT" in --*) ROOT="$(pwd)";; esac
DIR="$ROOT/src/data/terms"
RC=0
[ -d "$DIR" ] || { echo "FAIL[slop]: terms dir missing"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "FAIL[slop]: python3 not found"; exit 1; }

OUT="$(python3 - "$DIR" <<'PY'
import json, os, sys, re
d = sys.argv[1]
# 本物の絵文字のみ(矢印U+2190~21FFなど正常な技術記号は除外)。悪名高いBMP絵文字を少し追加。
emoji = re.compile("[\U0001F000-\U0001FAFF\U0001F1E6-\U0001F1FF✅❌✨❗⚠⭐]")
# 誇張/自画自賛・勧誘型の量産マーカー(学習辞典のトーンに不適合)。通常の説明で使われる
# 「魔法(のように)/驚くほど/簡単に」はdemystifyの文脈で正当 → 除外。純粋なhype/口語フィラーのみ維持。
slop_words = ["革新的","画期的","皆さん","さあ","一緒に見ていきましょう",
              "紐解いていきます","ワクワク"]
# 「それでは次に」のような正常語の誤検出防止: 一般的な「次は/以下は」は除去し、ハードなメタマーカーのみ維持。
meta = ["翻訳:", "日本語版", "Here is", "Translation:", chr(96)*3+"json"]
jchar = re.compile("[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]")
latin = re.compile("[A-Za-z]")
bad = []
files = [f for f in os.listdir(d) if f.endswith(".json")]
for f in files:
    try:
        t = json.load(open(os.path.join(d,f), encoding="utf-8"))
    except Exception:
        bad.append(f+":invalid-json"); continue
    blob = " ".join(str(t.get(k,"")) for k in ("title_ja","deck_ja","analogy_ja","kicker_ja","body_html"))
    if emoji.search(blob): bad.append(f+":emoji")
    if "TLDR:" in str(t.get("deck_ja","")): bad.append(f+":tldr-left")
    for w in slop_words:
        if w in blob: bad.append(f+":slop("+w+")"); break
    for m in meta:
        if m in blob: bad.append(f+":meta("+m.strip()+")"); break
    # 本文の日本語比率: 日本語文字数がラテン文字数より少なければ翻訳漏れの疑い
    body = re.sub("<[^>]+>","", str(t.get("body_html","")))
    h = len(jchar.findall(body)); l = len(latin.findall(body))
    if h < 50: bad.append(f+":body-too-short("+str(h)+"j)")
    elif l > h: bad.append(f+":english-heavy("+str(h)+"j/"+str(l)+"l)")
print("BADN", len(bad))
for b in bad[:40]:
    print("BAD", b)
PY
)"
BADN="$(echo "$OUT" | awk '/^BADN/{print $2}')"
if [ "${BADN:-1}" -ne 0 ]; then
  echo "FAIL[slop]: ${BADN} AI-slop/quality problems:"
  echo "$OUT" | grep '^BAD' | sed 's/^BAD/  -/'
  RC=1
else
  echo "PASS[slop]: no emoji/TLDR/meta/slop markers, Japanese body OK"
fi
exit "$RC"
