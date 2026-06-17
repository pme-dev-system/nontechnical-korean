# nontechnical_korean — Requirements (SSoT)

> 단일 진실. 게이트는 이 표의 각 R을 exit code로 검증한다.
> 원본: nontechnical.dev (AI·기술 용어 100개, 비유 중심). 목표: 한국어 재구성판.

| id | requirement | gate |
|---|---|---|
| R1 | 원본 100개 용어가 모두 한국어 번역 JSON으로 존재 (`src/data/terms/*.json` = 100) | terms_gate.sh |
| R2 | 각 용어에 필수 필드(slug·title_ko·deck_ko·analogy_ko·body_html·category_en) 채워짐 | terms_gate.sh |
| R3 | 8개 카테고리로 분류, 빈 카테고리 없음 | terms_gate.sh |
| R4 | AI티 제거: 이모지·과장 자기칭찬어·메타문구·`TLDR:` 잔존 없음 | slop_gate.sh |
| R5 | 본문 한국어 비율 충분(번역 누락/영문 본문 잔존 차단) | slop_gate.sh |
| R6 | 에이투지체(AtoZ) 9 weight `@font-face` 적용 + 폰트 파일 존재 | build_gate.sh |
| R7 | 홈·카테고리·용어 상세 라우트 파일 존재 | build_gate.sh |
| R8 | `next build` 성공 (정적 100개 용어 + 8개 카테고리 페이지 생성) | build_gate.sh |
| R9 | 용어별 이미지 100개 존재 (`public/dictionary/img/`) | img_gate.sh |
| R10 | 시크릿 하드코딩 없음 | secrets_gate.sh |
