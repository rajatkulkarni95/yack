import { useNavigate, useLocation } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import { useUsage } from "../hooks/useUsage";
import { LogoIcon } from "../svg";

interface IHeaderProps {
  haltNew?: boolean;
  hideHistory?: boolean;
}

export const hideApp = async () => {
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

  await appWindow.hide();
};

const Header = ({ haltNew, hideHistory }: IHeaderProps) => {
  const { promptCost, totalCost } = useUsage();
  const navigate = useNavigate();

  const onClickNew = () => {
    if (haltNew) return;
    navigate("/chat/new");
  };

  const onClickHistory = () => {
    navigate("/history");
  };

  const handleEscape = () => {
    if (hideHistory) {
      navigate(-1);
    } else {
      hideApp();
    }
  };

  useHotkeys("escape", handleEscape);

  useHotkeys("ctrl+h", onClickHistory);
  useHotkeys("ctrl+n", onClickNew);

  return (
    <header className="p-4 flex bg-secondary border-b border-primary h-12">
      <div className="flex items-center justify-between w-full">
        <LogoIcon className="w-6 h-6 text-primary" />
        <div className="flex items-center">
          <div className="px-2 py-1 bg-transparent cursor-default select-none hover:bg-primaryBtnHover font-mono text-secondary rounded mr-4">
            ${totalCost}
          </div>
          {!hideHistory && (
            <button
              className="px-2 py-1 bg-transparent hover:bg-primaryBtnHover rounded mr-4"
              onClick={onClickHistory}
            >
              <span className="text-sm font-normal text-secondary flex items-center">
                History{" "}
                <KbdShort keys={["Ctrl", "H"]} additionalStyles="ml-2" />
              </span>
            </button>
          )}
          <button
            className="px-2 py-1 bg-transparent hover:bg-primaryBtnHover rounded"
            onClick={onClickNew}
          >
            <span className="text-sm font-normal text-secondary flex items-center">
              New Chat <KbdShort keys={["Ctrl", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
