import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ⚠️ 클라이언트 전용: anon(publishable) 키만 사용한다.
//    service_role 키는 절대 여기로 들어오면 안 된다 (RLS 우회 = 보안 사고).
//    실제 외부 호출(NASA/Claude)과 캐시 쓰기는 /api 서버리스 함수에서만 한다.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// MVP는 클라이언트가 Supabase를 직접 쓰지 않아도 동작한다(모든 데이터는 /api 경유).
// 공유 이벤트 집계 등 선택적 클라이언트 읽기/INSERT가 필요할 때만 사용.
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

if (!supabase && import.meta.env.DEV) {
  // 개발 편의용 경고 (프로덕션 빌드에서는 출력되지 않음)
  console.warn(
    "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY 미설정 — 클라이언트 Supabase 비활성화"
  );
}
