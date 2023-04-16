import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages";
import ChatPage from "./pages/chat/[id]";
// import LoginPage from "./pages/login";
// import CreateWorkspacePage from "./pages/workspace/create";
// import WorkspacePage from "./pages/workspace/[slug]";
// import SettingsPage from "./pages/settings";
// import RedirectPage from "./pages/RedirectPage";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: IndexPage,
  },
  {
    path: "/register",
    // Component: LoginPage,
  },
  {
    path: "/chat/:id", // this can have /chat/new when a blank page is opened, and then assign it a uuid post first message
    Component: ChatPage,
  },
  {
    path: "/history",
  },
]);

export default routes;
