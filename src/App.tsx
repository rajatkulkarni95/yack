import { useKeyPress } from "./hooks/useKeyPress";
import { PromptInput } from "./components/Chat/Input";

function App() {
  return (
    <section className="absolute bottom-0 w-full p-4">
      <PromptInput />
    </section>
  );
}

export default App;
