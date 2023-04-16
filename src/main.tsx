import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { register } from "@tauri-apps/api/globalShortcut";

register("Control+Shift+Space", async () => {
  if (document.hasFocus()) return;
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;
  await appWindow.show();
  await appWindow.setFocus();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <main className="h-screen bg-neutral-900">
      <RouterProvider router={routes} />
    </main>
  </React.StrictMode>
);
