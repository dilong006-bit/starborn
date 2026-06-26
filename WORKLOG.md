# 📓 Starborn 작업 일지

## 2026-06-26 — Turn 3 시작 (작업 1~2 완료)

명세서 13장 빌드 순서에 따라 진행. 이번 세션 목표는 작업 1~5(F1 "오늘의 우주"
end-to-end MVP). 오늘은 **작업 1·2**를 완료하고 GitHub에 초기 푸시.

### ✅ 작업 1 — 스캐폴딩 + 폴더 구조 + .gitignore
- Vite 5 + React 18 + TypeScript + Tailwind(v3, 우주 다크 테마) 수동 스캐폴딩
- 폴더 구조: `api/`, `src/{components,pages,lib}` (자리표시 `.gitkeep`)
- `.gitignore`: `.env`, `.env*.local`, `.vercel`, `node_modules`, `dist`
- `.env.local.example`: 서버 시크릿 vs `VITE_` 분리 템플릿
- 스크립트: `dev` = `vercel dev` (로컬 기본 실행), 보조 `vite`
- **검증**: `npm install` ✓ · `npm run build` ✓ · `npm run typecheck` ✓

### ✅ 작업 2 — Supabase + DDL + env 세팅
- `supabase/schema.sql`: 명세 6장 DDL (apod_cache / story_cache / share_events + RLS)
- `vercel.json`: Vite 프레임워크 최소 설정
- `src/lib/supabaseClient.ts`: 클라이언트 전용 anon 키만 사용 (service_role 미포함)
- `README.md`: 최초 1회 셋업 체크리스트 (Supabase 생성·키 발급·env 등록)
- **검증**: `@supabase/supabase-js` 설치 ✓ · build ✓ · typecheck ✓

### 🔒 가드레일 준수 현황
- 시크릿(NASA/Anthropic/service_role)에 `VITE_` 미부착, 클라이언트 노출 없음
- `.env`·`.vercel` 커밋 제외 (`.gitignore`)
- NASA DEMO_KEY 미사용 방침 명문화

### ⏭️ 다음 (작업 3)
- `GET /api/apod`: 날짜 클램프(1995-06-16~today) · 캐시 · NASA 호출 · 폴백
  (video/404·500/비-JSON/copyright 정규화) · upsert 캐싱

### 📌 사용자 수동 단계 (README 체크리스트)
- [ ] Supabase 프로젝트 생성 → `supabase/schema.sql` 실행
- [ ] NASA(정식 키)·Anthropic 키 발급
- [ ] `.env.local.example` → `.env.local` 복사 후 값 입력
- [ ] Vercel 대시보드에 env 6개 등록
