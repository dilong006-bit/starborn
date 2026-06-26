-- ============================================================
-- Starborn — Supabase 스키마 (명세서 6장)
-- 사용법: Supabase 대시보드 → SQL Editor에 붙여넣고 Run
-- ============================================================

-- 6.1 APOD 원본 캐시 (날짜별 영구 불변)
create table if not exists apod_cache (
  date          date primary key,            -- 'YYYY-MM-DD'
  title         text not null,
  explanation   text not null,
  url           text not null,
  hdurl         text,
  media_type    text not null,               -- 'image' | 'video'
  thumbnail_url text,
  copyright     text,
  fetched_at    timestamptz not null default now()
);

-- 6.2 생성된 스토리 캐시 (날짜 + 톤 단위)
create table if not exists story_cache (
  id          uuid primary key default gen_random_uuid(),
  apod_date   date not null references apod_cache(date) on delete cascade,
  tone        text not null,                 -- 'essay' | 'fortune' | 'poem'
  story_text  text not null,
  model       text not null,
  created_at  timestamptz not null default now(),
  unique (apod_date, tone)                   -- ⚠️ 같은 날짜+톤은 1개만 (캐시 폭발 방지)
);

-- 6.3 공유 이벤트 집계 (북극성 지표: 공유율 측정용)
create table if not exists share_events (
  id          uuid primary key default gen_random_uuid(),
  apod_date   date,
  tone        text,
  channel     text,                          -- 'download' | 'webshare' | 'copylink'
  created_at  timestamptz not null default now()
);

-- ============================================================
-- 6.4 RLS: 기본 차단 + 클라이언트 직접 쓰기 금지 (방어적 다층화)
-- ============================================================
alter table apod_cache   enable row level security;
alter table story_cache  enable row level security;
alter table share_events enable row level security;

-- 캐시는 익명 클라이언트에게 읽기만 허용 (선택). 쓰기는 서버리스(service_role)만.
drop policy if exists "public read apod"  on apod_cache;
drop policy if exists "public read story" on story_cache;
create policy "public read apod"  on apod_cache  for select using (true);
create policy "public read story" on story_cache for select using (true);

-- 공유 이벤트는 익명 INSERT만 허용 (집계용), 조회는 차단
drop policy if exists "anon insert share" on share_events;
create policy "anon insert share" on share_events for insert with check (true);
