import { streakDays } from "../lib/collection";

/** 연속 저장일 뱃지. 0일이면 렌더하지 않는다. */
export default function StreakBadge() {
  const days = streakDays();
  if (days <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-cosmos-star/30 bg-cosmos-star/10 px-3 py-1 text-sm font-medium text-cosmos-star">
      🔥 {days}일 연속
    </span>
  );
}
