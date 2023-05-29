import { Fragment, useEffect } from "react";
import TokenRegistration from "../components/TokenRegistration";
import { useNavigate } from "react-router-dom";
import { LogoIcon } from "../svg";
import { getApiKey } from "../helpers/store";

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAPIKey() {
      const key = await getApiKey();

      if (key) {
        navigate("/chat/new");
      }
    }

    checkAPIKey();
  }, []);

  return (
    <Fragment>
      <header
        className="flex flex-col border-b border-primary bg-secondary px-4 py-2"
        data-tauri-drag-region
      >
        <div className="flex items-center">
          <LogoIcon className="h-10 w-20 text-primary" />{" "}
        </div>
        <p className="text-base font-normal text-secondary">
          Instantly access ChatGPT on your Mac - get quick answers to anything
          with just a few taps on your keyboard!
        </p>
      </header>
      <TokenRegistration />
    </Fragment>
  );
}

export default Index;
