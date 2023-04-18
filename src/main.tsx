import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { useKeyPress } from "./hooks/useKeyPress";

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
    <main className="h-screen bg-neutral-900">
      <RouterProvider router={routes} />
    </main>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
