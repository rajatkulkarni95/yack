import { createBrowserRouter } from "react-router-dom";
import IndexPage from "./pages";
import ChatPage from "./pages/chat/[id]";
import HistoryPage from "./pages/history";
import SettingsPage from "./pages/settings";

const routes = createBrowserRouter([
  {
    path: "/",
    Component: IndexPage,
  },
  {
    path: "/chat/:id", // this can have /chat/new when a blank page is opened, and then assign it a uuid post first message
    Component: ChatPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
  { path: "/settings", Component: SettingsPage },
]);

export default routes;
