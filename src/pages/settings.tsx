import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setApiKey, getApiKey } from "../helpers/store";
import { MODELS_API } from "../constants/API";
import Header from "../components/Header";
import { DownArrow, DownChevron } from "../svg";

const SettingsPage = () => {
  const [apiKey, setApiKeyState] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSettings() {
      const key = await getApiKey();
      setApiKeyState(key || "");
      // Fetch and set the selected model
    }

    fetchSettings();
  }, []);

  const handleSave = async () => {
    await setApiKey(apiKey);
    // Save the selected model
    navigate("/");
  };

  return (
    <React.Fragment>
      <Header backToChat hideSettings />
      <div className="flex flex-col items-start gap-4 p-4">
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
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
            </select>
            <DownChevron className="absolute right-4 h-4 w-4 text-white" />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mr-1 rounded bg-action px-2 py-1.5 text-primary active:bg-actionHover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </React.Fragment>
  );
};

export default SettingsPage;
