import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";

import "./index.css";

import { HotkeysProvider } from "react-hotkeys-hook";
import { useEffect, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import { getSavedTheme, saveTheme } from "./helpers/store";

const Main = () => {
  const [theme, setTheme] = useState<string>("");

  useEffect(() => {
    // Check for updates every hour
    const intervalId = setInterval(
      () => emit("tauri://update"),
      60 * 60 * 1000
    );

    async function setStoredTheme() {
      const storedTheme = await getSavedTheme();

      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme("dark");
      }
    }

    setStoredTheme();

    return () => clearInterval(intervalId);
  }, []);

  const html = document.querySelector("html");
  if (html) {
    const observer = new MutationObserver((mutationsList, observer) => {
      // Iterate over each mutation
      for (let mutation of mutationsList) {
        // Check if the data-theme attribute was changed
        if (mutation.attributeName === "data-theme" && html.dataset.theme) {
          setTheme(html.dataset.theme);
          saveTheme(html.dataset.theme);
        }
      }
    });

    // Observe changes to the html element
    observer.observe(html, { attributes: true });
  }

  useEffect(() => {
    const htmlTheme = document.querySelector("html")?.dataset.theme;
    if (htmlTheme !== theme) {
      document.querySelector("html")?.setAttribute("data-theme", theme);

      saveTheme(theme);
    }
  }, [theme]);

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
