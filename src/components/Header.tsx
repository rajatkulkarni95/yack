import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import { useUsage } from "../hooks/useUsage";
import { LogoIcon } from "../svg";
import { useNavigation } from "../hooks/useNavigation";

interface IHeaderProps {
  haltNew?: boolean;
  hideHistory?: boolean;
}

export const hideApp = async () => {
  const appWindow = await (await import("@tauri-apps/api/window")).appWindow;

  await appWindow.hide();
};

const Header = ({ hideHistory }: IHeaderProps) => {
  const { totalCost } = useUsage();

  const navigate = useNavigate();
  const { navigateToNextChat, navigateToPrevChat, onClickHistory, onClickNew } =
    useNavigation();

  const handleEscape = () => {
    if (hideHistory) {
      navigate(-1);
    } else {
      hideApp();
    }
  };

  useHotkeys("escape", handleEscape);

  useHotkeys("meta+p", onClickHistory);
  useHotkeys("meta+n", onClickNew);

  useHotkeys("meta+[", navigateToPrevChat);
  useHotkeys("meta+]", navigateToNextChat);

  const historyKbd = hideHistory ? ["Esc"] : ["⌘", "P"];

  return (
    <header className="p-4 flex bg-primary border-b border-primary h-12">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <LogoIcon className="w-20 h-10 text-primary" />{" "}
        </div>
        <div className="flex items-center">
          {!hideHistory && (
            <button
              className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded mr-1"
              onClick={navigateToPrevChat}
            >
              <span className="text-sm font-normal text-secondary font-sans flex items-center">
                Prev
                <KbdShort keys={["⌘", "["]} additionalStyles="ml-2" />
              </span>
            </button>
          )}

          {!hideHistory && (
            <button
              className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded mr-1"
              onClick={navigateToNextChat}
            >
              <span className="text-sm font-normal text-secondary font-sans flex items-center">
                Next
                <KbdShort keys={["⌘", "]"]} additionalStyles="ml-2" />
              </span>
            </button>
          )}
          <button
            className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded mr-1"
            onClick={hideHistory ? handleEscape : onClickHistory}
          >
            <span className="text-sm font-normal text-secondary font-sans flex items-center">
              {hideHistory ? "Back" : "History"}{" "}
              <KbdShort keys={historyKbd} additionalStyles="ml-2" />
            </span>
          </button>

          <button
            className="px-2 py-1 bg-transparent border border-primary hover:bg-primaryBtnHover rounded"
            onClick={onClickNew}
          >
            <span className="text-sm font-normal font-sans text-secondary flex items-center">
              New Chat <KbdShort keys={["⌘", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
          <div className="px-2 py-1 bg-action cursor-default select-none hover:brightness-105 font-mono text-sm text-secondary rounded ml-4">
            ${totalCost}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
