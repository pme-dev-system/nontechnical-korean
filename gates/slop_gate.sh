#!/usr/bin/env bash
# slop_gate — HARD. R4/R5: AI티 제거 + 한국어 본문 비율.
# 이모지 / 'TLDR:' 잔존 / 메타문구 / 과장 자기칭찬어 / 영문 본문 잔존 차단.
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
# 진짜 이모지만(화살표 U+2190~21FF 등 정상 기술 기호 제외). 악명높은 BMP 이모지 몇 개만 추가.
emoji = re.compile("[\U0001F000-\U0001FAFF\U0001F1E6-\U0001F1FF✅❌✨❗⚠⭐]")
# 과장/자기칭찬·권유형 도배 마커 (학습 사전 톤에 부적합). 정상 서술에 쓰이는
# '마법(처럼)/놀라운/손쉽게' 는 demystify 맥락에서 정당 → 제외. 순수 hype/대화체 필러만 유지.
slop_words = ["혁신적","획기적","척척","뚝딱", "여러분", "지금부터",
              "함께 알아보아요", "알아보아요", "살펴볼까요", "알아볼까요"]
# '그다음은' 같은 정상어 오탐 방지: 일반 '다음은/아래는' 제거, 하드 메타 마커만 유지.
meta = ["번역:", "한국어 버전", "Here is", "Translation:", chr(96)*3+"json"]
hangul = re.compile("[가-힣]")
latin = re.compile("[A-Za-z]")
bad = []
files = [f for f in os.listdir(d) if f.endswith(".json")]
for f in files:
    try:
        t = json.load(open(os.path.join(d,f), encoding="utf-8"))
    except Exception:
        bad.append(f+":invalid-json"); continue
    blob = " ".join(str(t.get(k,"")) for k in ("title_ko","deck_ko","analogy_ko","kicker_ko","body_html"))
    if emoji.search(blob): bad.append(f+":emoji")
    if "TLDR:" in str(t.get("deck_ko","")): bad.append(f+":tldr-left")
    for w in slop_words:
        if w in blob: bad.append(f+":slop("+w+")"); break
    for m in meta:
        if m in blob: bad.append(f+":meta("+m.strip()+")"); break
    # 본문 한국어 비율: 한글 글자수가 라틴 글자수보다 적으면 번역 누락 의심
    body = re.sub("<[^>]+>","", str(t.get("body_html","")))
    h = len(hangul.findall(body)); l = len(latin.findall(body))
    if h < 50: bad.append(f+":body-too-short("+str(h)+"h)")
    elif l > h: bad.append(f+":english-heavy("+str(h)+"h/"+str(l)+"l)")
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
  echo "PASS[slop]: no emoji/TLDR/meta/slop markers, Korean body OK"
fi
exit "$RC"
