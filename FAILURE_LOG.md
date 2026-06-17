# nontechnical_korean — Failure Log

> 실패할 때마다 1행. 같은 실패 재발 방지용 게이트를 추가하고 여기 기록.

| date | id | symptom | root cause | fix | gate added |
|---|---|---|---|---|---|
| 2026-06-17 | F1 | term JSON 19개 `Expecting ',' delimiter` (line 10 body_html) | 에이전트가 body_html의 HTML 속성 `class="..."` 큰따옴표를 JSON 문자열 안에서 미이스케이프 | 재번역 시 HTML 속성 작은따옴표 강제 + `python3 -m json.tool` 자가검증 루프(VALID까지 재작성) | terms_gate.sh (invalid-json 검출) |
| 2026-06-17 | F2 | slop_gate 19건 오탐(emoji=→, '그다음은', '마법처럼') | emoji 정규식이 화살표(U+2192)·dingbat 포함, 메타어 '다음은'이 '그다음은'에 매칭, demystify용 '마법/놀라운/손쉽게'를 hype로 오판 | emoji를 진짜 이모지(U+1F000~)로 축소, 일반 '다음은/아래는' 제거, 정상 서술어 제외 | slop_gate.sh 보정 |
