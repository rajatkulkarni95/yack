import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { HotkeysProvider } from "react-hotkeys-hook";
import { baseSetups } from "./helpers/localstorage";

const Main = () => {
  baseSetups();
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
