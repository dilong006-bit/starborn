import type { Occasion } from "../lib/types";

const META: Record<Occasion, { label: string; dot: string }> = {
  birthday: { label: "생일", dot: "bg-occasion-birthday" },
  anniversary: { label: "기념일", dot: "bg-occasion-anniversary" },
  today: { label: "오늘", dot: "bg-occasion-today" },
  custom: { label: "특별한 날", dot: "bg-occasion-custom" },
};

export default function OccasionTag({ occasion }: { occasion: Occasion }) {
  const m = META[occasion] ?? META.custom;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-slate-200">
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}
