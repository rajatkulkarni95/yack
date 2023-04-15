import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { register } from "@tauri-apps/api/globalShortcut";

register("Command+Shift+Space", async () => {
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

  await appWindow.show();
  await appWindow.setFocus();
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
