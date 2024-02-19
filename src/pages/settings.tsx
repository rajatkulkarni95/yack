import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setApiKey, getApiKey, setModel, getModel } from "../helpers/store";
import { MODELS_API } from "../constants/API";
import Header from "../components/Header";
import { DownChevron } from "../svg";
import fetcher from "../helpers/fetcher";

type TModel = {
  id: string;
}[];

const SettingsPage = () => {
  const [apiKey, setApiKeyState] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [availableModels, setAvailableModels] = useState<TModel>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettings() {
      const key = await getApiKey();
      setApiKeyState(key || "");
      const model = await getModel();
      setSelectedModel(model || "");

      if (key) {
        const response = await fetcher(MODELS_API);

        const gptModels = response?.data?.filter((model: { id: string }) =>
          model.id.startsWith("gpt")
        );
        setAvailableModels(gptModels);
      }
    }

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setApiKey(apiKey);
    await setModel(selectedModel);
    navigate("/");
  };

  return (
    <React.Fragment>
      <Header backToChat hideSettings />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start gap-4 p-4"
      >
        <p className="font-mono text-lg text-secondary">Settings</p>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm text-secondary">API Key</label>
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            placeholder="API Key"
            className="min-w-[450px] rounded border border-primary bg-secondary px-2 py-1.5 text-primary focus-within:border-secondary hover:border-secondary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-mono text-sm text-secondary">Model</label>
          <div className="relative flex items-center">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="mr-1 appearance-none rounded border border-primary bg-transparent py-1.5 pl-2 pr-8 text-primary hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.id}
                </option>
              ))}
            </select>
            <DownChevron className="absolute right-4 h-4 w-4 text-white" />
          </div>
        </div>
        <button
          type="submit"
          className="mr-1 rounded bg-action px-2 py-1.5 text-primary active:bg-actionHover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </form>
    </React.Fragment>
  );
};

export default SettingsPage;
