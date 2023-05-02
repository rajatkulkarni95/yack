import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { HotkeysProvider } from "react-hotkeys-hook";
import { useEffect } from "react";
import { emit } from "@tauri-apps/api/event";

const Main = () => {
  useEffect(() => {
    // Check for updates every hour
    const intervalId = setInterval(
      () => emit("tauri://update"),
      60 * 60 * 1000
    );

    document.documentElement.setAttribute("data-theme", "dark");

    return () => clearInterval(intervalId);
  }, []);

  return (
    <HotkeysProvider>
      <main className="h-screen bg-primary">
        <RouterProvider router={routes} />
      </main>
    </HotkeysProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
