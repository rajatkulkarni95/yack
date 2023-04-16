import { Fragment, useEffect } from "react";
import TokenRegistration from "../components/TokenRegistration";
import { useNavigate } from "react-router-dom";

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const apiKey = localStorage.getItem("api_key");

    if (apiKey) {
      navigate("/chat/new");
    }
  }, []);

  return (
    <Fragment>
      <header className="p-4 flex bg-secondary border-b border-primary flex-col h-16">
        <h1 className="text-2xl font-bold text-primary mb-1">SpotGPT</h1>
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
