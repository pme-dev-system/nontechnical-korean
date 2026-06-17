# 쉬운 기술 사전 (nontechnical-korean)

AI·개발 용어 100개를 고등학생도 이해할 수 있게 **비유와 예시**로 풀어 쓴 한국어 사전.
영문 원전 [nontechnical.dev](https://www.nontechnical.dev) 의 개념을 한국어로 재구성했다.

- **Live**: https://nontechnical-korean.vercel.app
- 100개 용어 · 8개 카테고리(ADHD 친화 분류)
- 폰트: 에이투지체(AtoZ) · 용어별 결정론 SVG 커버
- 평서체(-다체) 전문 톤, AI 티 제거(이모지·과장어·메타문구 차단)

## 구조

```
src/
  app/            홈 / term/[slug] / category/[slug] (정적 생성)
  components/     SiteHeader, SiteFooter, TermCard, Reveal(framer-motion)
  data/
    terms-src/    영문 원본 100 (수집본)
    terms/        한국어 번역 100 (slug.json)
  lib/            categories(SSoT) / terms(로더)
public/
  fonts/          에이투지체 9 weight
  dictionary/img/ 용어별 SVG 커버 100
gates/            verify_*.sh + terms/slop/img/build/secrets 서브게이트
```

## 개발

```bash
npm install
npm run dev          # 로컬
npm run build        # 정적 빌드 (용어 100 + 카테고리 8)
bash gates/verify_nontechnical_korean.sh .   # 마스터 QA 게이트 (exit 0 = PASS)
```

요구사항 정본은 `REQUIREMENTS.md`, 실패 이력은 `FAILURE_LOG.md`.

> 이미지는 현재 결정론 SVG 커버다. ChatGPT 이미지 쿼터 회복 시 `/gi`(GPT-Image-2) 실사로 교체 가능.
