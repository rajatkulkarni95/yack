import { Fragment, useEffect } from "react";
// import Header from "~/components/common/Header";
import TokenRegistration from "../components/TokenRegistration";
import Header from "../components/Header";

function Index() {
  //   const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // if (token) {
    //   router.push("/dashboard");
    // }
  }, []);

  return (
    <Fragment>
      <Header classes="flex-col">
        <h1 className="text-2xl font-bold text-primary mb-1">SpotGPT</h1>
        <p className="text-base font-normal text-secondary">
          Instantly access ChatGPT on your Mac - get quick answers to anything
          with just a few taps on your keyboard!
        </p>
      </Header>
      <TokenRegistration />
    </Fragment>
  );
}

export default Index;
