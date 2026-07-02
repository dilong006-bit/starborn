interface Props {
  onAdd: () => void;
}

export default function CollectionEmpty({ onAdd }: Props) {
  return (
    <div className="mt-16 flex flex-col items-center gap-5 text-center">
      <div className="text-5xl opacity-70" aria-hidden>
        ✦ ✧ ✦
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-slate-100">
          아직 새긴 우주가 없어요
        </p>
        <p className="text-sm text-slate-400">
          첫 우주를 별자리에 새겨보세요.
        </p>
      </div>
      <button
        onClick={onAdd}
        className="rounded-control bg-cosmos-accent px-6 py-3 font-semibold text-white shadow-e1 transition hover:shadow-glow active:animate-jelly"
      >
        ⭐ 우주 추가
      </button>
    </div>
  );
}
