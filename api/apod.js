import { fetchNasa } from "./_lib/nasa.js";
import { getApodCache, upsertApodCache } from "./_lib/supabaseAdmin.js";
import {
  normalizeDate,
  normalize,
  toClient,
  prevDay,
  isToday,
} from "./_lib/apodNormalize.js";

// GET /api/apod?date=YYYY-MM-DD
// 흐름: 날짜 클램프 → 캐시 조회 → NASA 호출 → 폴백 → upsert → 클라이언트 응답
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // 1) 날짜 클램프 (1995-06-16 ~ today)
  const { date: reqDate, notice } = normalizeDate(req.query?.date);

  // 2) 캐시 조회 — hit이면 외부 호출 0
  const cached = await getApodCache(reqDate);
  if (cached) {
    return res.status(200).json(toClient(cached, notice));
  }

  // 3) NASA 호출 (+ 폴백)
  let targetDate = reqDate;
  let fallback = notice;

  let result;
  try {
    result = await fetchNasa(targetDate);
  } catch (e) {
    // 키 미설정/ DEMO_KEY → 설정 오류로 명확히 반환 (폴백 안 함)
    if (e.code === "NASA_API_KEY_MISSING" || e.code === "DEMO_KEY_FORBIDDEN") {
      return res.status(500).json({ error: e.code });
    }
    return res.status(502).json({ error: "apod_unavailable" });
  }

  // 3a) 오늘 미발행(404/500) → 전날로 1회 폴백
  if (!result.ok && isToday(targetDate)) {
    targetDate = prevDay(targetDate);
    fallback = "today_not_published";
    try {
      result = await fetchNasa(targetDate);
    } catch {
      return res.status(502).json({ error: "apod_unavailable" });
    }
  }

  if (!result.ok) {
    return res.status(502).json({ error: "apod_unavailable" });
  }

  // 4) 정규화
  let norm = normalize(result.data, targetDate);

  // 4a) video인데 썸네일이 없으면 인접(전날) image로 폴백 시도(1회)
  if (norm.media_type === "video" && !norm.thumbnail_url) {
    const altDate = prevDay(targetDate);
    try {
      const alt = await fetchNasa(altDate);
      if (alt.ok) {
        const altNorm = normalize(alt.data, altDate);
        if (altNorm.media_type === "image") {
          norm = altNorm;
          targetDate = altDate;
          fallback = fallback || "video_replaced_with_adjacent_image";
        }
      }
    } catch {
      // 폴백 실패 시 원래 video(썸네일 없음)를 그대로 반환 — 카드 레이어가 처리
    }
  }

  // 5) 캐시 저장(멱등) — 실제 APOD 날짜 기준
  await upsertApodCache({
    date: norm.date,
    title: norm.title,
    explanation: norm.explanation,
    url: norm.url,
    hdurl: norm.hdurl,
    media_type: norm.media_type,
    thumbnail_url: norm.thumbnail_url,
    copyright: norm.copyright,
  });

  return res.status(200).json(toClient(norm, fallback));
}
