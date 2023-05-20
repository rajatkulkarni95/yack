import { useNavigate } from "react-router-dom";
import KbdShort from "./KbdShort";
import { useHotkeys } from "react-hotkeys-hook";
import { useUsage } from "../hooks/useUsage";
import { LeftArrow, LogoIcon, RightArrow } from "../svg";
import { useNavigation } from "../hooks/useNavigation";
import Tooltip from "./Tooltip";

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
  const {
    navigateToNextChat,
    navigateToPrevChat,
    onClickHistory,
    onClickNew,
    isLeftDisabled,
    isRightDisabled,
  } = useNavigation();

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
    <header className="flex h-12 border-b border-primary bg-primary p-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center">
          <LogoIcon className="h-10 w-20 text-primary" />{" "}
          {!hideHistory && (
            <Tooltip
              tooltip={
                !isLeftDisabled ? (
                  <span className="flex items-center font-sans text-sm font-normal text-secondary">
                    Prev
                    <KbdShort keys={["⌘", "["]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="group ml-4 mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigateToPrevChat}
                disabled={isLeftDisabled}
              >
                <LeftArrow className="h-4 w-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
          {!hideHistory && (
            <Tooltip
              tooltip={
                !isRightDisabled ? (
                  <span className="flex items-center font-sans text-sm font-normal text-secondary">
                    Next
                    <KbdShort keys={["⌘", "]"]} additionalStyles="ml-2" />
                  </span>
                ) : (
                  ""
                )
              }
            >
              <button
                className="group mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover disabled:cursor-not-allowed disabled:opacity-40"
                onClick={navigateToNextChat}
                disabled={isRightDisabled}
              >
                <RightArrow className="h-4 w-4 text-tertiary group-hover:text-primary" />
              </button>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center">
          <button
            className="mr-1 rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover"
            onClick={hideHistory ? handleEscape : onClickHistory}
          >
            <span className="flex items-center font-sans text-sm font-normal text-secondary">
              {hideHistory ? "Back" : "History"}{" "}
              <KbdShort keys={historyKbd} additionalStyles="ml-2" />
            </span>
          </button>

          <button
            className="rounded border border-primary bg-transparent px-2 py-1 hover:bg-primaryBtnHover"
            onClick={onClickNew}
          >
            <span className="flex items-center font-sans text-sm font-normal text-secondary">
              New Chat <KbdShort keys={["⌘", "N"]} additionalStyles="ml-2" />
            </span>
          </button>
          <div className="ml-2 cursor-default select-none rounded bg-action px-2 py-1 font-mono text-sm text-secondary hover:brightness-105">
            ${totalCost}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
