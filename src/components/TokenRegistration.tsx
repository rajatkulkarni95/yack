// import { useRouter } from "next/router";
import { useState } from "react";
// import { API_ENDPOINTS } from "~/constants/API";
// import fetcher from "~/helpers/fetcher";
import UpdateIcon from "~/svg/update.svg";

const TokenRegistration = () => {
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  //   const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setIsSubmitting(true);
    // setError("");
    // localStorage.setItem("token", token);
    // try {
    //   await fetcher(API_ENDPOINTS.user);
    //   router.push("/dashboard");
    // } catch (error) {
    //   setError("Invalid token");
    //   localStorage.removeItem("token");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <section className="flex flex-col w-full p-4">
      <form className="flex flex-col w-full mt-3" onSubmit={handleSubmit}>
        <label
          htmlFor="token"
          className="text-base font-normal text-secondary mb-1"
        >
          OpenAI API Key
        </label>
        <div className="flex flex-row items-center">
          <input
            type="text"
            id="token"
            name="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`w-full rounded-md focus-within:border-secondary border border-primary bg-primary h-fit w-96 px-4 py-2 font-sans text-base text-primary hover:border-secondary placeholder:text-placeholder`}
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxx"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className={`w-full ml-2 py-2 px-3 border w-fit border-primary rounded-md bg-secondary text-primary font-medium text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:border-transparent ${
              isSubmitting
                ? "cursor-not-allowed"
                : "cursor-default hover:bg-action"
            }  duration-75`}
            disabled={isSubmitting}
          >
            Get Started
          </button>
        </div>
        {error && <p className="text-sm font-normal text-err mt-2">{error}</p>}
      </form>

      <p className="text-base text-secondary mt-8">
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
      <div className="border border-dashed border-primary my-2" />
      <h2 className="text-xl text-primary font-bold mt-2">Disclaimer</h2>
      <p className="text-base text-secondary mt-2">
        <ul>
          <li>
            We do not store your API key on our servers.{" "}
            <i>Hell I don't even have a server.</i>
          </li>
          <li>
            We do not share your API key with anyone.{" "}
            <i>Not in that business.</i>
          </li>{" "}
          <li>
            We do not sell your API key to anyone.{" "}
            <i>Not in that business as well.</i>
          </li>{" "}
        </ul>
      </p>
      <div className="border border-dashed border-primary my-4" />
      <p className="text-base text-secondary mt-8">
        SpotGPT is merely a wrapper around the ChatGPT API, all your questions
        and answers are either stored on your device in the browser's local
        storage or on OpenAI's servers.
      </p>
    </section>
  );
};

export default TokenRegistration;
