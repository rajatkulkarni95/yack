import { useKeyPress } from "./hooks/useKeyPress";
import { PromptInput } from "./components/Input";

function App() {
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
      <section className="absolute bottom-0 w-full p-4">
        <PromptInput />
      </section>
    </main>
  );
}

export default App;
