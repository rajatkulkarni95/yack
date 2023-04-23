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
      <header className="px-4 py-2 flex bg-secondary border-b border-primary flex-col ">
        <div className="flex items-center">
          <LogoIcon className="w-20 h-10 text-primary" />{" "}
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
