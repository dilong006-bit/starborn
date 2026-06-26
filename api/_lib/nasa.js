// NASA APOD fetch 래퍼 — 비-JSON 응답 가드 포함.

/**
 * @returns {Promise<{ ok: boolean, status: number, data?: object, nonJson?: boolean }>}
 * @throws NASA_API_KEY 미설정 또는 DEMO_KEY 사용 시 (즉시 중단 — 폴백 대상 아님)
 */
export async function fetchNasa(date) {
  const key = process.env.NASA_API_KEY;
  if (!key) {
    const e = new Error("NASA_API_KEY_MISSING");
    e.code = "NASA_API_KEY_MISSING";
    throw e;
  }
  if (key === "DEMO_KEY") {
    // 명세 가드레일: DEMO_KEY 금지 (rate limit 즉시 소진)
    const e = new Error("DEMO_KEY_FORBIDDEN");
    e.code = "DEMO_KEY_FORBIDDEN";
    throw e;
  }

  const endpoint =
    `https://api.nasa.gov/planetary/apod` +
    `?date=${encodeURIComponent(date)}&thumbs=true&api_key=${encodeURIComponent(key)}`;

  const r = await fetch(endpoint);
  if (!r.ok) {
    return { ok: false, status: r.status };
  }

  // 비-JSON(HTML 에러 페이지 등) 가드
  const ct = r.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    return { ok: false, status: r.status, nonJson: true };
  }

  try {
    const data = await r.json();
    return { ok: true, status: r.status, data };
  } catch {
    return { ok: false, status: r.status, nonJson: true };
  }
}
