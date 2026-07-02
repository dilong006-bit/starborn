import type { SavedUniverse } from "../lib/types";
import { proxied } from "../lib/share";
import OccasionTag from "./OccasionTag";

interface Props {
  universe: SavedUniverse;
  index: number;
  onOpen: () => void;
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${y}.${m}.${d}`;
}

export default function CollectionCard({ universe, index, onOpen }: Props) {
  return (
    <button
      onClick={onOpen}
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="glass animate-card-in group flex flex-col overflow-hidden rounded-card text-left shadow-e1 transition active:animate-jelly hover:shadow-glow"
    >
      <div className="relative aspect-square w-full bg-cosmos-900">
        {universe.imageUrl ? (
          <img
            src={proxied(universe.imageUrl) ?? undefined}
            alt={universe.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-slate-500">
            🎞
          </div>
        )}
        <div className="absolute right-2 top-2 text-sm opacity-80">🔑</div>
      </div>
      <div className="flex flex-col gap-1.5 p-3">
        <span className="num text-xs text-cosmos-glow">
          {formatDate(universe.inputDate)}
        </span>
        <OccasionTag occasion={universe.occasion} />
      </div>
    </button>
  );
}
