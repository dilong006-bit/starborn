export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cosmos-glow/70">
        Starborn
      </p>
      <h1 className="bg-gradient-to-r from-cosmos-glow to-cosmos-accent bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
        내 생일의 우주
      </h1>
      <p className="mt-4 max-w-md text-balance text-slate-300">
        날짜를 입력하면 그날의 NASA 우주 사진과 한국어 우주 이야기를 카드로
        만들어 드려요.
      </p>
      <p className="mt-10 text-xs text-slate-500">
        스캐폴딩 완료 · 다음 단계에서 화면이 채워집니다.
      </p>
    </main>
  );
}
