import { useState } from "react";
import type { SavedUniverse } from "./lib/types";
import Home from "./pages/Home";
import Birthday from "./pages/Birthday";
import Result from "./pages/Result";
import Collection from "./pages/Collection";
import Detail from "./pages/Detail";

type View =
  | { name: "home" }
  | { name: "input" }
  | { name: "result"; date: string; userName: string }
  | { name: "collection" }
  | { name: "detail"; saved: SavedUniverse };

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });

  switch (view.name) {
    case "input":
      return (
        <Birthday
          onBack={() => setView({ name: "home" })}
          onSubmit={(date, userName) =>
            setView({ name: "result", date, userName })
          }
        />
      );
    case "result":
      return (
        <Result
          date={view.date}
          name={view.userName}
          onBack={() => setView({ name: "input" })}
          onHome={() => setView({ name: "home" })}
        />
      );
    case "collection":
      return (
        <Collection
          onBack={() => setView({ name: "home" })}
          onAdd={() => setView({ name: "input" })}
          onOpen={(saved) => setView({ name: "detail", saved })}
        />
      );
    case "detail":
      return (
        <Detail
          universe={view.saved}
          onBack={() => setView({ name: "collection" })}
          onRemoved={() => setView({ name: "collection" })}
        />
      );
    default:
      return (
        <Home
          onOpenBirthday={() => setView({ name: "input" })}
          onOpenCollection={() => setView({ name: "collection" })}
        />
      );
  }
}
