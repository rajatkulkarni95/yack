// import { useRouter } from "next/router";
import { useState } from "react";
import { MODELS_API } from "../constants/API";
import fetcher from "../helpers/fetcher";
import { useNavigate } from "react-router-dom";
import { incrementUsage, setApiKey } from "../helpers/store";

const TokenRegistration = () => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    await setApiKey(token);
    await incrementUsage({
      total_tokens: 0,
    });

    try {
      await fetcher(MODELS_API);
      navigate("/chat/new");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (token) {
        setToken("");
        e.stopPropagation();
      }
    }
  };

  return (
    <section className="flex w-full flex-col p-4">
      <form className="mt-3 flex w-full flex-col" onSubmit={handleSubmit}>
        <label
          htmlFor="token"
          className="mb-1 text-base font-normal text-secondary"
        >
          OpenAI API Key
        </label>
        <div className="flex w-full flex-col gap-2 sm:flex-row md:items-center">
          <input
            type="text"
            id="token"
            name="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`h-fit w-[460px] rounded-md border border-primary bg-primary px-4 py-2 font-sans text-base text-primary placeholder:text-placeholder focus-within:border-secondary hover:border-secondary`}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxx"
            disabled={isSubmitting}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            autoFocus
            onKeyDown={onKeyDown}
          />
          <button
            type="submit"
            className={`w-fit rounded-md border border-primary bg-secondary px-3 py-2 text-base font-medium text-primary focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 ${
              isSubmitting || !token
                ? "cursor-not-allowed"
                : "cursor-default hover:bg-action"
            }  duration-75`}
            disabled={isSubmitting || !token}
          >
            Get Started
          </button>
        </div>
        {error && <p className="mt-2 text-sm font-normal text-err">{error}</p>}
      </form>

      <p className="mt-8 text-base text-secondary">
        The OpenAI API uses API keys for authentication. Visit your{" "}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://platform.openai.com/account/api-keys"
          className="text-cyan-400 hover:text-cyan-300"
        >
          API Keys page
        </a>{" "}
        to retrieve the API key you'll use in your requests.
      </p>
      <div className="my-4 border border-dashed border-primary" />
      <h2 className="text-xl font-bold text-primary">Disclaimer</h2>
      <ul className="mt-2 text-base text-secondary">
        <li>
          We do not store your API key on our servers.{" "}
          <i>Hell I don't even have a server.</i>
        </li>
        <li>
          We do not share your API key with anyone. <i>Not in that business.</i>
        </li>{" "}
        <li>
          We do not sell your API key to anyone.{" "}
          <i>Not in that business as well.</i>
        </li>{" "}
      </ul>
      <div className="my-4 border border-dashed border-primary" />
      <p className="mt-8 text-base text-secondary">
        Yack is merely a wrapper around the ChatGPT API, all your questions and
        answers are either stored on your device or on OpenAI's servers.
      </p>
    </section>
  );
};

export default TokenRegistration;
