import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { useKeyPress } from "./hooks/useKeyPress";

function App() {
  const escPress: boolean = useKeyPress("Escape");

  const hideApp = async () => {
    const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

    await appWindow.hide();
  };

  if (escPress) {
    hideApp();
  }

  return <main className="h-screen w-screen bg-neutral-900"></main>;
}

export default App;
