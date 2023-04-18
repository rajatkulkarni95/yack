import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { HotkeysProvider } from "react-hotkeys-hook";

const Main = () => {
  return (
    <HotkeysProvider>
      <main className="h-screen bg-neutral-900">
        <RouterProvider router={routes} />
      </main>
    </HotkeysProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
