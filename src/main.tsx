import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { register } from "@tauri-apps/api/globalShortcut";
import { useKeyPress } from "./hooks/useKeyPress";

register("Control+Shift+Space", async () => {
  if (document.hasFocus()) return;
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;
  await appWindow.show();
  await appWindow.setFocus();
});

const Main = () => {
  const escPress: boolean = useKeyPress("Escape");

  const hideApp = async () => {
    const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

    await appWindow.hide();
  };

  if (escPress) {
    hideApp();
  }

  return (
    <React.StrictMode>
      <main className="h-screen bg-neutral-900">
        <RouterProvider router={routes} />
      </main>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
